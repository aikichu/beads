<script>
  import { colorLegend, legendVisible, rowNumbersVisible } from './stores.js'
  
  const toggleLegend = () => {
    if ($legendVisible) {
      // Turning off legend
      legendVisible.set(false)
    } else {
      // Turning on legend - first turn off row numbers
      rowNumbersVisible.set(false)
      legendVisible.set(true)
    }
  }
</script>

<div class="color-legend">
  <div class="legend-header">
    <h3>Bead Legend</h3>
    <button on:click={toggleLegend} class="toggle-button" aria-label="Toggle legend visibility">
      {$legendVisible ? '−' : '+'}
    </button>
  </div>
  {#if $legendVisible}
    <div class="legend-items">
    {#each $colorLegend as item (item.id)}
      <div class="legend-item">
        <div 
          class="color-swatch"
          style="background-color: hsl({item.color.h}, {item.color.s}%, {item.color.l}%)"
        ></div>
        <span class="symbol">{item.symbol}</span>
        <span class="count">{item.count}</span>
      </div>
    {/each}
    </div>
    {#if $colorLegend.length === 0}
      <p class="no-colors">No colors used yet</p>
    {/if}
  {/if}
</div>

<style>
  .color-legend {
    padding: 1em;
    background: #f8f8f8;
    border-radius: 0.5em;
    border: 1px solid #ddd;
    max-height: 300px;
    overflow-y: auto;
    width: fit-content;
    max-width: 100%;
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .color-legend {
      padding: 0.5em;
      max-height: 250px;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .color-legend {
      padding: 0.3em;
      max-height: 200px;
    }

    .legend-item {
      padding: 0.2em 0.3em;
      gap: 0.3em;
    }

    .color-swatch {
      width: 1em;
      height: 1em;
    }

    .symbol {
      font-size: 1em;
    }

    .count {
      font-size: 0.8em;
    }
  }

  @media (max-width: 480px) {
    .color-legend {
      padding: 0.2em;
      max-height: 150px;
    }

    .legend-item {
      padding: 0.1em 0.2em;
      gap: 0.2em;
    }

    .color-swatch {
      width: 0.8em;
      height: 0.8em;
    }

    .symbol {
      font-size: 0.9em;
    }

    .count {
      font-size: 0.7em;
    }
  }

  .legend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5em;
  }

  h3 {
    margin: 0;
    font-size: 1.1em;
    color: #333;
  }

  .toggle-button {
    background: #666;
    color: white;
    border: none;
    border-radius: 0.2em;
    width: 1.5em;
    height: 1.5em;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }

  .toggle-button:hover {
    background: #888;
  }

  .legend-items {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.3em 0.5em;
    background: white;
    border-radius: 0.3em;
    border: 1px solid #eee;
    min-width: 0;
  }

  .color-swatch {
    width: 1.2em;
    height: 1.2em;
    border-radius: 0.2em;
    border: 1px solid #ccc;
    flex-shrink: 0;
  }

  .symbol {
    font-size: 1.1em;
    font-weight: bold;
    min-width: 0.8em;
    text-align: center;
    flex-shrink: 0;
  }

  .count {
    font-weight: bold;
    color: #666;
    font-size: 0.9em;
    flex-shrink: 0;
  }

  .no-colors {
    text-align: center;
    color: #999;
    font-style: italic;
    margin: 1em 0;
  }
</style>
