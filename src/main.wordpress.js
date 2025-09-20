import App from './App.svelte';

// WordPress integration - support multiple instances on same page
const instances = new Map();

function init(containerId) {
	const container = document.getElementById(containerId);

	if (!container) {
		console.error(`Beads Designer: Container with ID "${containerId}" not found`);
		return;
	}

	// Check if already initialized
	if (instances.has(containerId)) {
		console.warn(`Beads Designer: Container "${containerId}" already initialized`);
		return;
	}

	// Get configuration from data attributes
	const gridSize = parseInt(container.dataset.gridSize) || 20;
	const stitchType = container.dataset.stitchType || 'peyote';
	const layoutRotation = parseInt(container.dataset.layoutRotation) || 90;

	// Create the Svelte app instance
	const app = new App({
		target: container,
		props: {
			gridSize: gridSize,
			stitchType: stitchType,
			layoutRotation: layoutRotation
		}
	});

	// Store the instance
	instances.set(containerId, app);

	return app;
}

function destroy(containerId) {
	const app = instances.get(containerId);
	if (app) {
		app.$destroy();
		instances.delete(containerId);
	}
}

function destroyAll() {
	instances.forEach(app => app.$destroy());
	instances.clear();
}

// Auto-initialize if there's a single default container
if (typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', () => {
		// Look for containers that haven't been explicitly initialized
		const containers = document.querySelectorAll('.beads-pattern-designer-container');
		containers.forEach(container => {
			if (container.id && !instances.has(container.id)) {
				// Auto-init will be handled by inline script from shortcode
				// This is just a fallback for direct HTML usage
			}
		});
	});
}

// Export for WordPress integration
const BeadApp = {
	init,
	destroy,
	destroyAll,
	instances
};

// Make it available globally for WordPress
if (typeof window !== 'undefined') {
	window.BeadApp = BeadApp;
}

export default BeadApp;