<div class="grid">
  <div class='cell cell-hue-slider'><slot name='hue-slider' /></div>
  <div class='cell cell-sat-slider'><slot name='sat-slider' /></div>
  <div class='cell cell-light-slider'><slot name='light-slider' /></div>
  <div class='cell cell-colors'><slot name='colors' /></div>
</div>

<style>
  .grid{
    height: 100%;
    display: grid;
    align-items: center;
    justify-content: space-around;
    grid-template-columns: 3fr 3fr 1fr;
    grid-template-rows: 1fr 1.5em 1.5em 1.5em 1fr;
    grid-template-areas:
      ". colors ."
      "hue-slider colors ."
      "sat-slider colors ."
      "light-slider colors ."
      ". colors .";
  }

  .cell-hue-slider { grid-area: hue-slider; }
  .cell-sat-slider { grid-area: sat-slider; }
  .cell-light-slider { grid-area: light-slider; }

  .cell-colors { grid-area: colors; }

  
</style>