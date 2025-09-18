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
    padding: 0.75rem;
  }

  .reset-button {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .reset-button:hover {
    background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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