<script>
  import Bead from './Bead.svelte'
  import { canvasColors, selectedColorId, history, step, zoomLevel, selectedBeads, moveOffset } from './stores.js'
  import { makeBeads, BEAD_WIDTH, BEAD_HEIGHT } from './beadGenerators.js'
  import { calculatePreviewBeads } from './beadPositionUtils.js'

  export let gridSize
  export let layoutRotation
  export let stitchType = 'offset' // 'offset' for current layout, 'square' for square stitch

  $: totalSideWidth = 2 * (gridSize + 1)
  $: totalSideHeight = 2 * (gridSize + 2)
  $: viewBox = stitchType === 'square'
    ? `0 0 ${Math.max(totalSideWidth, gridSize * BEAD_WIDTH + 2)} ${Math.max(totalSideHeight, gridSize * BEAD_HEIGHT + 2)}`
    : stitchType === 'raw'
    ? `0 0 ${gridSize * BEAD_WIDTH * 0.8 + BEAD_WIDTH * 2} ${gridSize * BEAD_HEIGHT * 0.8 + BEAD_HEIGHT * 2}`
    : `0 0 ${totalSideWidth} ${totalSideHeight}`

  $: beads = makeBeads(gridSize, BEAD_HEIGHT, BEAD_WIDTH, totalSideWidth, totalSideHeight, layoutRotation, stitchType)

  // Create preview beads for selected beads with move offset
  $: previewBeads = calculatePreviewBeads(
    $selectedBeads,
    $moveOffset,
    beads,
    $canvasColors,
    stitchType,
    gridSize,
    layoutRotation
  )



  const handleTouchMove = (e) => {
    if($step !== "painting") return
    $canvasColors[document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY).id] = $selectedColorId
  }

  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomLevel.zoomIn()
    } else {
      zoomLevel.zoomOut()
    }
  }
</script>

<svg {viewBox} on:touchmove={handleTouchMove} on:pointerup={() => history.commit($canvasColors)} on:wheel={handleWheel}>
  <g transform="scale({$zoomLevel})">
    {#each beads as bead (bead.id)}
      <Bead {...bead} {stitchType} />
    {/each}
    <!-- Preview beads for move operation -->
    {#each previewBeads as previewBead (previewBead.id)}
      <Bead {...previewBead} isPreview={true} {stitchType} />
    {/each}
  </g>
</svg>

<style>
  svg{
    /* border: red 2px solid; */
    touch-action: none;
    max-height: 80vh;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>