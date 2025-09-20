# Beads Pattern Designer WordPress Plugin

Interactive bead pattern designer for creating peyote, brick, and square stitch patterns.

## Installation

1. Build the plugin assets:
   ```bash
   npm install
   npm run build:wordpress
   ```

2. Copy the entire `wordpress` folder to your WordPress plugins directory:
   ```
   wp-content/plugins/beads-pattern-designer/
   ```

3. Activate the plugin in WordPress Admin.

## Usage

Add the bead pattern designer to any page or post using the shortcode:

```
[beads-designer]
```

### Shortcode Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `width` | `100%` | Container width (CSS value) |
| `height` | `600px` | Container height (CSS value) |
| `grid-size` | `20` | Initial grid size (number of beads) |
| `stitch-type` | `peyote` | Stitch type: `peyote`, `brick`, or `square` |
| `layout-rotation` | `90` | Layout rotation: `0`, `90`, `180`, or `270` |

### Examples

Basic usage:
```
[beads-designer]
```

Custom size and stitch type:
```
[beads-designer width="800px" height="500px" stitch-type="brick"]
```

Large grid for detailed patterns:
```
[beads-designer grid-size="40" height="800px"]
```

## Development

For development with hot reload:
```bash
npm run dev:wordpress
```

This will watch for changes and rebuild automatically.

## Features

- **Multiple Stitch Types**: Peyote, brick, and square stitch patterns
- **Color Palette**: Customizable colors with symbols for pattern printing
- **Drawing Tools**: Paint, eraser, selection, and grid tools
- **Undo/Redo**: Full history support
- **Zoom & Pan**: Navigate large patterns easily
- **Row Numbers**: Optional row numbering for following patterns
- **Color Legend**: Track color usage with bead counts
- **Responsive Design**: Works on desktop and mobile devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

GPL v2 or later