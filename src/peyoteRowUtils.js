// Peyote row numbering utilities based on reference image pattern
// The reference image shows a 50x50 grid with row 0 in the center (y=24)
// Pattern: distance from center row modulo 10, cycling 0-9

/**
 * Calculate the peyote row number for a bead at position (x, y) in a grid
 * Based on the reference image pattern where:
 * - Center rows show 0 for all columns
 * - Pattern alternates between odd and even numbers based on column
 * - Odd columns (0,2,4...): odd numbers (1,3,5,7,9,1,3,5...)
 * - Even columns (1,3,5...): even numbers (0,2,4,6,8,0,2,4...)
 * - Pattern cycles every 10 rows from center
 * 
 * @param {number} x - Column position (0-indexed)
 * @param {number} y - Row position (0-indexed from top)
 * @param {number} gridSize - Size of the square grid
 * @param {number} startingRowNumber - Starting row number offset (default: 0)
 * @returns {number} The peyote row number for this bead position
 */
export function calculatePeyoteRowNumber(x, y, gridSize, startingRowNumber = 0) {
  // Calculate the center row index (where all columns show 0)
  // For 50x50: center row is at y=24
  const centerRowIndex = Math.floor(gridSize / 2) - 1  // y=24 for 50x50
  
  // If we're in the center row, always return 0
  if (y === centerRowIndex) {
    return startingRowNumber
  }
  
  // Calculate distance from center
  const distance = Math.abs(y - centerRowIndex)
  
  // Determine if this is an odd or even column
  const isOddColumn = x % 2 === 0  // Column 0, 2, 4... are "odd" in the pattern
  
  // Calculate base row number based on column type and distance
  let baseRowNumber
  if (isOddColumn) {
    // Odd columns: alternating pattern based on distance
    if (distance === 1) {
      baseRowNumber = 1  // Adjacent to center
    } else if (distance === 2) {
      baseRowNumber = 3  // Two rows from center
    } else {
      // For further distances, cycle the pattern
      const cycleIndex = (distance - 3) % 10
      const cyclePattern = [5, 7, 9, 1, 3, 5, 7, 9, 1, 3]
      baseRowNumber = cyclePattern[cycleIndex]
    }
  } else {
    // Even columns: alternating pattern based on distance
    if (distance === 1) {
      baseRowNumber = 2  // Adjacent to center
    } else if (distance === 2) {
      baseRowNumber = 4  // Two rows from center
    } else {
      // For further distances, cycle the pattern
      const cycleIndex = (distance - 3) % 10
      const cyclePattern = [6, 8, 0, 2, 4, 6, 8, 0, 2, 4]
      baseRowNumber = cyclePattern[cycleIndex]
    }
  }
  
  // Apply the starting row offset
  return baseRowNumber + startingRowNumber
}

/**
 * Get the center row index for a given grid size
 * @param {number} gridSize - Size of the square grid
 * @returns {number} The y-coordinate of the center row (row 0)
 */
export function getCenterRowIndex(gridSize) {
  return Math.floor(gridSize / 2) - (gridSize % 2 === 0 ? 1 : 0)
}

/**
 * Validate that the row calculation matches the reference pattern
 * This function can be used for testing with the 50x50 reference image
 * @param {number} gridSize - Size of the grid to validate
 * @returns {boolean} True if the pattern matches expected values
 */
export function validateRowPattern(gridSize = 50) {
  const centerRowIndex = getCenterRowIndex(gridSize)
  
  // Test a few key positions based on the reference image description
  const testCases = [
    { x: 0, y: centerRowIndex, expected: 0 }, // Center row should be 0
    { x: 0, y: centerRowIndex - 1, expected: 1 }, // One row above should be 1
    { x: 0, y: centerRowIndex + 1, expected: 1 }, // One row below should be 1
    { x: 0, y: centerRowIndex - 9, expected: 9 }, // Nine rows above should be 9
    { x: 0, y: centerRowIndex + 9, expected: 9 }, // Nine rows below should be 9
    { x: 0, y: centerRowIndex - 10, expected: 0 }, // Ten rows above should cycle back to 0
    { x: 0, y: centerRowIndex + 10, expected: 0 }, // Ten rows below should cycle back to 0
  ]
  
  return testCases.every(({ x, y, expected }) => {
    const actual = calculatePeyoteRowNumber(x, y, gridSize)
    return actual === expected
  })
}
