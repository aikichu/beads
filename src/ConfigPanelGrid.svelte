<script>
  export let painting
  export let configuring
  export let showRotation = false
</script>

<div class="grid" class:painting class:configuring class:show-rotation={showRotation}>
  <div class='cell cell-stitch-selector'><slot name='stitch-selector' /></div>
  {#if showRotation}
    <div class='cell cell-rotate-buttons'><slot name='rotate-buttons' /></div>
  {/if}
  {#if configuring}
    <div class='cell cell-label'><slot name='label' /></div>
    <div class='cell cell-slider'><slot name='slider' /></div>
    <div class='cell cell-go-button'><slot name='go-button' /></div>
  {/if}
</div>

<style>
  .grid{
    display: grid;
    align-content: center;
    justify-content: center;
  }

  .configuring{
    grid-template-columns: 8em 20em 5em;
    grid-template-rows: 2em 2em;
    grid-template-areas:
      "stitch-selector label go-button"
      "stitch-selector slider go-button";
  }

  .configuring.show-rotation{
    grid-template-columns: 8em 8em 20em 5em;
    grid-template-areas:
      "stitch-selector rotate-buttons label go-button"
      "stitch-selector rotate-buttons slider go-button";
  }

  .painting{
    grid-template-areas:
      "stitch-selector";
    grid-template-columns: 8em;
  }

  .painting.show-rotation{
    grid-template-areas:
      "stitch-selector rotate-buttons";
    grid-template-columns: 8em 8em;
  }

  .cell{
    align-self: center;
    justify-self: center;
  }

  .cell-stitch-selector{
    grid-area: stitch-selector;
  }

  .cell-rotate-buttons{
    grid-area: rotate-buttons;
  }

  .cell-label{
    grid-area: label;
  }

  .cell-slider{
    grid-area: slider;
    justify-self: stretch;
  }

  .cell-go-button{
    grid-area: go-button;
  }
  
</style>