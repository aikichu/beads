// Delta-based history management for efficient memory usage

import { writable, get } from 'svelte/store'

/**
 * Creates a delta (difference) between two canvas states
 * @param {Object} oldCanvas - Previous canvas state
 * @param {Object} newCanvas - New canvas state
 * @returns {Object} Delta object with added, modified, and removed beads
 */
function createDelta(oldCanvas, newCanvas) {
  const delta = {
    added: {},
    modified: {},
    removed: []
  }

  // Find added and modified beads
  for (const [beadId, colorId] of Object.entries(newCanvas)) {
    if (!(beadId in oldCanvas)) {
      // Bead was added
      delta.added[beadId] = colorId
    } else if (oldCanvas[beadId] !== colorId) {
      // Bead was modified
      delta.modified[beadId] = {
        old: oldCanvas[beadId],
        new: colorId
      }
    }
  }

  // Find removed beads
  for (const beadId in oldCanvas) {
    if (!(beadId in newCanvas)) {
      delta.removed.push({
        id: beadId,
        color: oldCanvas[beadId]
      })
    }
  }

  return delta
}

/**
 * Applies a delta to a canvas state
 * @param {Object} canvas - Current canvas state
 * @param {Object} delta - Delta to apply
 * @param {boolean} reverse - Whether to apply in reverse (for undo)
 * @returns {Object} New canvas state
 */
function applyDelta(canvas, delta, reverse = false) {
  const newCanvas = { ...canvas }

  if (reverse) {
    // Reverse apply (undo)
    // Remove added beads
    for (const beadId in delta.added) {
      delete newCanvas[beadId]
    }

    // Restore modified beads to old values
    for (const [beadId, change] of Object.entries(delta.modified)) {
      newCanvas[beadId] = change.old
    }

    // Restore removed beads
    for (const { id, color } of delta.removed) {
      newCanvas[id] = color
    }
  } else {
    // Forward apply (redo)
    // Add new beads
    Object.assign(newCanvas, delta.added)

    // Apply modifications
    for (const [beadId, change] of Object.entries(delta.modified)) {
      newCanvas[beadId] = change.new
    }

    // Remove beads
    for (const { id } of delta.removed) {
      delete newCanvas[id]
    }
  }

  return newCanvas
}

/**
 * Creates a delta-based history store
 * @param {Object} initialCanvas - Initial canvas state
 * @returns {Object} History store with undo/redo functionality
 */
export function createDeltaHistory(initialCanvas = {}) {
  const history = writable({
    baseState: initialCanvas,
    deltas: [],
    cursor: 0
  })

  // Keep track of current canvas state for efficiency
  let currentState = initialCanvas

  return {
    subscribe: history.subscribe,

    commit: (newCanvas) => {
      history.update(h => {
        // Create delta from current state to new state
        const delta = createDelta(currentState, newCanvas)

        // Only add if there are actual changes
        const hasChanges =
          Object.keys(delta.added).length > 0 ||
          Object.keys(delta.modified).length > 0 ||
          delta.removed.length > 0

        if (!hasChanges) return h

        // Remove any deltas after cursor (for branching history)
        const newDeltas = h.deltas.slice(0, h.cursor)
        newDeltas.push(delta)

        currentState = newCanvas

        // Limit history size to prevent memory bloat
        const MAX_HISTORY = 100
        if (newDeltas.length > MAX_HISTORY) {
          // Compact old history by creating new base state
          const compactCount = Math.floor(MAX_HISTORY / 2)
          let compactedState = h.baseState

          for (let i = 0; i < compactCount; i++) {
            compactedState = applyDelta(compactedState, newDeltas[i])
          }

          return {
            baseState: compactedState,
            deltas: newDeltas.slice(compactCount),
            cursor: newDeltas.length - compactCount
          }
        }

        return {
          ...h,
          deltas: newDeltas,
          cursor: newDeltas.length
        }
      })
    },

    undo: () => {
      const h = get(history)
      if (h.cursor > 0) {
        // Apply delta in reverse
        currentState = applyDelta(currentState, h.deltas[h.cursor - 1], true)
        history.update(h => ({ ...h, cursor: h.cursor - 1 }))
        return currentState
      }
      return currentState
    },

    redo: () => {
      const h = get(history)
      if (h.cursor < h.deltas.length) {
        // Apply delta forward
        currentState = applyDelta(currentState, h.deltas[h.cursor])
        history.update(h => ({ ...h, cursor: h.cursor + 1 }))
        return currentState
      }
      return currentState
    },

    getCurrentState: () => {
      // Reconstruct current state from base + deltas
      const h = get(history)
      let state = h.baseState

      for (let i = 0; i < h.cursor; i++) {
        state = applyDelta(state, h.deltas[i])
      }

      currentState = state
      return state
    },

    reset: () => {
      const emptyCanvas = {}
      history.set({
        baseState: emptyCanvas,
        deltas: [],
        cursor: 0
      })
      currentState = emptyCanvas
    },

    // Utility getters
    get canUndo() {
      const h = get(history)
      return h.cursor > 0
    },

    get canRedo() {
      const h = get(history)
      return h.cursor < h.deltas.length
    }
  }
}