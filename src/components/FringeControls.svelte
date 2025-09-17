<script>
  import { fringeLength } from '../stores.js'

  export let stitchType

  // Only show for brick stitch
  $: showFringeControls = stitchType === 'brick'

  // Update fringe length
  const updateFringeLength = (length) => {
    fringeLength.set(Math.max(1, Math.min(20, length))) // Clamp between 1 and 20
  }
</script>

{#if showFringeControls}
  <div class="fringe-controls">
    <h4>Fringe Controls</h4>
    

    <div class="fringe-config">
      <label>
        Length (1-20 beads):
        <input 
          type="number" 
          min="1" 
          max="20" 
          value={$fringeLength}
          on:input={(e) => updateFringeLength(parseInt(e.target.value) || 1)}
        />
      </label>
    </div>
  </div>
{/if}

<style>
  .fringe-controls {
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
  }

  /* Responsive design for narrow screens */
  @media (max-width: 1024px) {
    .fringe-controls {
      padding: 0.5rem;
      margin-top: 0.5rem;
    }

    .fringe-config {
      gap: 0.5rem;
    }

    .fringe-config label {
      font-size: 0.8rem;
      gap: 0.3rem;
    }

    .fringe-config input {
      padding: 0.3rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    .fringe-controls {
      padding: 0.3rem;
      margin-top: 0.3rem;
    }

    .fringe-config {
      gap: 0.3rem;
    }

    .fringe-config label {
      font-size: 0.7rem;
      gap: 0.2rem;
    }

    .fringe-config input {
      padding: 0.2rem;
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    .fringe-controls {
      padding: 0.2rem;
      margin-top: 0.2rem;
    }

    .fringe-config {
      gap: 0.2rem;
    }

    .fringe-config label {
      font-size: 0.6rem;
      gap: 0.1rem;
    }

    .fringe-config input {
      padding: 0.1rem;
      font-size: 0.6rem;
    }
  }

  .fringe-controls h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
  }
  
  .fringe-config {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .fringe-config label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  .fringe-config input {
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    font-size: 0.9rem;
  }
</style>
