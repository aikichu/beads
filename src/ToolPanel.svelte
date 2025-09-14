<script>
  import { toolMode, gridVisible, selectedBeads } from './stores.js'
  import ZoomControls from './components/ZoomControls.svelte'
  import HistoryControls from './components/HistoryControls.svelte'
  import SelectionControls from './components/SelectionControls.svelte'
  import ResetButton from './components/ResetButton.svelte'

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
  </div>

  <!-- Move controls - only show when selection tool is active -->
  {#if $toolMode === 'selection'}
    <SelectionControls {gridSize} {stitchType} {layoutRotation} />
  {/if}

  <!-- Zoom controls -->
  <ZoomControls />

  <!-- History controls -->
  <HistoryControls />

  <!-- Reset control -->
  <ResetButton />
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
</style>
