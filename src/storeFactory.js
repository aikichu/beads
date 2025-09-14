// Factory functions for creating consistent stores

import { writable } from 'svelte/store'

/**
 * Creates a basic store with common reset functionality
 * @param {*} initialValue - Initial value for the store
 * @param {Object} customMethods - Additional methods to add to the store
 */
export function createStore(initialValue, customMethods = {}) {
  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    set,
    update,
    reset: () => set(typeof initialValue === 'function' ? initialValue() : initialValue),
    ...customMethods
  }
}

/**
 * Creates a toggle store (boolean)
 * @param {boolean} initialValue - Initial boolean value
 */
export function createToggleStore(initialValue = false) {
  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    set,
    update,
    toggle: () => update(value => !value),
    reset: () => set(initialValue)
  }
}

/**
 * Creates a selection store (Set)
 * @param {Set} initialValue - Initial Set
 */
export function createSelectionStore(initialValue = new Set()) {
  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    set,
    update,
    add: (item) => update(items => new Set([...items, item])),
    remove: (item) => update(items => {
      const newSet = new Set(items)
      newSet.delete(item)
      return newSet
    }),
    clear: () => set(new Set()),
    reset: () => set(new Set())
  }
}

/**
 * Creates a position store
 * @param {{x: number, y: number}} initialValue - Initial position
 */
export function createPositionStore(initialValue = {x: 0, y: 0}) {
  const { subscribe, set, update } = writable(initialValue)

  return {
    subscribe,
    set,
    update,
    move: (dx, dy) => update(pos => ({x: pos.x + dx, y: pos.y + dy})),
    reset: () => set(initialValue)
  }
}