import { writable, derived } from 'svelte/store'
import { areEqual } from './utils.js'
import { SYMBOL_POOL, DEFAULT_COLOR_PALETTE, ZOOM_CONFIG, TOOL_MODES, APP_STEPS } from './constants.js'
import { createStore, createToggleStore, createSelectionStore, createPositionStore } from './storeFactory.js'
import { createDeltaHistory } from './deltaHistory.js'

const defaultSelectedColorID = () => 0

const defaultColorPalette = () => (
  DEFAULT_COLOR_PALETTE.map((color, index) => ({
    ...color,
    symbol: SYMBOL_POOL[index]
  }))
)
// const defaultCanvas = () => ({...Array(400).fill().map((_,i) => (Math.floor(i/20) % 5))})
const defaultCanvas = () => ({})
const defaultHistory = () => ({cursor: 0, versions:[defaultCanvas()]})

const createStep = () => createStore(APP_STEPS.CONFIGURING, {
  setPainting: function() { this.set(APP_STEPS.PAINTING) },
  setConfiguring: function() { this.set(APP_STEPS.CONFIGURING) }
})

const createSelectedColorID = () => createStore(defaultSelectedColorID())

const createEraserMode = () => createToggleStore(false)

const createLegendVisible = () => createToggleStore(true)
const createRowNumbersVisible = () => createToggleStore(false)

const createZoomLevel = () => createStore(1, {
  zoomIn: function() { this.update(level => Math.min(level * ZOOM_CONFIG.STEP, ZOOM_CONFIG.MAX)) },
  zoomOut: function() { this.update(level => Math.max(level / ZOOM_CONFIG.STEP, ZOOM_CONFIG.MIN)) },
  set: function(level) { this.update(() => Math.max(ZOOM_CONFIG.MIN, Math.min(level, ZOOM_CONFIG.MAX))) }
})

const createPanOffset = () => createPositionStore()

const createIsPanning = () => createToggleStore(false)

const createGridVisible = () => createToggleStore(true)

const createToolMode = () => createStore(TOOL_MODES.PAINT, {
  setPaint: function() { this.set(TOOL_MODES.PAINT) },
  setEraser: function() { this.set(TOOL_MODES.ERASER) },
  setSelection: function() { this.set(TOOL_MODES.SELECTION) },
  setGrid: function() { this.set(TOOL_MODES.GRID) }
})

const createSelectedBeads = () => createSelectionStore()

const createMoveOffset = () => createPositionStore()

// Fringe stores
const createFringeVisible = () => createToggleStore(false)
const createFringeLength = () => createStore(3) // Global fringe length (1-20)
const createFringeColors = () => createStore({}) // Individual fringe bead colors {fringeBeadId: colorId}

// Peyote row numbering stores
const createPeyoteStartingRow = () => createStore(0) // Starting row number for peyote stitch

const createColorPalette = () => createStore(defaultColorPalette())

const createCanvasColors = () => createStore(defaultCanvas())

// Use delta-based history for better memory efficiency
const createHistory = () => createDeltaHistory(defaultCanvas())

export const selectedColorId = createSelectedColorID()
export const eraserMode = createEraserMode()
export const legendVisible = createLegendVisible()
export const rowNumbersVisible = createRowNumbersVisible()
export const zoomLevel = createZoomLevel()
export const panOffset = createPanOffset()
export const isPanning = createIsPanning()
export const gridVisible = createGridVisible()
export const toolMode = createToolMode()
export const selectedBeads = createSelectedBeads()
export const moveOffset = createMoveOffset()
export const fringeVisible = createFringeVisible()
export const fringeLength = createFringeLength()
export const fringeColors = createFringeColors()
export const peyoteStartingRow = createPeyoteStartingRow()
export const canvasColors = createCanvasColors()
export const colorPalette = createColorPalette()
export const step = createStep()
export const history = createHistory()

// Derived store for color legend (color, symbol, count)
export const colorLegend = derived(
  [canvasColors, fringeColors, colorPalette],
  ([$canvasColors, $fringeColors, $colorPalette]) => {
    const colorCounts = {}
    
    // Count usage of each color in main canvas
    Object.values($canvasColors).forEach(colorId => {
      if (colorId !== undefined) {
        colorCounts[colorId] = (colorCounts[colorId] || 0) + 1
      }
    })
    
    // Count usage of each color in fringe beads
    Object.values($fringeColors).forEach(colorId => {
      if (colorId !== undefined) {
        colorCounts[colorId] = (colorCounts[colorId] || 0) + 1
      }
    })
    
    // Create legend entries for used colors
    return Object.entries(colorCounts)
      .map(([colorId, count]) => {
        const color = $colorPalette[parseInt(colorId)]
        return {
          id: colorId,
          color: color,
          symbol: color.symbol,
          count: count
        }
      })
      .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Sort by color ID
  }
)
