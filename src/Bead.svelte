<script>
  export let id
  export let x
  export let y
  export let width
  export let height
  export let shape = 'rectangle'
  export let isPreview = false
  export let stitchType = 'offset'
  export let isFringe = false
  export let isTouchActive = false

  // Only import stores that are actually needed
  import { colorPalette, canvasColors, selectedColorId, history, step, legendVisible, gridVisible, toolMode, selectedBeads, fringeColors, isPanning } from './stores.js'

  $: originalId = isPreview ? id.replace('preview_', '') : id
  $: beadColorId = isFringe ? $fringeColors[originalId] : $canvasColors[originalId]
  $: color = (beadColorId !== undefined) ? $colorPalette[beadColorId] : {h: 0, s: 100, l: 100}
  $: fill = `hsl(${color.h}, ${color.s}%, ${color.l}%)`
  $: symbol = color.symbol || ''
  $: isSelected = $selectedBeads.has(originalId)
  $: isColored = beadColorId !== undefined
  
  // Calculate symbol color based on bead color brightness
  $: symbolColor = (() => {
    if (beadColorId === undefined) return 'black' // Default for uncolored beads
    
    // Convert HSL to RGB for brightness calculation
    const h = color.h / 360
    const s = color.s / 100
    const l = color.l / 100
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    // Calculate relative luminance (brightness)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    
    // Use white symbols for dark colors, black for light colors
    return luminance < 0.5 ? 'white' : 'black'
  })()

  const paint = () => {
    // Use get() to read current value without subscribing
    const currentToolMode = $toolMode

    if (isFringe) {
      // Handle fringe bead painting
      if (currentToolMode === 'eraser') {
        // Eraser mode: remove color from this fringe bead
        fringeColors.update((oldFringeColors) => {
          const newFringeColors = {...oldFringeColors}
          delete newFringeColors[originalId]
          return newFringeColors
        })
      } else if (currentToolMode === 'paint') {
        // Paint mode: apply selected color to this fringe bead
        fringeColors.update((oldFringeColors) => ({...oldFringeColors, [originalId]: $selectedColorId}))
      }
    } else {
      // Handle main canvas bead painting
      if (currentToolMode === 'eraser') {
        // Eraser mode: remove color from this bead
        canvasColors.update((oldCanvas) => {
          const newCanvas = {...oldCanvas}
          delete newCanvas[originalId]
          return newCanvas
        })
      } else if (currentToolMode === 'paint') {
        // Paint mode: apply selected color to this bead
        canvasColors.update((oldCanvas) => ({...oldCanvas, [originalId]: $selectedColorId}))
      }
    }
  }

  const handleClick = () => {
    if($step !== "painting" || isPreview || $isPanning) return

    const currentToolMode = $toolMode

    if(currentToolMode === 'selection') {
      // Disable selection for raw stitch
      if(stitchType === 'raw') {
        return
      }
      // Selection mode: only select colored beads
      if(isColored) {
        if(isSelected) {
          selectedBeads.remove(originalId)
        } else {
          selectedBeads.add(originalId)
        }
      }
    } else if(currentToolMode === 'paint' || currentToolMode === 'eraser') {
      // Paint or eraser mode
      paint()
      history.commit($canvasColors)
    }
  }
  
  const handleMouseEnter = (e) => {
    if($step !== "painting" || isPreview || $isPanning) return

    const currentToolMode = $toolMode

    if(currentToolMode === 'selection') {
      // Disable selection for raw stitch
      if(stitchType === 'raw') {
        return
      }
      // Selection mode: only select colored beads on drag
      if(e.buttons === 1 && isColored) {
        if(!isSelected) {
          selectedBeads.add(originalId)
        }
      }
    } else if(currentToolMode === 'paint' || currentToolMode === 'eraser') {
      // Paint or eraser mode
      if(e.buttons === 1) paint()
    }
  }

  const handleTouchStart = (e) => {
    if($step !== "painting" || isPreview) return
    
    // Only handle touch if not in pan mode (pan mode is handled by Canvas)
    const currentToolMode = $toolMode
    
    if(currentToolMode === 'paint' || currentToolMode === 'eraser') {
      e.preventDefault() // Prevent default to avoid conflicts
      paint()
    }
  }

  const handleTouchMove = (e) => {
    if($step !== "painting" || isPreview) return
    
    // Only handle touch if not in pan mode (pan mode is handled by Canvas)
    const currentToolMode = $toolMode
    
    // Paint if touch is active (equivalent to mouse button held down)
    if((currentToolMode === 'paint' || currentToolMode === 'eraser') && isTouchActive) {
      e.preventDefault() // Prevent default to avoid conflicts
      paint()
    }
  }

  const handleTouchEnd = (e) => {
    // Touch end is handled by Canvas component
  }
</script>

{#if shape === 'oval-ring'}
  <!-- RAW stitch: render as hollow oval rings -->
  <ellipse
    {id}
    cx={x + width/2}
    cy={y + height/2}
    rx={width/2}
    ry={height/2}
    fill="none"
    stroke={beadColorId !== undefined ? fill : ($gridVisible ? 'black' : 'none')}
    stroke-width={isSelected ? "0.4" : "0.2"}
    stroke-dasharray={isSelected ? "0.5,0.5" : "none"}
    opacity={isPreview ? "0.6" : "1"}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  />
  {#if beadColorId !== undefined && symbol && $legendVisible}
    <text
      x={x + width/2}
      y={y + height/2 + 0.1}
      text-anchor="middle"
      dominant-baseline="middle"
      font-size={Math.min(width, height) * 0.7}
      fill={symbolColor}
      font-weight="bold"
      pointer-events="none"
    >{symbol}</text>
  {/if}
{:else if shape === 'circle'}
  <!-- RAW stitch: render as individual circular beads -->
  <circle
    {id}
    cx={x + width/2}
    cy={y + height/2}
    r={Math.min(width, height) / 2}
    fill={beadColorId !== undefined ? fill : 'white'}
    stroke={isSelected ? '#9C27B0' : ($gridVisible ? 'black' : 'none')}
    stroke-width={isSelected ? "0.3" : "0.1"}
    stroke-dasharray={isSelected ? "0.5,0.5" : "none"}
    opacity={isPreview ? "0.6" : "1"}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  />
  {#if beadColorId !== undefined && symbol && $legendVisible}
    <text
      x={x + width/2}
      y={y + height/2 + 0.1}
      text-anchor="middle"
      dominant-baseline="middle"
      font-size={Math.min(width, height) * 0.7}
      fill={symbolColor}
      font-weight="bold"
      pointer-events="none"
    >{symbol}</text>
  {/if}
{:else}
  <!-- Other stitch types: render as regular rectangles -->
  <rect
    {...{id, x, y, width, height, fill}}
    stroke={isSelected ? '#9C27B0' : ($gridVisible ? 'black' : 'none')} 
    stroke-width={isSelected ? "0.3" : "0.1"}
    stroke-dasharray={isSelected ? "0.5,0.5" : "none"}
    opacity={isPreview ? "0.6" : "1"}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  />
  {#if beadColorId !== undefined && symbol && $legendVisible}
    <text
      x={x + width/2}
      y={y + height/2 + 0.1}
      text-anchor="middle"
      dominant-baseline="middle"
      font-size={Math.min(width, height) * 0.7}
      fill={symbolColor}
      font-weight="bold"
      pointer-events="none"
    >{symbol}</text>
  {/if}
{/if}

<style>
  rect, circle, ellipse {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  text {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>