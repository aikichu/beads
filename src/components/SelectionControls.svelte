<script>
  import { selectedBeads, moveOffset, canvasColors, history } from '../stores.js'
  import { applyMoveToCanvas } from '../beadPositionUtils.js'

  export let gridSize
  export let stitchType
  export let layoutRotation

  const handleMove = (dx, dy) => {
    if ($selectedBeads.size > 0) {
      moveOffset.move(dx, dy)
    }
  }

  const handleConfirmMove = () => {
    if ($selectedBeads.size > 0 && ($moveOffset.x !== 0 || $moveOffset.y !== 0)) {
      // Apply the move to the canvas using the shared utility
      const newCanvas = applyMoveToCanvas(
        $selectedBeads,
        $moveOffset,
        $canvasColors,
        stitchType,
        gridSize,
        layoutRotation
      )

      canvasColors.set(newCanvas)
      history.commit(newCanvas)

      // Clear selection and reset offset
      selectedBeads.clear()
      moveOffset.reset()
    }
  }
</script>

{#if $selectedBeads.size > 0}
  <div class="move-controls">
    <div class="move-arrows">
      <button on:click={() => handleMove(0, -1)} class='move-button' aria-label='move up'>↑</button>
      <div class="move-row">
        <button on:click={() => handleMove(-1, 0)} class='move-button' aria-label='move left'>←</button>
        <button on:click={() => handleMove(1, 0)} class='move-button' aria-label='move right'>→</button>
      </div>
      <button on:click={() => handleMove(0, 1)} class='move-button' aria-label='move down'>↓</button>
    </div>
    <button on:click={handleConfirmMove} class='confirm-button' aria-label='confirm move'>✓</button>
  </div>
{/if}

<style>
  .move-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #fff3cd;
    border-radius: 0.5rem;
    border: 2px solid #ffc107;
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .move-controls {
      flex-direction: row;
      justify-content: center;
      gap: 0.3rem;
      padding: 0.3rem;
    }

    .move-arrows {
      flex-direction: row;
      gap: 0.2rem;
    }

    .move-row {
      gap: 0.2rem;
    }

    .move-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.7rem;
    }

    .confirm-button {
      width: 2.2rem;
      height: 1.8rem;
      font-size: 0.7rem;
    }
  }

  @media (max-width: 768px) {
    .move-controls {
      gap: 0.2rem;
      padding: 0.2rem;
    }

    .move-arrows {
      gap: 0.1rem;
    }

    .move-row {
      gap: 0.1rem;
    }

    .move-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.6rem;
    }

    .confirm-button {
      width: 2rem;
      height: 1.6rem;
      font-size: 0.6rem;
    }
  }

  @media (max-width: 480px) {
    .move-controls {
      gap: 0.1rem;
      padding: 0.1rem;
    }

    .move-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.5rem;
    }

    .confirm-button {
      width: 1.8rem;
      height: 1.4rem;
      font-size: 0.5rem;
    }
  }

  .move-arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .move-row {
    display: flex;
    gap: 0.25rem;
  }

  .move-button {
    width: 2rem;
    height: 2rem;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .move-button:hover {
    background-color: #e0a800;
  }

  .confirm-button {
    width: 2.5rem;
    height: 2rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .confirm-button:hover {
    background-color: #218838;
  }
</style>