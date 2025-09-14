// Shared utilities for bead position calculations

// Get bead position from ID for different stitch types
export function getBeadPosition(beadId, stitchType, gridSize) {
  const row = Math.floor(beadId / gridSize)
  const col = beadId % gridSize

  // For all current stitch types, the position calculation is the same
  // This abstraction allows for future customization per stitch type
  return { row, col }
}

// Get new bead ID from position for different stitch types
export function getBeadIdFromPosition(row, col, gridSize) {
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    return row * gridSize + col
  }
  return null
}

// Calculate preview beads for move operation
export function calculatePreviewBeads(selectedBeads, moveOffset, beads, canvasColors, stitchType, gridSize, layoutRotation) {
  if (selectedBeads.size === 0 || (moveOffset.x === 0 && moveOffset.y === 0)) {
    return []
  }

  const previews = []
  const selectedArray = Array.from(selectedBeads)

  selectedArray.forEach(beadId => {
    const originalBead = beads.find(b => b.id === beadId)
    if (originalBead && canvasColors[beadId] !== undefined) {
      // Get current position using proper mapping
      const position = getBeadPosition(beadId, stitchType, gridSize, layoutRotation)

      const newRow = position.row + moveOffset.y
      const newCol = position.col + moveOffset.x

      // Get new bead ID using proper mapping
      const newBeadId = getBeadIdFromPosition(newRow, newCol, gridSize)

      if (newBeadId !== null) {
        // Find the bead at the new position to get its actual coordinates
        const targetBead = beads.find(b => b.id === newBeadId)
        if (targetBead) {
          const newBead = {
            ...targetBead,
            id: `preview_${beadId}`,
          }
          previews.push(newBead)
        }
      }
    }
  })

  return previews
}

// Apply move operation to canvas
export function applyMoveToCanvas(selectedBeads, moveOffset, canvasColors, stitchType, gridSize, layoutRotation) {
  if (selectedBeads.size === 0 || (moveOffset.x === 0 && moveOffset.y === 0)) {
    return canvasColors
  }

  const newCanvas = {...canvasColors}
  const selectedArray = Array.from(selectedBeads)

  // Create a mapping of old bead IDs to new positions
  const beadMoves = new Map()

  selectedArray.forEach(beadId => {
    const colorId = canvasColors[beadId]
    if (colorId !== undefined) {
      // Get current position using proper mapping
      const position = getBeadPosition(beadId, stitchType, gridSize, layoutRotation)

      const newRow = position.row + moveOffset.y
      const newCol = position.col + moveOffset.x

      // Get new bead ID using proper mapping
      const newBeadId = getBeadIdFromPosition(newRow, newCol, gridSize)

      if (newBeadId !== null) {
        beadMoves.set(beadId, { newBeadId, colorId })
      }
    }
  })

  // First, remove the selected beads from their current positions
  selectedArray.forEach(beadId => {
    delete newCanvas[beadId]
  })

  // Then, add them at their new positions
  beadMoves.forEach(({ newBeadId, colorId }) => {
    newCanvas[newBeadId] = colorId
  })

  return newCanvas
}