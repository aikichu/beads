<script>
  import { zoomLevel } from '../stores.js'

  const handleZoomIn = () => {
    zoomLevel.zoomIn()
  }

  const handleZoomOut = () => {
    zoomLevel.zoomOut()
  }
</script>

<div class="zoom-controls">
  <h4>Zoom</h4>
  <div class="zoom-buttons">
    <button on:click={handleZoomIn} class='zoom-button' aria-label='zoom in' title='Zoom in'>+</button>
    <button on:click={handleZoomOut} class='zoom-button' aria-label='zoom out' title='Zoom out'>−</button>
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

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    font-weight: 600;
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
</style>