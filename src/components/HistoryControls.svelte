<script>
  import { history, canvasColors } from '../stores.js'

  const handleUndo = () => {
    const newState = history.undo()
    canvasColors.set(newState)
  }

  const handleRedo = () => {
    const newState = history.redo()
    canvasColors.set(newState)
  }

  // Subscribe to history state
  $: canUndo = $history.canUndo || false
  $: canRedo = $history.canRedo || false
</script>

<div class="history-controls">
  <h4>History</h4>
  <div class="history-buttons">
    <button
      on:click={handleUndo}
      class='history-button'
      class:disabled={!canUndo}
      disabled={!canUndo}
      aria-label={canUndo ? 'undo' : 'undo (disabled)'}
      title='Undo last action'
    >
      ↶
    </button>
    <button
      on:click={handleRedo}
      class='history-button'
      class:disabled={!canRedo}
      disabled={!canRedo}
      aria-label={canRedo ? 'redo' : 'redo (disabled)'}
      title='Redo last action'
    >
      ↷
    </button>
  </div>
</div>

<style>
  .history-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    border-radius: 0.75rem;
    border: 1px solid #fdcb6e;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .history-controls {
      flex-direction: row;
      justify-content: center;
      gap: 0.3rem;
      padding: 0.3rem;
    }

    h4 {
      margin: 0;
      font-size: 0.8rem;
    }

    .history-buttons {
      gap: 0.2rem;
    }

    .history-button {
      width: 1.8rem;
      height: 1.8rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    .history-controls {
      gap: 0.2rem;
      padding: 0.2rem;
    }

    h4 {
      font-size: 0.7rem;
    }

    .history-button {
      width: 1.6rem;
      height: 1.6rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .history-controls {
      gap: 0.1rem;
      padding: 0.1rem;
    }

    .history-button {
      width: 1.4rem;
      height: 1.4rem;
      font-size: 0.7rem;
    }
  }

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    font-weight: 600;
  }

  .history-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .history-button {
    width: 2rem;
    height: 2rem;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .history-button:hover:not(.disabled) {
    background-color: #e0a800;
  }

  .history-button.disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>