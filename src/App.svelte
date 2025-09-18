<script>
	import Logo from './Logo.svelte'
	import ToolPanel from './ToolPanel.svelte'
	import Workspace from './Workspace.svelte'
	import Canvas from './Canvas.svelte'
	import ColorLegend from './ColorLegend.svelte'
	import RowNumbers from './RowNumbers.svelte'

	import { step } from './stores.js'

	let gridSize = 20
	let layoutRotation = 90
	let stitchType = 'peyote' // 'peyote' for vertical, 'brick' for horizontal, 'square' for grid
	$: painting = $step === 'painting'
	$: configuring = $step === 'configuring'
</script>

<main class:painting class:configuring>
	<Logo />
	{#if configuring}
		<div class="config-panel">
			<div class="config-controls">
				<p class="label">{gridSize} x {gridSize}</p>
				<input type='range' bind:value={gridSize} min={5} max={50} step={1}>
				<button class='go-button' on:click={() => step.setPainting()}>Go!</button>
			</div>
		</div>
	{/if}

	<Workspace>
		<div class="canvas-area">
			<Canvas {...{gridSize, layoutRotation, stitchType}} />
			{#if painting}
				<ToolPanel bind:gridSize bind:stitchType bind:layoutRotation />
			{/if}
		</div>
		{#if painting}
			<div class="legend-area">
				<ColorLegend />
				<RowNumbers />
			</div>
		{/if}
	</Workspace>
</main>

<style>
	main {
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		min-height: 100vh;

		display: grid;
		grid-template-columns: 15rem 1fr 12rem;
		grid-template-rows: auto 1fr;
		gap: 0.5em 0.5em;
	}

	.painting {
		grid-template-areas: 
			"logo . ."
			"workspace workspace workspace";
	}

	.configuring {
		grid-template-areas: 
			"logo config-panel ."
			"workspace workspace .";
	}

	.config-panel {
		grid-area: config-panel;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		min-height: 8rem;
	}

	.config-controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		width: 100%;
		max-width: 300px;
	}

	.label {
		font-weight: 900;
		font-size: 2em;
		margin: 0;
		line-height: 1.2;
		white-space: nowrap;
		overflow: visible;
	}

	.go-button {
		width: 2.5em;
		height: 2.5em;
		border-radius: 2.5em;
		border: 2px solid #4CAF50;
		background: #4CAF50;
		color: white;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.go-button:hover {
		background: #45a049;
		transform: scale(1.05);
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		height: 1em;
		width: 200px;
		border-radius: 0.4em;
		background: #d3d3d3;
		outline: none;
		-webkit-transition: .2s;
		transition: opacity .2s;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		border: none;
		background: #4CAF50;
		cursor: pointer;
	}

	input[type="range"]::-moz-range-thumb {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #4CAF50;
		cursor: pointer;
	}

	.canvas-area {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.legend-area {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 1rem;
		gap: 1rem;
	}

	/* Responsive design for narrow screens */
	@media (max-width: 1200px) {
		main {
			grid-template-columns: 12rem 1fr 10rem;
			gap: 0.3em 0.3em;
		}
	}

	@media (max-width: 1024px) {
		main {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto 1fr;
			gap: 0.5em;
		}

		.painting {
			grid-template-areas: 
				"logo"
				"workspace";
		}

		.configuring {
			grid-template-areas: 
				"logo"
				"config-panel"
				"workspace";
		}

		.config-panel {
			min-height: 6rem;
			padding: 0.5rem;
		}

		.canvas-area {
			flex-direction: column;
			gap: 0.5rem;
		}

		.legend-area {
			margin-top: 0.5rem;
			align-self: stretch;
		}
	}

	@media (max-width: 768px) {
		main {
			grid-template-rows: auto auto 1fr;
			gap: 0.3em;
			padding: 0.3em;
		}

		.config-panel {
			min-height: 5rem;
			padding: 0.3rem;
		}

		.canvas-area {
			flex-direction: column;
			gap: 0.3rem;
		}

		.config-controls {
			gap: 0.5rem;
		}

		.label {
			font-size: 1.5em;
		}

		input[type="range"] {
			width: 150px;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 0.2em;
			gap: 0.2em;
		}

		.config-panel {
			min-height: 4rem;
			padding: 0.2rem;
		}

		.config-controls {
			gap: 0.3rem;
		}

		.label {
			font-size: 1.2em;
		}

		input[type="range"] {
			width: 120px;
		}
	}

	/* Prevent text selection on the entire app to avoid interference with painting/selection */
	* {
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}

	/* Allow text selection only for input elements and text areas */
	:global(input), :global(textarea), :global(select) {
		user-select: text;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
	}
</style>