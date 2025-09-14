<script>
  import { toolMode, gridVisible, selectedBeads, moveOffset, canvasColors, history, zoomLevel } from './stores.js'
  
  export let gridSize
  export let stitchType = 'offset'
  export let layoutRotation = 0

  const handleToolSelect = (tool) => {
    if (tool === 'grid') {
      // Toggle grid visibility
      gridVisible.toggle()
    } else if (tool === 'selection' && stitchType === 'raw') {
      // Disable selection for raw stitch - too complex
      alert('Selection is not available for RAW stitch due to its complex overlapping pattern.')
      return
    } else {
      toolMode.set(tool)
      
      // Clear selection when switching away from selection tool
      if (tool !== 'selection') {
        selectedBeads.clear()
        moveOffset.reset()
      }
    }
  }

  // Function to get bead position from ID for different stitch types
  const getBeadPosition = (beadId, stitchType, gridSize, layoutRotation) => {
    const row = Math.floor(beadId / gridSize)
    const col = beadId % gridSize
    
    if (stitchType === 'square') {
      // Square stitch: simple grid
      return { row, col }
    } else if (stitchType === 'peyote') {
      // Peyote stitch: offset rows
      return { row, col }
    } else if (stitchType === 'brick') {
      // Brick stitch: offset columns  
      return { row, col }
    } else {
      // Default/offset stitch
      return { row, col }
    }
  }

  // Function to get new bead ID from position for different stitch types
  const getBeadIdFromPosition = (row, col, gridSize) => {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return row * gridSize + col
    }
    return null
  }

  const handleMove = (dx, dy) => {
    if ($selectedBeads.size > 0) {
      moveOffset.move(dx, dy)
    }
  }

  const handleConfirmMove = () => {
    if ($selectedBeads.size > 0 && ($moveOffset.x !== 0 || $moveOffset.y !== 0)) {
      // Apply the move to the canvas
      const newCanvas = {...$canvasColors}
      const selectedArray = Array.from($selectedBeads)
      
      // Create a mapping of old bead IDs to new positions
      const beadMoves = new Map()
      
      selectedArray.forEach(beadId => {
        const colorId = $canvasColors[beadId]
        if (colorId !== undefined) {
          // Get current position using proper mapping
          const position = getBeadPosition(beadId, stitchType, gridSize, layoutRotation)
          
          const newRow = position.row + $moveOffset.y
          const newCol = position.col + $moveOffset.x
          
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
      beadMoves.forEach(({ newBeadId, colorId }, oldBeadId) => {
        newCanvas[newBeadId] = colorId
      })
      
      canvasColors.set(newCanvas)
      history.commit(newCanvas)
      
      // Clear selection and reset offset
      selectedBeads.clear()
      moveOffset.reset()
    }
  }

  // Zoom controls
  const handleZoomIn = () => {
    zoomLevel.zoomIn()
  }

  const handleZoomOut = () => {
    zoomLevel.zoomOut()
  }

  // History controls
  const handleUndo = () => {
    history.undo()
    canvasColors.set($history.versions[$history.cursor])
  }

  const handleRedo = () => {
    history.redo()
    canvasColors.set($history.versions[$history.cursor])
  }

  // Reset function
  const handleReset = () => {
    if (confirm('Are you sure you want to reset the canvas? This will clear all your work.')) {
      canvasColors.reset()
      history.reset()
      selectedBeads.clear()
      moveOffset.reset()
      toolMode.reset()
    }
  }

  // Derived values for button states
  $: canUndo = $history.cursor > 0
  $: canRedo = $history.cursor < $history.versions.length - 1
</script>

<div class="tool-panel">
  <div class="tool-buttons">
    <button 
      class="tool-button" 
      class:active={$toolMode === 'paint'}
      on:click={() => handleToolSelect('paint')}
      aria-label="Paint tool"
      title="Paint beads with selected color"
    >
      🖍️
    </button>
    
    <button 
      class="tool-button" 
      class:active={$toolMode === 'eraser'}
      on:click={() => handleToolSelect('eraser')}
      aria-label="Eraser tool"
      title="Erase colored beads"
    >
      ❌
    </button>
    
    <button 
      class="tool-button" 
      class:active={$toolMode === 'selection'}
      on:click={() => handleToolSelect('selection')}
      aria-label="Selection tool"
      title="Select and move colored beads"
    >
      🔲
    </button>
    
    <button 
      class="tool-button" 
      class:active={$gridVisible}
      on:click={() => handleToolSelect('grid')}
      aria-label="Grid toggle"
      title="Toggle grid visibility"
    >
      🏁
    </button>
  </div>

  <!-- Move controls - only show when selection tool is active and beads are selected -->
  {#if $toolMode === 'selection' && $selectedBeads.size > 0}
    <div class="move-controls">
      <div class="move-arrows">
        <button on:click={() => handleMove(0, -1)} class='move-button' aria-label='move up'>↑</button>
        <div class="move-row">
          <button on:click={() => handleMove(-1, 0)} class='move-button' aria-label='move left'>←</button>
          <button on:click={() => handleMove(1, 0)} class='move-button' aria-label='move right'>→</button>
        </div>
        <button on:click={() => handleMove(0, 1)} class='move-button' aria-label='move down'>↓</button>
      </div>
      <button on:click={handleConfirmMove} class='confirm-button' aria-label='confirm move'>✓</button>
    </div>
  {/if}

  <!-- Zoom controls -->
  <div class="zoom-controls">
    <h4>Zoom</h4>
    <div class="zoom-buttons">
      <button on:click={handleZoomIn} class='zoom-button' aria-label='zoom in' title='Zoom in'>+</button>
      <button on:click={handleZoomOut} class='zoom-button' aria-label='zoom out' title='Zoom out'>−</button>
    </div>
  </div>

  <!-- History controls -->
  <div class="history-controls">
    <h4>History</h4>
    <div class="history-buttons">
      <button on:click={handleUndo} class='history-button' class:disabled={!canUndo} aria-label={canUndo ? 'undo' : 'undo (disabled)'} title='Undo last action'>
        ↶
      </button>
      <button on:click={handleRedo} class='history-button' class:disabled={!canRedo} aria-label={canRedo ? 'redo' : 'redo (disabled)'} title='Redo last action'>
        ↷
      </button>
    </div>
  </div>

  <!-- Reset control -->
  <div class="reset-control">
    <button on:click={handleReset} class='reset-button' aria-label='reset canvas' title='Reset canvas (clear all work)'>
      🗑️
    </button>
  </div>
</div>

<style>
  .tool-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
    border: 2px solid #e9ecef;
    min-width: 120px;
  }

  .tool-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tool-button {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
    border: 2px solid #dee2e6;
    border-radius: 0.5rem;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-button:hover {
    border-color: #adb5bd;
    background-color: #f8f9fa;
    transform: scale(1.05);
  }

  .tool-button.active {
    border-color: #007bff;
    background-color: #e3f2fd;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

  .move-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #fff3cd;
    border-radius: 0.5rem;
    border: 2px solid #ffc107;
  }

  .move-arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .move-row {
    display: flex;
    gap: 0.25rem;
  }

  .move-button {
    width: 2rem;
    height: 2rem;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .move-button:hover {
    background-color: #e0a800;
  }

  .confirm-button {
    width: 2.5rem;
    height: 2rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .confirm-button:hover {
    background-color: #218838;
  }

  /* Section headers */
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    font-weight: 600;
  }

  /* Zoom controls */
  .zoom-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #e8f4fd;
    border-radius: 0.5rem;
    border: 1px solid #b3d9ff;
  }

  .zoom-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .zoom-button {
    width: 2rem;
    height: 2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .zoom-button:hover {
    background-color: #0056b3;
  }

  /* History controls */
  .history-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #fff3cd;
    border-radius: 0.5rem;
    border: 1px solid #ffeaa7;
  }

  .history-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .history-button {
    width: 2rem;
    height: 2rem;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .history-button:hover:not(.disabled) {
    background-color: #e0a800;
  }

  .history-button.disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Reset control */
  .reset-control {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }

  .reset-button {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .reset-button:hover {
    background-color: #c82333;
  }
</style>
