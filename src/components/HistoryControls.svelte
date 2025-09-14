<script>
  import { history, canvasColors } from '../stores.js'

  const handleUndo = () => {
    history.undo()
    canvasColors.set($history.versions[$history.cursor])
  }

  const handleRedo = () => {
    history.redo()
    canvasColors.set($history.versions[$history.cursor])
  }

  $: canUndo = $history.cursor > 0
  $: canRedo = $history.cursor < $history.versions.length - 1
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
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #fff3cd;
    border-radius: 0.5rem;
    border: 1px solid #ffeaa7;
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