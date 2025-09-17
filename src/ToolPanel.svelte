<script>
  import { toolMode, gridVisible, selectedBeads, fringeVisible } from './stores.js'
  import ZoomControls from './components/ZoomControls.svelte'
  import HistoryControls from './components/HistoryControls.svelte'
  import SelectionControls from './components/SelectionControls.svelte'
  import ResetButton from './components/ResetButton.svelte'
  import FringeControls from './components/FringeControls.svelte'

  export let gridSize
  export let stitchType = 'offset'
  export let layoutRotation = 0
  export let togglePanMode = () => {}
  export let panMode = false

  const handleToolSelect = (tool) => {
    if (tool === 'grid') {
      // Toggle grid visibility
      gridVisible.toggle()
    } else if (tool === 'selection' && stitchType === 'raw') {
      // Disable selection for raw stitch - too complex
      alert('Selection is not available for RAW stitch due to its complex overlapping pattern.')
    } else {
      toolMode.set(tool)
      
      // Clear selection when switching away from selection tool
      if (tool !== 'selection') {
        selectedBeads.clear()
        moveOffset.reset()
      }
    }
  }


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
    
    {#if stitchType === 'brick'}
      <button 
        class="tool-button" 
        class:active={$fringeVisible}
        on:click={() => fringeVisible.toggle()}
        aria-label="Fringe toggle"
        title="Toggle fringe visibility for brick stitch"
      >
        🧵
      </button>
    {/if}
  </div>

  <!-- Move controls - only show when selection tool is active -->
  {#if $toolMode === 'selection'}
    <SelectionControls {gridSize} {stitchType} {layoutRotation} />
  {/if}

  <!-- Zoom controls -->
  <ZoomControls bind:togglePanMode bind:panMode />

  <!-- History controls -->
  <HistoryControls />

  <!-- Reset control -->
  <ResetButton />

  <!-- Fringe controls - only show when fringe is visible and stitch type is brick -->
  {#if $fringeVisible && stitchType === 'brick'}
    <FringeControls {stitchType} />
  {/if}
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
    max-width: 100%;
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

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .tool-panel {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      min-width: auto;
      padding: 0.5rem;
      gap: 0.5rem;
    }

    .tool-buttons {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .tool-button {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    .tool-panel {
      padding: 0.3rem;
      gap: 0.3rem;
    }

    .tool-buttons {
      gap: 0.2rem;
    }

    .tool-button {
      width: 2.2rem;
      height: 2.2rem;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .tool-panel {
      padding: 0.2rem;
      gap: 0.2rem;
    }

    .tool-button {
      width: 2rem;
      height: 2rem;
      font-size: 0.9rem;
    }
  }
</style>
