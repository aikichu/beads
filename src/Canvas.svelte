<script>
  import Bead from './Bead.svelte'
  import { canvasColors, selectedColorId, history, step, zoomLevel, panOffset, isPanning, selectedBeads, moveOffset, fringeVisible, fringeLength, fringeColors, toolMode, peyoteStartingRow } from './stores.js'
  import { makeBeads, BEAD_WIDTH, BEAD_HEIGHT, generateFringeBeads } from './beadGenerators.js'
  import { calculatePreviewBeads } from './beadPositionUtils.js'

  export let gridSize
  export let layoutRotation
  export let stitchType = 'peyote' // 'peyote' for vertical, 'brick' for horizontal, 'square' for grid

  let svgElement
  let lastPanPoint = { x: 0, y: 0 }
  let isTouchPanning = false
  let lastTouchDistance = 0
  let lastTouchCenter = { x: 0, y: 0 }
  let touchStartTime = 0
  let touchStartPosition = { x: 0, y: 0 }
  let isPaintingMode = false
  // Pan mode is now controlled by toolMode store
  $: panMode = $toolMode === 'pan'
  let lastPaintedBead = null // Track last painted bead to avoid repainting
  let isTouchActive = false // Track if a touch is currently active for continuous painting

  $: totalSideWidth = 2 * (gridSize + 1)
  $: totalSideHeight = 2 * (gridSize + 2)
  // Calculate extra height needed for fringe beads
  $: fringeHeight = $fringeLength * BEAD_WIDTH

  // Calculate unified canvas size for consistent appearance across all stitch types
  // Use consistent sizing that accommodates all stitch types without being too large
  $: unifiedCanvasWidth = gridSize * BEAD_WIDTH + 6  // Consistent width with padding
  $: unifiedCanvasHeight = gridSize * BEAD_HEIGHT + 6  // Consistent height with padding
  
  $: maxCanvasWidth = Math.max(unifiedCanvasWidth, totalSideWidth)
  $: maxCanvasHeight = Math.max(unifiedCanvasHeight, totalSideHeight)

  // Use consistent viewBox that doesn't change based on fringe visibility
  $: viewBox = `0 0 ${maxCanvasWidth} ${maxCanvasHeight}`

  $: beads = makeBeads(gridSize, BEAD_HEIGHT, BEAD_WIDTH, totalSideWidth, totalSideHeight, layoutRotation, stitchType, $peyoteStartingRow)

  // Generate fringe beads when fringe is visible and stitch type is brick
  $: fringeBeads = ($fringeVisible && stitchType === 'brick') 
    ? generateFringeBeads($fringeVisible, $fringeLength, beads, gridSize, BEAD_HEIGHT, BEAD_WIDTH, layoutRotation)
    : []

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

  // Transform string for the canvas group
  $: transform = `translate(${$panOffset.x}, ${$panOffset.y}) scale(${$zoomLevel})`

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch - only handle if in pan mode
      if (panMode) {
        const touch = e.touches[0]
        touchStartTime = Date.now()
        touchStartPosition = { x: touch.clientX, y: touch.clientY }
        lastPanPoint = { x: touch.clientX, y: touch.clientY }
        isTouchPanning = true
        isPaintingMode = false
        e.preventDefault() // Prevent default to allow panning
      } else {
        // In paint mode, track that a touch is active for continuous painting
        isTouchActive = true
        
        // Also handle the initial touch painting using elementFromPoint
        const touch = e.touches[0]
        const element = document.elementFromPoint(touch.clientX, touch.clientY)
        
        if (element && element.id && element.tagName === 'ellipse' || element.tagName === 'circle' || element.tagName === 'rect') {
          // Found a bead element, paint it
          const beadId = element.id
          const currentToolMode = $toolMode
          
          console.log('Touch painting element:', {
            touchX: touch.clientX,
            touchY: touch.clientY,
            elementId: beadId,
            elementTag: element.tagName
          })
          
          if (currentToolMode === 'paint') {
            // Check if it's a fringe bead by looking at the bead data
            const bead = beads.find(b => b.id === beadId) || fringeBeads.find(b => b.id === beadId)
            if (bead && bead.isFringe) {
              // Handle fringe bead painting
              fringeColors.update((oldFringeColors) => ({...oldFringeColors, [beadId]: $selectedColorId}))
            } else {
              // Handle main canvas bead painting
              $canvasColors[beadId] = $selectedColorId
            }
          } else if (currentToolMode === 'eraser') {
            // Eraser mode: remove color from this bead
            const bead = beads.find(b => b.id === beadId) || fringeBeads.find(b => b.id === beadId)
            if (bead && bead.isFringe) {
              fringeColors.update((oldFringeColors) => {
                const newFringeColors = {...oldFringeColors}
                delete newFringeColors[beadId]
                return newFringeColors
              })
            } else {
              canvasColors.update((oldCanvas) => {
                const newCanvas = {...oldCanvas}
                delete newCanvas[beadId]
                return newCanvas
              })
            }
          }
          lastPaintedBead = beadId
        }
      }
    } else if (e.touches.length === 2) {
      // Two touches - always panning (for pan mode) or pinch zoom
      e.preventDefault()
      if (panMode) {
        // Two-finger panning
        isTouchPanning = true
        isPaintingMode = false
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        lastPanPoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }
      } else {
        // Two-finger pinch zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        lastTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        lastTouchCenter = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }
        isTouchPanning = false
        isPaintingMode = false
      }
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      // Only handle single touch move if in pan mode
      if (panMode && isTouchPanning) {
        const touch = e.touches[0]
        const deltaX = touch.clientX - lastPanPoint.x
        const deltaY = touch.clientY - lastPanPoint.y
        
        e.preventDefault()
        
        // Much lower sensitivity for smoother touch panning
        const sensitivity = 0.25
        
        panOffset.update(offset => ({
          x: offset.x + deltaX * sensitivity,
          y: offset.y + deltaY * sensitivity
        }))
        
        lastPanPoint = { x: touch.clientX, y: touch.clientY }
      } else if (!panMode && isTouchActive && $step === "painting") {
        // In paint mode with active touch, handle continuous painting using elementFromPoint
        const touch = e.touches[0]
        const element = document.elementFromPoint(touch.clientX, touch.clientY)
        
        if (element && element.id && (element.tagName === 'ellipse' || element.tagName === 'circle' || element.tagName === 'rect') && element.id !== lastPaintedBead) {
          // Found a bead element, paint it
          const beadId = element.id
          const currentToolMode = $toolMode
          
          console.log('Touch move painting element:', {
            touchX: touch.clientX,
            touchY: touch.clientY,
            elementId: beadId,
            elementTag: element.tagName
          })
          
          if (currentToolMode === 'paint') {
            // Check if it's a fringe bead by looking at the bead data
            const bead = beads.find(b => b.id === beadId) || fringeBeads.find(b => b.id === beadId)
            if (bead && bead.isFringe) {
              // Handle fringe bead painting
              fringeColors.update((oldFringeColors) => ({...oldFringeColors, [beadId]: $selectedColorId}))
            } else {
              // Handle main canvas bead painting
              $canvasColors[beadId] = $selectedColorId
            }
          } else if (currentToolMode === 'eraser') {
            // Eraser mode: remove color from this bead
            const bead = beads.find(b => b.id === beadId) || fringeBeads.find(b => b.id === beadId)
            if (bead && bead.isFringe) {
              fringeColors.update((oldFringeColors) => {
                const newFringeColors = {...oldFringeColors}
                delete newFringeColors[beadId]
                return newFringeColors
              })
            } else {
              canvasColors.update((oldCanvas) => {
                const newCanvas = {...oldCanvas}
                delete newCanvas[beadId]
                return newCanvas
              })
            }
          }
          lastPaintedBead = beadId
        }
      }
    } else if (e.touches.length === 2) {
      // Two finger gestures
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      
      if (panMode) {
        // Two-finger panning
        const centerX = (touch1.clientX + touch2.clientX) / 2
        const centerY = (touch1.clientY + touch2.clientY) / 2
        const deltaX = centerX - lastPanPoint.x
        const deltaY = centerY - lastPanPoint.y
        
        const sensitivity = 0.25
        panOffset.update(offset => ({
          x: offset.x + deltaX * sensitivity,
          y: offset.y + deltaY * sensitivity
        }))
        
        lastPanPoint = { x: centerX, y: centerY }
      } else {
        // Two-finger pinch zoom
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        if (lastTouchDistance > 0) {
          const scale = currentDistance / lastTouchDistance
          const newZoom = Math.max(0.2, Math.min(5, $zoomLevel * scale))
          
          if (newZoom !== $zoomLevel) {
            // Get center point for zoom
            const rect = svgElement.getBoundingClientRect()
            const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left
            const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top
            
            // Convert to SVG coordinates
            const svgPoint = svgElement.createSVGPoint()
            svgPoint.x = centerX
            svgPoint.y = centerY
            const ctm = svgElement.getScreenCTM().inverse()
            const point = svgPoint.matrixTransform(ctm)
            
            const oldZoom = $zoomLevel
            
            // Calculate the point in world coordinates before zoom
            const worldX = (point.x - $panOffset.x) / oldZoom
            const worldY = (point.y - $panOffset.y) / oldZoom
            
            // Update zoom
            zoomLevel.set(newZoom)
            
            // Adjust pan to keep the center point in the same world position
            const newPanX = point.x - worldX * newZoom
            const newPanY = point.y - worldY * newZoom
            
            panOffset.set({ x: newPanX, y: newPanY })
          }
        }
        
        lastTouchDistance = currentDistance
      }
    }
  }

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      // Reset touch state
      if (panMode) {
        isTouchPanning = false
        isPaintingMode = false
        lastTouchDistance = 0
        touchStartTime = 0
        lastPaintedBead = null
      }
      // Clear touch active state for continuous painting
      isTouchActive = false
    } else if (e.touches.length === 1 && panMode) {
      // Reset for single touch only in pan mode
      const touch = e.touches[0]
      touchStartTime = Date.now()
      touchStartPosition = { x: touch.clientX, y: touch.clientY }
      lastPanPoint = { x: touch.clientX, y: touch.clientY }
      lastPaintedBead = null
      isTouchPanning = true
      isPaintingMode = false
    }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    
    // Get mouse position relative to SVG
    const rect = svgElement.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Convert to SVG coordinates
    const svgPoint = svgElement.createSVGPoint()
    svgPoint.x = mouseX
    svgPoint.y = mouseY
    const ctm = svgElement.getScreenCTM().inverse()
    const point = svgPoint.matrixTransform(ctm)
    
    const oldZoom = $zoomLevel
    const zoomFactor = e.deltaY < 0 ? 1.2 : 1 / 1.2
    const newZoom = Math.max(0.2, Math.min(5, oldZoom * zoomFactor))
    
    if (newZoom !== oldZoom) {
      // Calculate the point in world coordinates before zoom
      const worldX = (point.x - $panOffset.x) / oldZoom
      const worldY = (point.y - $panOffset.y) / oldZoom
      
      // Update zoom
      zoomLevel.set(newZoom)
      
      // Adjust pan to keep the mouse point in the same world position
      const newPanX = point.x - worldX * newZoom
      const newPanY = point.y - worldY * newZoom
      
      panOffset.set({ x: newPanX, y: newPanY })
    }
  }

  const handleMouseDown = (e) => {
    if (e.button === 1 || e.button === 2) { // Middle mouse or Right click
      e.preventDefault()
      e.stopPropagation() // Prevent bead click events
      isPanning.set(true)
      lastPanPoint = { x: e.clientX, y: e.clientY }
      svgElement.style.cursor = 'grabbing'
    }
  }

  const handleMouseMove = (e) => {
    if ($isPanning) {
      e.preventDefault()
      e.stopPropagation() // Prevent bead events
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      
      // Much lower sensitivity for smoother panning
      const sensitivity = 0.3
      
      panOffset.update(offset => ({
        x: offset.x + deltaX * sensitivity,
        y: offset.y + deltaY * sensitivity
      }))
      
      lastPanPoint = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = (e) => {
    if ($isPanning) {
      e.preventDefault()
      e.stopPropagation() // Prevent bead events
      isPanning.set(false)
      svgElement.style.cursor = 'grab'
    }
  }

  const handleMouseLeave = () => {
    if ($isPanning) {
      isPanning.set(false)
      svgElement.style.cursor = 'grab'
    }
  }

  const resetView = () => {
    zoomLevel.set(1)
    panOffset.set({ x: 0, y: 0 })
  }

  // Expose functions and state for external use
  export { resetView, isTouchActive }
</script>

<svg 
  bind:this={svgElement}
  {viewBox} 
  class:pan-mode={panMode}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove} 
  on:touchend={handleTouchEnd}
  on:pointerup={() => history.commit($canvasColors)} 
  on:wheel={handleWheel}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseLeave}
  on:contextmenu={(e) => e.preventDefault()}
>
  <g {transform}>
    {#each beads as bead (bead.id)}
      <Bead {...bead} {stitchType} {isTouchActive} />
    {/each}
    <!-- Fringe beads -->
    {#each fringeBeads as fringeBead (fringeBead.id)}
      <Bead {...fringeBead} {stitchType} {isTouchActive} />
    {/each}
    <!-- Preview beads for move operation -->
    {#each previewBeads as previewBead (previewBead.id)}
      <Bead {...previewBead} isPreview={true} {stitchType} {isTouchActive} />
    {/each}
  </g>
</svg>

<style>
  svg{
    touch-action: none;
    /* Responsive sizing that maintains aspect ratio */
    width: 100%;
    height: auto;
    max-height: 80vh;
    max-width: 100%;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: grab;
    /* Improve touch responsiveness on mobile */
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    /* Ensure consistent sizing */
    min-height: 400px;
    /* Canvas border styling to match toolbox */
    border: 1px solid #dee2e6;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background: white;
  }

  /* Allow touch events for individual elements when not in pan mode */
  svg:not(.pan-mode) {
    touch-action: auto;
  }
  
  svg:active {
    cursor: grabbing;
  }
  
  /* Tablet-specific improvements */
  @media (max-width: 1024px) and (min-width: 769px) {
    svg {
      max-height: 75vh;
      min-height: 350px;
    }
  }
  
  /* Mobile-specific improvements */
  @media (max-width: 768px) {
    svg {
      max-height: 70vh;
      min-height: 300px;
    }
  }
  
  /* Small mobile devices */
  @media (max-width: 480px) {
    svg {
      max-height: 65vh;
      min-height: 250px;
    }
  }
</style>