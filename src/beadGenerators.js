// Bead generation functions for different stitch types

const range = (s) => [...Array(s).keys()]

// Constants for bead dimensions
export const BEAD_SIZE_RATIO = 0.82
export const BEAD_WIDTH = 2 * BEAD_SIZE_RATIO
export const BEAD_HEIGHT = 2

// RAW stitch generator
export function generateRawBeads(size, h, w) {
  const beads = []
  const unitSpacing = w * 0.8 // Closer spacing so units overlap
  const beadMap = new Map() // Track bead positions to avoid duplicates

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const centerX = j * unitSpacing + w
      const centerY = i * unitSpacing + h

      // Define 4 bead positions for this unit
      const positions = [
        { x: centerX, y: centerY - unitSpacing/2, key: `${j}_${i-0.5}` },     // top (shared with unit above)
        { x: centerX + unitSpacing/2, y: centerY, key: `${j+0.5}_${i}` },     // right (shared with unit right)
        { x: centerX, y: centerY + unitSpacing/2, key: `${j}_${i+0.5}` },     // bottom (shared with unit below)
        { x: centerX - unitSpacing/2, y: centerY, key: `${j-0.5}_${i}` }      // left (shared with unit left)
      ]

      positions.forEach((pos) => {
        // Only create a bead if this position doesn't already exist (avoid duplicates from sharing)
        if (!beadMap.has(pos.key)) {
          const beadId = beadMap.size // Sequential ID
          beadMap.set(pos.key, beadId)

          beads.push({
            id: beadId,
            x: pos.x,
            y: pos.y,
            width: w * 0.4,
            height: h * 0.4,
            shape: 'circle'
          })
        }
      })
    }
  }
  return beads
}

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

// Main bead generator function
export function makeBeads(size, h, w, totalH, totalW, angle, stitch) {
  switch(stitch) {
    case 'raw':
      return generateRawBeads(size, h, w)
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