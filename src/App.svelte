<script>
	import Logo from './Logo.svelte'
	import ConfigPanel from './ConfigPanel.svelte'
	import PaintingToolbox from './PaintingToolbox.svelte'
	import ToolPanel from './ToolPanel.svelte'
	import Workspace from './Workspace.svelte'
	import Canvas from './Canvas.svelte'
	import ColorLegend from './ColorLegend.svelte'

	import { step } from './stores.js'

	let gridSize = 20
	let layoutRotation = 90
	let stitchType = 'peyote' // 'peyote' for vertical, 'brick' for horizontal, 'square' for grid
	let togglePanMode = () => {}
	let panMode = false
	$: painting = $step === 'painting'
	$: configuring = $step === 'configuring'
</script>

<main class:painting class:configuring>
	<Logo />
	<ConfigPanel bind:gridSize bind:layoutRotation bind:stitchType />
	{#if painting}
		<PaintingToolbox />
	{/if}

	<Workspace>
		<div class="canvas-area">
			<Canvas bind:togglePanMode bind:panMode {...{gridSize, layoutRotation, stitchType}} />
			{#if painting}
				<ToolPanel bind:togglePanMode bind:panMode {gridSize} {stitchType} {layoutRotation} />
			{/if}
		</div>
		{#if painting}
			<div class="color-legend-area">
				<ColorLegend />
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
		grid-template-columns: 15rem 10rem 1fr 12rem;
		grid-template-rows: 7rem 1fr;
		gap: 0.5em 0.5em;
	}

	.painting {
		grid-template-areas: 
			"logo config-panel painting-toolbox ."
			"workspace workspace workspace workspace";
	}

	.configuring {
		grid-template-areas: 
			"logo config-panel config-panel ."
			"workspace workspace workspace .";
	}

	.canvas-area {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.color-legend-area {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 1rem;
	}

	/* Responsive design for narrow screens */
	@media (max-width: 1200px) {
		main {
			grid-template-columns: 12rem 8rem 1fr 10rem;
			gap: 0.3em 0.3em;
		}
	}

	@media (max-width: 1024px) {
		main {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto 1fr;
			gap: 0.5em;
		}

		.painting {
			grid-template-areas: 
				"logo"
				"config-panel"
				"painting-toolbox"
				"workspace";
		}

		.configuring {
			grid-template-areas: 
				"logo"
				"config-panel"
				"workspace";
		}

		.canvas-area {
			flex-direction: column;
			gap: 0.5rem;
		}

		.color-legend-area {
			margin-top: 0.5rem;
			align-self: stretch;
		}
	}

	@media (max-width: 768px) {
		main {
			grid-template-rows: auto auto auto 1fr;
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