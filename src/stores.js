import { writable, derived } from 'svelte/store';
import { areEqual } from './utils.js'
import { SYMBOL_POOL, DEFAULT_COLOR_PALETTE, ZOOM_CONFIG, TOOL_MODES, APP_STEPS } from './constants.js'

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

const createStep = () => {
  const { subscribe, update, set } = writable(APP_STEPS.CONFIGURING)

  return {
    subscribe,
    update,
    setPainting: () => set(APP_STEPS.PAINTING),
    setConfiguring: () => set(APP_STEPS.CONFIGURING)
  }
}

const createSelectedColorID = () => {
  const { subscribe, update, set } = writable(defaultSelectedColorID())

  return {
    subscribe,
    update,
    set,
    reset: () => set(defaultSelectedColorID())
  }
}

const createEraserMode = () => {
  const { subscribe, update, set } = writable(false)

  return {
    subscribe,
    update,
    set,
    toggle: () => update(mode => !mode),
    reset: () => set(false)
  }
}

const createLegendVisible = () => {
  const { subscribe, update, set } = writable(true)

  return {
    subscribe,
    update,
    set,
    toggle: () => update(visible => !visible),
    reset: () => set(true)
  }
}

const createZoomLevel = () => {
  const { subscribe, update, set } = writable(1)

  return {
    subscribe,
    update,
    set,
    zoomIn: () => update(level => Math.min(level * ZOOM_CONFIG.STEP, ZOOM_CONFIG.MAX)),
    zoomOut: () => update(level => Math.max(level / ZOOM_CONFIG.STEP, ZOOM_CONFIG.MIN)),
    reset: () => set(1)
  }
}

const createGridVisible = () => {
  const { subscribe, update, set } = writable(true)

  return {
    subscribe,
    update,
    set,
    toggle: () => update(visible => !visible),
    reset: () => set(true)
  }
}

const createToolMode = () => {
  const { subscribe, update, set } = writable(TOOL_MODES.PAINT)

  return {
    subscribe,
    update,
    set,
    setPaint: () => set(TOOL_MODES.PAINT),
    setEraser: () => set(TOOL_MODES.ERASER),
    setSelection: () => set(TOOL_MODES.SELECTION),
    setGrid: () => set(TOOL_MODES.GRID),
    reset: () => set(TOOL_MODES.PAINT)
  }
}

const createSelectedBeads = () => {
  const { subscribe, update, set } = writable(new Set())

  return {
    subscribe,
    update,
    set,
    add: (beadId) => update(selected => new Set([...selected, beadId])),
    remove: (beadId) => update(selected => {
      const newSet = new Set(selected)
      newSet.delete(beadId)
      return newSet
    }),
    clear: () => set(new Set()),
    reset: () => set(new Set())
  }
}

const createMoveOffset = () => {
  const { subscribe, update, set } = writable({x: 0, y: 0})

  return {
    subscribe,
    update,
    set,
    move: (dx, dy) => update(offset => ({x: offset.x + dx, y: offset.y + dy})),
    reset: () => set({x: 0, y: 0})
  }
}

const createColorPalette = () => {
  const { subscribe, update, set } = writable(defaultColorPalette())

  return {
    subscribe,
    update,
    set,
    reset: () => set(defaultColorPalette())
  }
}

const createCanvasColors = () => {
  const { subscribe, update, set } = writable(defaultCanvas())

  return {
    subscribe,
    update,
    set,
    reset: () => set(defaultCanvas()),
  }
}

const createHistory = () => {
  const { subscribe, update, set } = writable(defaultHistory())

  return {
    subscribe,
    commit: (newData) => update((history) => {
      const newCanvas = {...(history.versions[history.cursor]), ...newData}

      if(areEqual(history.versions[history.cursor],newCanvas)) return history
      return {cursor: history.cursor+1, versions: [...history.versions.slice(0, history.cursor+1), newCanvas]}
    }),
    undo: () => update((history) => (history.cursor === 0 ? history : {...history, cursor: history.cursor - 1})),
    redo: () => update((history) => (history.cursor === history.versions.length - 1 ? history : {...history, cursor: history.cursor + 1})),
    reset: () => set(defaultHistory())
  }
}

export const selectedColorId = createSelectedColorID()
export const eraserMode = createEraserMode()
export const legendVisible = createLegendVisible()
export const zoomLevel = createZoomLevel()
export const gridVisible = createGridVisible()
export const toolMode = createToolMode()
export const selectedBeads = createSelectedBeads()
export const moveOffset = createMoveOffset()
export const canvasColors = createCanvasColors()
export const colorPalette = createColorPalette()
export const step = createStep()
export const history = createHistory()

// Derived store for color legend (color, symbol, count)
export const colorLegend = derived(
  [canvasColors, colorPalette],
  ([$canvasColors, $colorPalette]) => {
    const colorCounts = {}
    
    // Count usage of each color
    Object.values($canvasColors).forEach(colorId => {
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
