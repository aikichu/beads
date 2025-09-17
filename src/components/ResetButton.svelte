<script>
  import { canvasColors, history, selectedBeads, moveOffset, toolMode } from '../stores.js'

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the canvas? This will clear all your work.')) {
      canvasColors.reset()
      history.reset()
      selectedBeads.clear()
      moveOffset.reset()
      toolMode.reset()
    }
  }
</script>

<div class="reset-control">
  <button on:click={handleReset} class='reset-button' aria-label='reset canvas' title='Reset canvas (clear all work)'>
    🗑️
  </button>
</div>

<style>
  .reset-control {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
  }

  .reset-button {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .reset-button:hover {
    background-color: #c82333;
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .reset-control {
      padding: 0.3rem;
    }

    .reset-button {
      width: 2.2rem;
      height: 2.2rem;
      font-size: 1rem;
    }
  }

  @media (max-width: 768px) {
    .reset-control {
      padding: 0.2rem;
    }

    .reset-button {
      width: 2rem;
      height: 2rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .reset-control {
      padding: 0.1rem;
    }

    .reset-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.8rem;
    }
  }
</style>