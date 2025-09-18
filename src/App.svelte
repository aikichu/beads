<script>
	import Logo from './Logo.svelte'
	import ToolPanel from './ToolPanel.svelte'
	import Workspace from './Workspace.svelte'
	import Canvas from './Canvas.svelte'
	import ColorLegend from './ColorLegend.svelte'
	import RowNumbers from './RowNumbers.svelte'

	let gridSize = 20
	let layoutRotation = 90
	let stitchType = 'peyote' // 'peyote' for vertical, 'brick' for horizontal, 'square' for grid
	// Always in painting mode now
	$: painting = true
</script>

<main class="painting">
	<Logo />
	<Workspace>
		<div class="canvas-area">
			<Canvas {...{gridSize, layoutRotation, stitchType}} />
			<ToolPanel bind:gridSize bind:stitchType bind:layoutRotation />
		</div>
		<div class="legend-area">
			<ColorLegend />
			<RowNumbers />
		</div>
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
		grid-template-areas: 
			"logo . ."
			"workspace workspace workspace";
	}


	.canvas-area {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.legend-area {
		display: flex;
		flex-direction: row;
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

	@media (max-width: 1200px) {
		.legend-area {
			flex-direction: column;
		}
	}

	@media (max-width: 1024px) {
		main {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
			gap: 0.5em;
			grid-template-areas: 
				"logo"
				"workspace";
		}

		.canvas-area {
			flex-direction: column;
			gap: 0.5rem;
		}

		.legend-area {
			margin-top: 0.5rem;
			align-self: stretch;
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		main {
			grid-template-rows: auto 1fr;
			gap: 0.3em;
			padding: 0.3em;
		}

		.canvas-area {
			flex-direction: column;
			gap: 0.3rem;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: 0.2em;
			gap: 0.2em;
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