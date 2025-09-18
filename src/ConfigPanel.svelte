<script>
  import ConfigPanelGrid from './ConfigPanelGrid.svelte'

  import { step, peyoteStartingRow } from './stores.js'

  export let gridSize
  export let layoutRotation
  export let stitchType

  const rotateRight = () => { layoutRotation = (layoutRotation + 90) % 360 }
  const handleClickGoButton = () => { step.setPainting() }
  
  $: painting = $step == 'painting'
	$: configuring = $step == 'configuring'
	$: showRotation = stitchType === 'square'
	$: showPeyoteControls = stitchType === 'peyote'
</script>

<div class="cell">
  <ConfigPanelGrid {...{configuring, painting, showRotation}}>
    <div slot='stitch-selector'>
      <label for="stitch-type">Stitch Type:</label>
      <select id="stitch-type" bind:value={stitchType}>
        <option value="peyote">Peyote Stitch (Vertical)</option>
        <option value="brick">Brick Stitch (Horizontal)</option>
        <option value="square">Square Stitch</option>
      </select>
      {#if showPeyoteControls && configuring}
        <div class="peyote-controls">
          <label for="starting-row">Start numbering from row:</label>
          <input 
            id="starting-row" 
            type="number" 
            bind:value={$peyoteStartingRow} 
            min="-100" 
            max="100" 
            step="1"
            class="starting-row-input"
          />
        </div>
      {/if}
    </div>
    <div slot='rotate-buttons'>
      <button on:click={rotateRight} class='secondary-button' aria-label='rotate'>
        <span class='rotate-symbol'>↻</span>
      </button>
    </div>
    <p slot='label' class='label'>{gridSize} x {gridSize}</p>
    <input type='range' slot='slider' bind:value={gridSize} min={5} max={50} step={1}>
    <button slot='go-button' class='go-button' on:click={handleClickGoButton}>Go!</button>
  </ConfigPanelGrid>
</div>

<style>
  .cell{
    grid-area: config-panel;
    align-self: center;
    text-align: center;
  }

  .label {
    font-weight: 900;
    font-size: 2em;
  }

  .go-button {
    width: 2.5em;
    height: 2.5em;
    border-radius: 2.5em;
  }

  .rotate-symbol {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    display: block;
    line-height: 1;
  }

  .secondary-button {
    width: 2.5em;
    height: 2.5em;
    border: 2px solid #ccc;
    border-radius: 0.5em;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .secondary-button:hover {
    border-color: #4CAF50;
    background: #f0f8f0;
  }

  .secondary-button:active {
    background: #e0f0e0;
  }

  #stitch-type {
    padding: 0.3em;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    background: white;
    font-size: 0.9em;
    cursor: pointer;
  }

  #stitch-type:focus {
    outline: none;
    border-color: #4CAF50;
  }

  label[for="stitch-type"] {
    display: block;
    margin-bottom: 0.3em;
    font-weight: bold;
    font-size: 0.9em;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    height: 1em;
    width: 80%;
    border-radius: 0.4em;
    margin: 0.5em 0;
    background: #d3d3d3;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: none;
    background: #4CAF50;
    cursor: pointer;
  }

  input::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  .peyote-controls {
    margin-top: 0.5em;
    padding-top: 0.5em;
    border-top: 1px solid #eee;
  }

  .peyote-controls label {
    display: block;
    margin-bottom: 0.3em;
    font-weight: bold;
    font-size: 0.8em;
    color: #666;
  }

  .starting-row-input {
    width: 100%;
    padding: 0.3em;
    border: 1px solid #ccc;
    border-radius: 0.3em;
    background: white;
    font-size: 0.9em;
    text-align: center;
  }

  .starting-row-input:focus {
    outline: none;
    border-color: #4CAF50;
  }
</style>