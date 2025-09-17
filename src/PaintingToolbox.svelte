<script>
  import PaintingToolboxGrid from './PaintingToolboxGrid.svelte'
  import { colorPalette, selectedColorId, eraserMode } from './stores.js'
  

  $: selectedColor = $colorPalette[$selectedColorId]
  const selectColor = (id) => () => {
    if (!$eraserMode) {
      selectedColorId.set(id)
    }
  }

  // Remove history-related code since it's now handled by HistoryControls component
  // History functionality is available in ToolPanel through HistoryControls

</script>

<div class="cell">
  <PaintingToolboxGrid>
    <input
      slot='hue-slider'
      type='range' class='hue-gradient'
      min=0 max=360 step=1
      bind:value={$colorPalette[$selectedColorId].h}
    />
    <input
      slot='sat-slider'
      type='range' class='sat-gradient' style="--h:{selectedColor.h}; --l:{selectedColor.l}%"
      min=0 max=100 step=1
      bind:value={$colorPalette[$selectedColorId].s}
    />
    <input
      slot='light-slider'
      type='range' class='light-gradient' style="--h:{selectedColor.h}; --s:{selectedColor.s}%"
      min=0 max=100 step=1
      bind:value={$colorPalette[$selectedColorId].l}
    />
    <div slot='colors' class='colors-grid'>
      {#each $colorPalette as color (color.id)}
        <div
          class:selected={color.id == $selectedColorId && !$eraserMode}
          class:blank={color.l == 100}
          class:disabled={$eraserMode}
          class='color'
          style="--h:{color.h}; --s:{color.s}%; --l:{color.l}%"
          on:click={selectColor(color.id)}
        />
      {/each}
    </div>
  </PaintingToolboxGrid>
</div>

<style>
  .cell{
    grid-area: painting-toolbox;
    align-self: stretch;
    text-align: center;
  }

  input{
    -webkit-appearance: none;
    appearance: none;
    width: 90%;
    height: 0.8em;
    border-radius: 0.2em;
    cursor: pointer;
  }

  input::-webkit-slider-thumb{
    -webkit-appearance: none;
    height: 1.2em;
    width: 1.2em;
    border-radius: 1.2em;
    border: none;
    background: grey;
    cursor: pointer;
    box-shadow: 0 0 0.2em rgba(0,0,0,0.4);
  }

  input:focus{
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

  .colors-grid{
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: 2em 2em 2em 2em 2em 2em;
    grid-template-rows: 2em 2em;
    gap: 0.2em;
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .colors-grid {
      grid-template-columns: 1.8em 1.8em 1.8em 1.8em 1.8em 1.8em;
      grid-template-rows: 1.8em 1.8em;
      gap: 0.15em;
    }
  }

  @media (max-width: 768px) {
    .colors-grid {
      grid-template-columns: 1.5em 1.5em 1.5em 1.5em 1.5em 1.5em;
      grid-template-rows: 1.5em 1.5em;
      gap: 0.1em;
    }
  }

  @media (max-width: 480px) {
    .colors-grid {
      grid-template-columns: 1.2em 1.2em 1.2em 1.2em 1.2em 1.2em;
      grid-template-rows: 1.2em 1.2em;
      gap: 0.05em;
    }
  }

  .selected{
    transform: scale(1.5);
    filter: drop-shadow(0 0 0.2em rgba(0,0,0,0.2));
    border-radius: 0.4em;
  }

  .color{
    height: 1.3em;
    width: 1.3em;
    transition: all 0.3s ease;
    background-color: hsl(var(--h), var(--s), var(--l));
    box-sizing: border-box;
  }

  .color:not(.selected){
    border-radius: 0.2em;
  }

  .color:not(.selected):hover{
    transform: scale(1.2);
    cursor: pointer;
  }

  .blank:not(.selected){
    filter: drop-shadow(0 0 0.1em rgba(0,0,0,0.2));
  }

  .color.disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }

  .color.disabled:hover{
    transform: none;
  }




</style>