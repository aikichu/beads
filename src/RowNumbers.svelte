<script>
  import { rowNumbersVisible, legendVisible } from './stores.js'
  
  const toggleRowNumbers = () => {
    if ($rowNumbersVisible) {
      // Turning off row numbers
      rowNumbersVisible.set(false)
    } else {
      // Turning on row numbers - first turn off legend
      legendVisible.set(false)
      rowNumbersVisible.set(true)
    }
  }
</script>

<div class="row-numbers">
  <div class="row-numbers-header">
    <h3>Row Numbers</h3>
    <button on:click={toggleRowNumbers} class="toggle-button" aria-label="Toggle row numbers visibility">
      {$rowNumbersVisible ? '−' : '+'}
    </button>
  </div>
</div>

<style>
  .row-numbers {
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
    .row-numbers {
      padding: 0.5em;
      max-height: 250px;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .row-numbers {
      padding: 0.3em;
      max-height: 200px;
    }
  }

  @media (max-width: 480px) {
    .row-numbers {
      padding: 0.2em;
      max-height: 150px;
    }
  }

  .row-numbers-header {
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

</style>
