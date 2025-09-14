# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start development server with hot reload and watch mode
- `npm start` - Serve the built application (after running build)
- `npm run build` - Build for production (creates minified bundles in public/build/)

### Deployment
- `npm run deploy` - Deploy to GitHub Pages (Note: requires manual fix after deployment)
  - After running deploy, checkout gh-pages branch
  - Edit index.html to add `/beads2/` prefix to CSS and JS bundle URLs
  - Commit and push the changes

## Architecture Overview

This is a Svelte 3 application for creating bead pattern designs with different stitch types (peyote, brick, square).

### Build System
- **Rollup** bundler with Svelte plugin
- Entry point: `src/main.js` → outputs to `public/build/bundle.js`
- CSS extracted to separate bundle file
- Development server uses sirv-cli with livereload

### State Management
The application uses Svelte's built-in stores (`src/stores.js`) for global state:
- **step**: Controls application flow between 'configuring' and 'painting' modes
- **canvasColors**: Stores bead color assignments by position ID
- **colorPalette**: Available colors with HSL values and symbols
- **history**: Undo/redo functionality with versioned canvas states
- **selectedColorId**: Currently selected color for painting
- **toolMode**: Current tool ('paint', 'eraser', 'selection', 'grid')
- **selectedBeads**: Set of selected bead IDs for batch operations
- **colorLegend**: Derived store that calculates color usage statistics

### Component Structure
- **App.svelte**: Main layout with CSS Grid, orchestrates mode switching
- **Canvas.svelte**: Core drawing surface for bead patterns
- **ConfigPanel.svelte**: Settings for grid size, rotation, and stitch type
- **PaintingToolbox.svelte**: Color palette and painting tools (painting mode only)
- **ToolPanel.svelte**: Additional tools and controls (painting mode only)
- **ColorLegend.svelte**: Display of used colors with counts
- **Bead.svelte**: Individual bead component
- **Workspace.svelte**: Container for canvas and tools

### Key Implementation Details
- Stitch types affect bead positioning and layout algorithms
- History system uses immutable updates with cursor-based navigation
- Color palette includes visual symbols for pattern printing
- Grid coordinates are computed based on stitch type and layout rotation