<script>
  import Bead from './Bead.svelte'
  import { canvasColors, selectedColorId, history, step, zoomLevel, selectedBeads, moveOffset, toolMode, gridVisible } from './stores.js'
  export let gridSize
  export let layoutRotation
  export let stitchType = 'offset' // 'offset' for current layout, 'square' for square stitch

  const range = (s) => [...Array(s).keys()]

  const beadSizeRatio = 0.82
  const beadWidth = 2 * beadSizeRatio
  const beadHeight = 2

  $: totalSideWidth = 2 * (gridSize + 1)
  $: totalSideHeight = 2 * (gridSize + 2)
  $: viewBox = stitchType === 'square' 
    ? `0 0 ${Math.max(totalSideWidth, gridSize * beadWidth + 2)} ${Math.max(totalSideHeight, gridSize * beadHeight + 2)}`
    : stitchType === 'raw'
    ? `0 0 ${gridSize * beadWidth * 0.8 + beadWidth * 2} ${gridSize * beadHeight * 0.8 + beadHeight * 2}`
    : `0 0 ${totalSideWidth} ${totalSideHeight}`

  const makeBeads = (size, h, w, totalH, totalW, angle, stitch) => {
    if (stitch === 'raw') {
      const beads = []
      const unitSpacing = w * 0.8 // Closer spacing so units overlap
      const beadMap = new Map() // Track bead positions to avoid duplicates
      
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const centerX = j * unitSpacing + w
          const centerY = i * unitSpacing + h
          
          // Define 4 bead positions for this unit
          const positions = [
            { x: centerX, y: centerY - unitSpacing/2, key: `${j}_${i-0.5}` },     // top (shared with unit above)
            { x: centerX + unitSpacing/2, y: centerY, key: `${j+0.5}_${i}` },     // right (shared with unit right)
            { x: centerX, y: centerY + unitSpacing/2, key: `${j}_${i+0.5}` },     // bottom (shared with unit below)  
            { x: centerX - unitSpacing/2, y: centerY, key: `${j-0.5}_${i}` }      // left (shared with unit left)
          ]
          
          positions.forEach((pos, index) => {
            // Only create bead if this position doesn't already exist (avoid duplicates from sharing)
            if (!beadMap.has(pos.key)) {
              const beadId = beadMap.size // Sequential ID
              beadMap.set(pos.key, beadId)
              
              beads.push({
                id: beadId,
                x: pos.x,
                y: pos.y,
                width: w * 0.4,
                height: h * 0.4,
                shape: 'circle'
              })
            }
          })
        }
      }
      return beads
    } else if (stitch === 'square') {
      // Square stitch: beads are arranged in a regular grid, can rotate between vertical and horizontal
      const gridWidth = size * w
      const gridHeight = size * h
      let startX, startY
      
      if (angle === 90 || angle === 270) {
        // Horizontal orientation
        startX = (totalW - gridWidth) / 2
        startY = (totalH - gridHeight) / 2
      } else {
        // Vertical orientation (0° and 180°)
        startX = (totalW - gridHeight) / 2
        startY = (totalH - gridWidth) / 2
      }
      
      const beads = []
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (angle === 90 || angle === 270) {
            // Horizontal orientation
            beads.push({
              id: i * size + j,
              x: startX + w * j,
              y: startY + h * i,
              height: h,
              width: w,
            })
          } else {
            // Vertical orientation
            beads.push({
              id: i * size + j,
              x: startX + h * i,
              y: startY + w * j,
              height: w,
              width: h,
            })
          }
        }
      }
      return beads
    } else if (stitch === 'peyote') {
      // Peyote stitch: vertical orientation (0° and 180° rotations)
      if (angle === 180) {
        return range(size).flatMap(i => range(size).flatMap(j=> ({
          id: i*size + j,
          x: totalW - (w * (i + 1.5)) - 6,
          y: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)) + 1,
          height: h,
          width: w,
        })))
      } else {
        // Default 0° rotation
        return range(size).flatMap(i => range(size).flatMap(j=> ({
          id: i*size + j,
          x: w * (i + 1.5) + 2,
          y: i % 2 ? h * (j + 1) : h * (j + 1.5),
          height: h,
          width: w,
        })))
      }
    } else if (stitch === 'brick') {
      // Brick stitch: horizontal orientation (90° and 270° rotations)
      if (angle === 90) {
        return range(size).flatMap(i => range(size).flatMap(j=> ({
          id: i*size + j,
          x: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)),
          y: w * (i + 1.5) + 3,
          height: w,
          width: h,
        })))
      } else {
        // 270° rotation
        return range(size).flatMap(i => range(size).flatMap(j=> ({
          id: i*size + j,
          x: i % 2 ? h * (j + 1) : h * (j + 1.5) - 2,
          y: totalW - (w * (i + 1.5) + 3) - 2,
          height: w,
          width: h,
        })))
      }
    } else {
      // Fallback to original offset layout for backward compatibility
      switch(angle) {
        case 90 :
          return range(size).flatMap(i => range(size).flatMap(j=> ({
            id: i*size + j,
            x: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)),
            y: w * (i + 1.5) + 3,
            height: w,
            width: h,
          })))
        case 180 :
          return range(size).flatMap(i => range(size).flatMap(j=> ({
            id: i*size + j,
            x: totalW - (w * (i + 1.5)) - 6,
            y: totalH - (i % 2 ? h * (j + 1) : h * (j + 1.5)) + 1,
            height: h,
            width: w,
          })))
        case 270 :
          return range(size).flatMap(i => range(size).flatMap(j=> ({
            id: i*size + j,
            x: i % 2 ? h * (j + 1) : h * (j + 1.5) - 2,
            y: totalW - (w * (i + 1.5) + 3) - 2,
            height: h,
            width: w,
          })))
        default :
          return range(size).flatMap(i => range(size).flatMap(j=> ({
            id: i*size + j,
            x: w * (i + 1.5) + 2,
            y: i % 2 ? h * (j + 1) : h * (j + 1.5),
            height: h,
            width: w,
          })))
      }
    }
  }

  $: beads = makeBeads(gridSize, beadHeight, beadWidth, totalSideWidth, totalSideHeight, layoutRotation, stitchType)
  
  // Function to get bead position from ID for different stitch types
  const getBeadPosition = (beadId, stitchType, gridSize, layoutRotation) => {
    const row = Math.floor(beadId / gridSize)
    const col = beadId % gridSize
    return { row, col }
  }

  // Function to get new bead ID from position for different stitch types
  const getBeadIdFromPosition = (row, col, gridSize) => {
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return row * gridSize + col
    }
    return null
  }

  // Create preview beads for selected beads with move offset
  $: previewBeads = (() => {
    if ($selectedBeads.size === 0 || ($moveOffset.x === 0 && $moveOffset.y === 0)) {
      return []
    }
    
    const previews = []
    const selectedArray = Array.from($selectedBeads)
    
    selectedArray.forEach(beadId => {
      const originalBead = beads.find(b => b.id === beadId)
      if (originalBead && $canvasColors[beadId] !== undefined) {
        // Get current position using proper mapping
        const position = getBeadPosition(beadId, stitchType, gridSize, layoutRotation)
        
        const newRow = position.row + $moveOffset.y
        const newCol = position.col + $moveOffset.x
        
        // Get new bead ID using proper mapping
        const newBeadId = getBeadIdFromPosition(newRow, newCol, gridSize)
        
        if (newBeadId !== null) {
          // Find the bead at the new position to get its actual coordinates
          const targetBead = beads.find(b => b.id === newBeadId)
          if (targetBead) {
            const newBead = {
              ...targetBead,
              id: `preview_${beadId}`,
            }
            previews.push(newBead)
          }
        }
      }
    })
    
    return previews
  })()
  


  const handleTouchMove = (e) => {
    if($step != "painting") return
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