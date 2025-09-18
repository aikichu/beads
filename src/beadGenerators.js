// Bead generation functions for different stitch types

const range = (s) => [...Array(s).keys()]

// Constants for bead dimensions
export const BEAD_SIZE_RATIO = 0.82
export const BEAD_WIDTH = 2 * BEAD_SIZE_RATIO
export const BEAD_HEIGHT = 2


// Square stitch generator
export function generateSquareBeads(size, h, w, totalH, totalW, angle) {
  const gridWidth = size * w
  const gridHeight = size * h
  let startX, startY

  if (angle === 90 || angle === 270) {
    // Horizontal orientation
    startX = (totalW - gridWidth) / 2
    startY = (totalH - gridHeight) / 2
  } else {
    // Vertical orientation (0° and 180°)
    startX = (totalW - gridHeight) / 2
    startY = (totalH - gridWidth) / 2
  }

  const beads = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (angle === 90 || angle === 270) {
        // Horizontal orientation
        beads.push({
          id: i * size + j,
          x: startX + w * j,
          y: startY + h * i,
          height: h,
          width: w,
        })
      } else {
        // Vertical orientation
        beads.push({
          id: i * size + j,
          x: startX + h * i,
          y: startY + w * j,
          height: w,
          width: h,
        })
      }
    }
  }
  return beads
}

// Peyote stitch generator (vertical orientation)
export function generatePeyoteBeads(size, h, w, totalH, totalW, angle) {
  if (angle === 180) {
    return range(size).flatMap(i => range(size).flatMap(j=> ({
      id: i*size + j,
      x: totalW - (w * (i + 1.5)) - 6,
      y: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)) + 1,
      height: h,
      width: w,
    })))
  } else {
    // Default 0° rotation
    return range(size).flatMap(i => range(size).flatMap(j=> ({
      id: i*size + j,
      x: w * (i + 1.5) + 2,
      y: i % 2 ? h * (j + 1) : h * (j + 1.5),
      height: h,
      width: w,
    })))
  }
}

// Brick stitch generator (horizontal orientation)
export function generateBrickBeads(size, h, w, totalH, totalW, angle) {
  if (angle === 90) {
    return range(size).flatMap(i => range(size).flatMap(j=> ({
      id: i*size + j,
      x: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)),
      y: w * (i + 1.5) + 3,
      height: w,
      width: h,
    })))
  } else {
    // 270° rotation
    return range(size).flatMap(i => range(size).flatMap(j=> ({
      id: i*size + j,
      x: i % 2 ? h * (j + 1) : h * (j + 1.5) - 2,
      y: totalW - (w * (i + 1.5) + 3) - 2,
      height: w,
      width: h,
    })))
  }
}

// Legacy offset stitch generator (for backward compatibility)
export function generateOffsetBeads(size, h, w, totalH, totalW, angle) {
  switch(angle) {
    case 90:
      return range(size).flatMap(i => range(size).flatMap(j=> ({
        id: i*size + j,
        x: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)),
        y: w * (i + 1.5) + 3,
        height: w,
        width: h,
      })))
    case 180:
      return range(size).flatMap(i => range(size).flatMap(j=> ({
        id: i*size + j,
        x: totalW - (w * (i + 1.5)) - 6,
        y: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)) + 1,
        height: h,
        width: w,
      })))
    case 270:
      return range(size).flatMap(i => range(size).flatMap(j=> ({
        id: i*size + j,
        x: i % 2 ? h * (j + 1) : h * (j + 1.5) - 2,
        y: totalW - (w * (i + 1.5) + 3) - 2,
        height: h,
        width: w,
      })))
    default:
      return range(size).flatMap(i => range(size).flatMap(j=> ({
        id: i*size + j,
        x: w * (i + 1.5) + 2,
        y: i % 2 ? h * (j + 1) : h * (j + 1.5),
        height: h,
        width: w,
      })))
  }
}

// Fringe bead generator for brick stitch
export function generateFringeBeads(fringeVisible, fringeLength, mainBeads, size, h, w, angle) {
  if (!fringeVisible || fringeLength <= 0) {
    return []
  }

  const fringeBeads = []
  let fringeId = 10000 // Start fringe IDs from 10000 to avoid conflicts

  // Get all bottom row bead IDs
  const bottomRowBeadIds = getBottomRowBeadIds(size)

  bottomRowBeadIds.forEach(beadId => {
    const mainBead = mainBeads.find(bead => bead.id == beadId)
    if (!mainBead) return

    const startX = mainBead.x + mainBead.width / 2
    const startY = mainBead.y + mainBead.height

    // Generate fringe beads vertically downward for all bottom row beads
    for (let i = 0; i < fringeLength; i++) {
      fringeBeads.push({
        id: `fringe_${fringeId++}`,
        x: startX - w / 2,
        y: startY + (i * w),
        width: w,
        height: h,
        isFringe: true,
        parentBeadId: beadId,
        fringeIndex: i
        // No default colorId - will be handled by Bead component
      })
    }
  })

  return fringeBeads
}

// Helper function to get bottom row bead IDs for brick stitch
export function getBottomRowBeadIds(size) {
  const bottomRowStart = (size - 1) * size
  return Array.from({ length: size }, (_, i) => bottomRowStart + i)
}

// Main bead generator function
export function makeBeads(size, h, w, totalH, totalW, angle, stitch) {
  switch(stitch) {
    case 'square':
      return generateSquareBeads(size, h, w, totalH, totalW, angle)
    case 'peyote':
      return generatePeyoteBeads(size, h, w, totalH, totalW, angle)
    case 'brick':
      return generateBrickBeads(size, h, w, totalH, totalW, angle)
    default:
      // Fallback to original offset layout for backward compatibility
      return generateOffsetBeads(size, h, w, totalH, totalW, angle)
  }
}