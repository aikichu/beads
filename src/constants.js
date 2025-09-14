// Application constants and configuration

// Symbol pool for color legends
export const SYMBOL_POOL = [
  '▲', '▼', '♥', '♦', '■', '●', '★', '◆', '▲', '▼',
  '◄', '►', '◊', '○', '□', '△', '▽', '◈', '◉', '◐',
  '◑', '◒', '◓', '◔', '◕', '◖', '◗', '◘', '◙', '◚',
  '◛', '◜', '◝', '◞', '◟', '◠', '◡', '◢', '◣', '◤',
  '◥', '◦', '◧', '◨', '◩', '◪', '◫', '◬', '◭', '◮', '◯'
]

// Default color palette
export const DEFAULT_COLOR_PALETTE = [
  {h: 175, s: 65, l: 35, id: 0},
  {h: 150, s: 74, l: 72, id: 1},
  {h: 50, s: 91, l: 70, id: 2},
  {h: 11, s: 100, l: 85, id: 3},
  {h: 16, s: 95, l: 65, id: 4},
  {h: 0, s: 100, l: 100, id: 5},
  {h: 0, s: 100, l: 100, id: 6},
  {h: 0, s: 100, l: 100, id: 7},
  {h: 0, s: 100, l: 100, id: 8},
  {h: 0, s: 100, l: 100, id: 9},
  {h: 0, s: 100, l: 100, id: 10},
  {h: 0, s: 100, l: 100, id: 11}
]

// Grid configuration
export const GRID_CONFIG = {
  MIN_SIZE: 5,
  MAX_SIZE: 50,
  DEFAULT_SIZE: 20,
  STEP: 1
}

// Canvas layout offsets (for viewBox calculations)
export const CANVAS_OFFSETS = {
  PEYOTE: {
    180: { x: -6, y: 1 },
    DEFAULT: { x: 2, y: 0 }
  },
  BRICK: {
    90: { x: 0, y: 3 },
    270: { x: -2, y: -2 }
  },
  OFFSET: {
    90: { x: 0, y: 3 },
    180: { x: -6, y: 1 },
    270: { x: -2, y: -2 },
    DEFAULT: { x: 2, y: 0 }
  }
}

// Zoom configuration
export const ZOOM_CONFIG = {
  MIN: 0.2,
  MAX: 5,
  STEP: 1.2
}

// Tool modes
export const TOOL_MODES = {
  PAINT: 'paint',
  ERASER: 'eraser',
  SELECTION: 'selection',
  GRID: 'grid'
}

// Application steps
export const APP_STEPS = {
  CONFIGURING: 'configuring',
  PAINTING: 'painting'
}