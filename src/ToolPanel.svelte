<script>
  import { toolMode, gridVisible, selectedBeads, fringeVisible, moveOffset, colorPalette, selectedColorId, eraserMode, zoomLevel, panOffset, history, canvasColors } from './stores.js'
  import SelectionControls from './components/SelectionControls.svelte'
  import ResetButton from './components/ResetButton.svelte'
  import FringeControls from './components/FringeControls.svelte'

  export let gridSize
  export let stitchType = 'peyote'
  export let layoutRotation = 0

  const rotateRight = () => { layoutRotation = (layoutRotation + 90) % 360 }
  $: showRotation = stitchType === 'square'
  
  // Color selection logic
  $: selectedColor = $colorPalette[$selectedColorId]
  const selectColor = (id) => () => {
    if (!$eraserMode) {
      selectedColorId.set(id)
    }
  }

  // History logic
  const handleUndo = () => {
    const newState = history.undo()
    canvasColors.set(newState)
  }

  const handleRedo = () => {
    const newState = history.redo()
    canvasColors.set(newState)
  }

  // Subscribe to history state
  $: canUndo = $history.canUndo || false
  $: canRedo = $history.canRedo || false

  // Reset view function
  const handleResetView = () => {
    zoomLevel.set(0.3)  // Match the initial zoom level from stores.js
    panOffset.set({ x: 1, y: 1 })
  }

  const handleToolSelect = (tool) => {
    if (tool === 'grid') {
      // Toggle grid visibility
      gridVisible.toggle()
    } else if (tool === 'zoom-in') {
      zoomLevel.zoomIn()
    } else if (tool === 'zoom-out') {
      zoomLevel.zoomOut()
    } else if (tool === 'pan') {
      toolMode.set('pan')
    } else {
      toolMode.set(tool)
      
      // Clear selection when switching away from selection tool
      if (tool !== 'selection') {
        selectedBeads.clear()
        moveOffset.reset()
      }
    }
  }

  // Tool definitions with better organization
  const primaryTools = [
    {
      id: 'paint',
      icon: '🖍️',
      label: 'Paint',
      description: 'Paint beads with selected color',
      color: '#007bff'
    },
    {
      id: 'eraser',
      icon: '❌',
      label: 'Eraser',
      description: 'Erase colored beads',
      color: '#dc3545'
    },
    {
      id: 'selection',
      icon: '🔲',
      label: 'Select',
      description: 'Select and move colored beads',
      color: '#28a745'
    },
    {
      id: 'pan',
      icon: '✋',
      label: 'Pan',
      description: 'Pan and move around the canvas',
      color: '#6f42c1'
    }
  ]

  // Reactive view tools that update when stitchType changes
  $: viewTools = [
    {
      id: 'grid',
      icon: '🏁',
      label: 'Grid',
      description: 'Toggle grid visibility',
      color: '#6c757d',
      isToggle: true,
      active: $gridVisible
    },
    {
      id: 'zoom-in',
      icon: '🔍',
      label: 'Zoom In',
      description: 'Zoom in on the canvas',
      color: '#17a2b8'
    },
    {
      id: 'zoom-out',
      icon: '🔍',
      label: 'Zoom Out',
      description: 'Zoom out on the canvas',
      color: '#17a2b8'
    },
    // Add fringe tool for brick stitch
    ...(stitchType === 'brick' ? [{
      id: 'fringe',
      icon: '🧵',
      label: 'Fringe',
      description: 'Toggle fringe visibility for brick stitch',
      color: '#fd7e14',
      isToggle: true,
      active: $fringeVisible
    }] : [])
  ]
</script>

<div class="toolbox">
  <!-- Canvas Configuration Section -->
  <section class="tool-section canvas-config">
    <h3 class="section-title">Canvas Size</h3>
    <div class="canvas-controls">
      <div class="size-display">
        <span class="size-label">{gridSize} × {gridSize}</span>
      </div>
      <div class="size-slider">
        <input
          type="range"
          bind:value={gridSize}
          min="5"
          max="50"
          step="1"
          class="canvas-size-slider"
          aria-label="Canvas size"
        />
        <div class="size-labels">
          <span class="min-size">5×5</span>
          <span class="max-size">50×50</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Stitch Configuration Section -->
  <section class="tool-section stitch-config">
    <h3 class="section-title">Stitch Type</h3>
    <div class="stitch-controls">
      <select id="stitch-type" bind:value={stitchType} class="stitch-selector">
        <option value="peyote">Peyote Stitch (Vertical)</option>
        <option value="brick">Brick Stitch (Horizontal)</option>
        <option value="square">Square Stitch</option>
      </select>
      {#if showRotation}
        <button on:click={rotateRight} class="rotate-button" aria-label="rotate">
          <span class="rotate-symbol">↻</span>
        </button>
      {/if}
    </div>
  </section>

  <!-- Color Controls Section -->
  <section class="tool-section color-controls">
    <h3 class="section-title">Colors</h3>
    <div class="color-palette">
      <div class="color-sliders">
        <div class="slider-group">
          <label for="hue-slider">Hue</label>
          <input
            id="hue-slider"
            type="range"
            class="hue-gradient"
            min="0" max="360" step="1"
            bind:value={$colorPalette[$selectedColorId].h}
          />
        </div>
        <div class="slider-group">
          <label for="sat-slider">Saturation</label>
          <input
            id="sat-slider"
            type="range"
            class="sat-gradient"
            style="--h:{selectedColor.h}; --l:{selectedColor.l}%"
            min="0" max="100" step="1"
            bind:value={$colorPalette[$selectedColorId].s}
          />
        </div>
        <div class="slider-group">
          <label for="light-slider">Lightness</label>
          <input
            id="light-slider"
            type="range"
            class="light-gradient"
            style="--h:{selectedColor.h}; --s:{selectedColor.s}%"
            min="0" max="100" step="1"
            bind:value={$colorPalette[$selectedColorId].l}
          />
        </div>
      </div>
      <div class="colors-grid">
        {#each $colorPalette as color (color.id)}
          <div
            class:selected={color.id === $selectedColorId && !$eraserMode}
            class:blank={color.l === 100}
            class:disabled={$eraserMode}
            class="color"
            style="--h:{color.h}; --s:{color.s}%; --l:{color.l}%"
            on:click={selectColor(color.id)}
          />
        {/each}
      </div>
    </div>
  </section>

  <!-- Primary Tools Section -->
  <section class="tool-section primary-tools">
    <h3 class="section-title">Tools</h3>
    <div class="tool-grid">
      {#each primaryTools as tool}
        <button 
          class="tool-button primary" 
          class:active={$toolMode === tool.id}
          on:click={() => handleToolSelect(tool.id)}
          aria-label={tool.label}
          title={tool.description}
          style="--tool-color: {tool.color}"
        >
          <span class="tool-icon">{tool.icon}</span>
          <span class="tool-label">{tool.label}</span>
        </button>
      {/each}
    </div>
  </section>

  <!-- View Controls Section -->
  <section class="tool-section view-controls">
    <h3 class="section-title">View</h3>
    <div class="tool-grid">
      {#each viewTools as tool}
        <button 
          class="tool-button view" 
          class:active={tool.active}
          on:click={() => {
            if (tool.id === 'grid') {
              handleToolSelect('grid')
            } else if (tool.id === 'fringe') {
              fringeVisible.toggle()
            } else {
              handleToolSelect(tool.id)
            }
          }}
          aria-label={tool.label}
          title={tool.description}
          style="--tool-color: {tool.color}"
        >
          <span class="tool-icon">{tool.icon}</span>
          <span class="tool-label">{tool.label}</span>
        </button>
      {/each}
    </div>
  </section>

  <!-- Contextual Controls -->
  <section class="tool-section contextual-controls">
    <!-- Move controls - only show when selection tool is active -->
    {#if $toolMode === 'selection'}
      <SelectionControls {gridSize} {stitchType} {layoutRotation} />
    {/if}

    <!-- Fringe controls - only show when fringe is visible and stitch type is brick -->
    {#if $fringeVisible && stitchType === 'brick'}
      <FringeControls {stitchType} />
    {/if}
  </section>

  <!-- Undo/Redo & Actions -->
  <section class="tool-section undo-redo-actions">
    <h3 class="section-title">Actions</h3>
    <div class="action-controls">
      <div class="undo-redo-controls">
        <button
          on:click={handleUndo}
          class='undo-redo-button'
          class:disabled={!canUndo}
          disabled={!canUndo}
          aria-label={canUndo ? 'undo' : 'undo (disabled)'}
          title='Undo last action'
        >
          ↶
        </button>
        <button
          on:click={handleRedo}
          class='undo-redo-button'
          class:disabled={!canRedo}
          disabled={!canRedo}
          aria-label={canRedo ? 'redo' : 'redo (disabled)'}
          title='Redo last action'
        >
          ↷
        </button>
        <button
          on:click={handleResetView}
          class='reset-view-button'
          aria-label='reset view'
          title='Reset zoom and pan to default'
        >
          ⌂
        </button>
      </div>
      <ResetButton />
    </div>
  </section>
</div>

<style>
  .toolbox {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 1rem;
    border: 1px solid #dee2e6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    min-width: 280px;
    max-width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-height: 100vh;
    overflow-y: auto;
  }

  .tool-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.5rem;
  }

  .tool-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.75rem;
  }

  .tool-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 0.75rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    min-height: 70px;
  }

  .tool-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--tool-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 0;
  }

  .tool-button:hover {
    border-color: var(--tool-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .tool-button:hover::before {
    opacity: 0.05;
  }

  .tool-button.active {
    border-color: var(--tool-color);
    background: var(--tool-color);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .tool-button.active::before {
    opacity: 0;
  }

  .tool-icon {
    font-size: 1.25rem;
    z-index: 1;
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-label {
    font-size: 0.7rem;
    font-weight: 500;
    z-index: 1;
    position: relative;
    text-align: center;
    opacity: 1;
    visibility: visible;
  }

  .action-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .undo-redo-controls {
    display: flex;
    gap: 0.5rem;
  }

  .undo-redo-button {
    width: 2rem;
    height: 2rem;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .undo-redo-button:hover:not(.disabled) {
    background-color: #e0a800;
    transform: translateY(-1px);
  }

  .undo-redo-button.disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .reset-view-button {
    width: 2rem;
    height: 2rem;
    background-color: #17a2b8;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reset-view-button:hover {
    background-color: #138496;
    transform: translateY(-1px);
  }

  .canvas-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .size-display {
    text-align: center;
  }

  .size-label {
    font-size: 1.2rem;
    font-weight: 700;
    color: #495057;
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 2px solid #e9ecef;
    display: inline-block;
    min-width: 80px;
  }

  .size-slider {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
  }

  .canvas-size-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.8rem;
    border-radius: 0.4rem;
    background: #d3d3d3;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .canvas-size-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .canvas-size-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .size-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 500;
  }

  .stitch-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
  }

  .stitch-selector {
    padding: 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: border-color 0.2s ease;
    min-width: 180px;
  }

  .stitch-selector:focus {
    outline: none;
    border-color: #007bff;
  }

  .rotate-button {
    width: 2.5rem;
    height: 2.5rem;
    border: 2px solid #e9ecef;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rotate-button:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }

  .rotate-symbol {
    font-size: 1.25rem;
    font-weight: bold;
    color: #495057;
  }

  .color-palette {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .color-sliders {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .slider-group label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #495057;
    text-align: center;
  }

  .slider-group input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.8rem;
    border-radius: 0.2rem;
    cursor: pointer;
  }

  .slider-group input::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1.2rem;
    width: 1.2rem;
    border-radius: 1.2rem;
    border: none;
    background: grey;
    cursor: pointer;
    box-shadow: 0 0 0.2rem rgba(0,0,0,0.4);
  }

  .slider-group input:focus {
    outline: none;
  }

  .hue-gradient {
    background: linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%);
  }

  .sat-gradient {
    background: linear-gradient(to right, hsl(var(--h), 0%, var(--l)), hsl(var(--h), 100%, var(--l)));
  }

  .light-gradient {
    background: linear-gradient(to right, hsl(var(--h), var(--s), 0%), hsl(var(--h), var(--s), 50%), hsl(var(--h), var(--s), 100%));
  }

  .colors-grid {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(6, 1.5rem);
    grid-template-rows: repeat(2, 1.5rem);
    gap: 0.25rem;
  }

  .color {
    height: 1.5rem;
    width: 1.5rem;
    transition: all 0.3s ease;
    background-color: hsl(var(--h), var(--s), var(--l));
    box-sizing: border-box;
    border-radius: 0.2rem;
    cursor: pointer;
  }

  .color:not(.selected):hover {
    transform: scale(1.2);
  }

  .color.selected {
    transform: scale(1.5);
    filter: drop-shadow(0 0 0.2rem rgba(0,0,0,0.2));
    border-radius: 0.4rem;
  }

  .color.blank:not(.selected) {
    filter: drop-shadow(0 0 0.1rem rgba(0,0,0,0.2));
  }

  .color.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .color.disabled:hover {
    transform: none;
  }

  /* Responsive design */
  @media (max-width: 1200px) {
    .toolbox {
      min-width: 240px;
      padding: 1.25rem;
      gap: 1.25rem;
    }

    .tool-grid {
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 0.5rem;
    }

    .tool-button {
      min-height: 60px;
      padding: 0.5rem 0.25rem;
    }

    .tool-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    .tool-label {
      font-size: 0.65rem;
    }
  }

  @media (max-width: 1024px) {
    .toolbox {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      min-width: auto;
      padding: 1rem;
      gap: 1rem;
    }

    .tool-section {
      flex: 1;
      min-width: 200px;
    }

    .tool-grid {
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: 0.4rem;
    }

    .tool-button {
      min-height: 50px;
      padding: 0.4rem 0.2rem;
    }

    .tool-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .tool-label {
      font-size: 0.6rem;
    }

    .action-controls {
      flex-direction: column;
      gap: 0.5rem;
    }

    .undo-redo-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.9rem;
    }

    .reset-view-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.9rem;
    }

    .stitch-controls {
      flex-direction: column;
      gap: 0.5rem;
    }

    .stitch-selector {
      min-width: auto;
      width: 100%;
    }

    .colors-grid {
      grid-template-columns: repeat(6, 1.2rem);
      grid-template-rows: repeat(2, 1.2rem);
      gap: 0.2rem;
    }

    .color {
      height: 1.2rem;
      width: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    .toolbox {
      padding: 0.75rem;
      gap: 0.75rem;
    }

    .tool-section {
      min-width: 150px;
    }

    .tool-grid {
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      gap: 0.3rem;
    }

    .tool-button {
      min-height: 45px;
      padding: 0.3rem 0.15rem;
    }

    .tool-icon {
      font-size: 0.9rem;
      width: 0.9rem;
      height: 0.9rem;
    }

    .tool-label {
      font-size: 0.55rem;
    }

    .section-title {
      font-size: 0.75rem;
    }

    .undo-redo-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.8rem;
    }

    .reset-view-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.8rem;
    }

    .colors-grid {
      grid-template-columns: repeat(6, 1rem);
      grid-template-rows: repeat(2, 1rem);
      gap: 0.15rem;
    }

    .color {
      height: 1rem;
      width: 1rem;
    }
  }

  @media (max-width: 480px) {
    .toolbox {
      padding: 0.5rem;
      gap: 0.5rem;
    }

    .tool-section {
      min-width: 120px;
    }

    .tool-grid {
      grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
      gap: 0.25rem;
    }

    .tool-button {
      min-height: 40px;
      padding: 0.25rem 0.1rem;
    }

    .tool-icon {
      font-size: 0.8rem;
      width: 0.8rem;
      height: 0.8rem;
    }

    .tool-label {
      font-size: 0.5rem;
    }

    .section-title {
      font-size: 0.7rem;
    }

    .undo-redo-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.7rem;
    }

    .reset-view-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.7rem;
    }

    .colors-grid {
      grid-template-columns: repeat(6, 0.8rem);
      grid-template-rows: repeat(2, 0.8rem);
      gap: 0.1rem;
    }

    .color {
      height: 0.8rem;
      width: 0.8rem;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .toolbox {
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
      border-color: #4a5568;
      color: #e2e8f0;
    }

    .section-title {
      color: #a0aec0;
      border-color: #4a5568;
    }

    .tool-button {
      background: #2d3748;
      border-color: #4a5568;
      color: #e2e8f0;
    }

    .tool-button:hover {
      background: #4a5568;
    }
  }
</style>
