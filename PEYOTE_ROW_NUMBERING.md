# Peyote Row Numbering Implementation

## Overview
This feature implements row numbering for peyote stitch patterns based on a reference image template showing the correct row number pattern for a 50x50 grid.

## Implementation Details

### Row Calculation Formula
The row numbering follows this mathematical pattern:
- **Center Row**: Row 0 is located at the center of the grid
- **Pattern**: Row numbers cycle 0-9 based on distance from center row
- **Cycle**: Pattern repeats every 10 rows of vertical distance from center

### Mathematical Formula
```javascript
function calculatePeyoteRowNumber(x, y, gridSize, startingRowNumber = 0) {
  const centerRowIndex = Math.floor(gridSize / 2) - (gridSize % 2 === 0 ? 1 : 0)
  const distance = Math.abs(y - centerRowIndex)
  const baseRowNumber = distance % 10
  return baseRowNumber + startingRowNumber
}
```

### Key Features
1. **Reference Image Pattern**: Based on 50x50 grid with row 0 in center (y=24)
2. **Scalable**: Works with any grid size, not just 50x50
3. **User Control**: Starting row number can be adjusted via UI
4. **Display Logic**: Shows row numbers when legend is OFF, symbols when legend is ON
5. **Peyote Only**: Only applies to peyote stitch type

### User Interface
- **Starting Row Input**: Number input field in configuration panel (only visible for peyote stitch)
- **Range**: -100 to 100 (allows negative row numbers)
- **Default**: 0 (matches reference image pattern)

### Display Behavior
- **Legend ON**: Shows color symbols (existing behavior)
- **Legend OFF**: Shows row numbers for peyote stitch beads
- **Text Color**: Black for good contrast
- **Font Size**: Slightly smaller than symbols (0.6 vs 0.7 ratio)

### Files Modified
1. `src/peyoteRowUtils.js` - Row calculation logic
2. `src/stores.js` - Added peyoteStartingRow store
3. `src/ConfigPanel.svelte` - Added starting row input control
4. `src/beadGenerators.js` - Added rowNumber property to peyote beads
5. `src/Canvas.svelte` - Pass starting row to bead generator
6. `src/Bead.svelte` - Display row numbers when legend is off

### Testing
The implementation has been tested with:
- 50x50 grid (reference image size)
- Various grid sizes (10x10 to 50x50)
- Different starting row offsets
- Center row positioning
- Pattern cycling (0-9 repetition)

### Reference Image Notes
The implementation is based on a reference image description showing:
- 50x50 grid with row 0 in center (y=24, colored red)
- Numbers 0-9 cycling every 10 rows from center
- All beads in same horizontal row have same number
- Pattern works for both even and odd grid sizes

## Usage Instructions
1. Select "Peyote Stitch (Vertical)" as stitch type
2. Set desired grid size
3. Optionally adjust "Start numbering from row" value
4. Click "Go!" to generate the pattern
5. Toggle legend OFF to see row numbers
6. Toggle legend ON to see color symbols
