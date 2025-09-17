<script>
  import { zoomLevel, panOffset } from '../stores.js'

  export let togglePanMode = () => {}
  export let panMode = false

  const handleZoomIn = () => {
    zoomLevel.zoomIn()
  }

  const handleZoomOut = () => {
    zoomLevel.zoomOut()
  }

  const handleReset = () => {
    zoomLevel.set(1)
    panOffset.set({ x: 0, y: 0 })
  }

  const handleFitToScreen = () => {
    // This would need to be implemented with canvas dimensions
    // For now, just reset to a reasonable zoom level
    zoomLevel.set(1)
    panOffset.set({ x: 0, y: 0 })
  }
</script>

<div class="zoom-controls">
  <h4>Zoom & Pan</h4>
  <div class="zoom-info">
    <span class="zoom-level">{Math.round($zoomLevel * 100)}%</span>
  </div>
  <div class="zoom-buttons">
    <button on:click={handleZoomIn} class='zoom-button' aria-label='zoom in' title='Zoom in'>+</button>
    <button on:click={handleZoomOut} class='zoom-button' aria-label='zoom out' title='Zoom out'>−</button>
    <button on:click={handleReset} class='zoom-button reset-button' aria-label='reset view' title='Reset view'>⌂</button>
  </div>
  <div class="pan-mode-toggle">
    <button 
      on:click={togglePanMode} 
      class='pan-mode-button' 
      class:active={panMode}
      aria-label={panMode ? 'exit pan mode' : 'enter pan mode'} 
      title={panMode ? 'Exit pan mode (return to painting)' : 'Enter pan mode (single finger drag to pan)'}
    >
      {panMode ? '🎨' : '✋'}
    </button>
    <span class="pan-mode-label">{panMode ? 'Pan Mode' : 'Paint Mode'}</span>
  </div>
  <div class="pan-instructions">
    <small class="desktop-instructions">Pan: Right Click or Middle Mouse</small>
    <small class="mobile-instructions" class:hidden={panMode}>Paint: Single finger drag | Zoom: Pinch</small>
    <small class="mobile-instructions" class:show={panMode}>Pan: Single finger drag | Zoom: Pinch</small>
  </div>
</div>

<style>
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

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .zoom-controls {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.3rem;
      padding: 0.3rem;
    }

    h4 {
      margin: 0;
      font-size: 0.8rem;
    }

    .zoom-buttons {
      gap: 0.2rem;
    }

    .zoom-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.9rem;
    }

    .pan-mode-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.9rem;
    }

    .pan-mode-label {
      font-size: 0.6rem;
    }
  }

  @media (max-width: 768px) {
    .zoom-controls {
      gap: 0.2rem;
      padding: 0.2rem;
    }

    h4 {
      font-size: 0.7rem;
    }

    .zoom-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.8rem;
    }

    .pan-mode-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.8rem;
    }

    .pan-mode-label {
      font-size: 0.5rem;
    }

    .zoom-level {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
    }
  }

  @media (max-width: 480px) {
    .zoom-controls {
      gap: 0.1rem;
      padding: 0.1rem;
    }

    .zoom-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.7rem;
    }

    .pan-mode-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.7rem;
    }

    .pan-mode-label {
      font-size: 0.4rem;
    }

    .zoom-level {
      font-size: 0.6rem;
      padding: 0.1rem 0.3rem;
    }
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    font-weight: 600;
  }

  .zoom-info {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .zoom-level {
    font-size: 0.8rem;
    font-weight: bold;
    color: #007bff;
    background-color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
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

  .reset-button {
    background-color: #6c757d;
  }

  .reset-button:hover {
    background-color: #545b62;
  }

  .pan-instructions {
    text-align: center;
  }

  .pan-instructions small {
    color: #666;
    font-size: 0.7rem;
  }

  .desktop-instructions {
    display: block;
  }

  .mobile-instructions {
    display: none;
  }

  .mobile-instructions.hidden {
    display: none;
  }

  .mobile-instructions.show {
    display: block;
  }

  .pan-mode-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .pan-mode-button {
    width: 2rem;
    height: 2rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .pan-mode-button:hover {
    background-color: #5a6268;
  }

  .pan-mode-button.active {
    background-color: #007bff;
  }

  .pan-mode-button.active:hover {
    background-color: #0056b3;
  }

  .pan-mode-label {
    font-size: 0.7rem;
    color: #666;
    text-align: center;
  }

  /* Show mobile instructions on mobile devices */
  @media (max-width: 768px) {
    .desktop-instructions {
      display: none;
    }

    .mobile-instructions {
      display: block;
    }
  }
</style>