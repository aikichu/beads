# Bead Pattern Designer WordPress Plugin Installation Guide

## Installation Methods

### 1. Plugin File Structure
```bash
# Already prepared
wordpress-plugin/bead-pattern-designer/
├── bead-pattern-designer.php  # Main plugin file
├── readme.txt                  # WordPress plugin info
├── index.php                   # Security file
└── assets/
    ├── bundle.js               # Obfuscated JavaScript
    ├── bundle.css              # Stylesheet
    └── index.php               # Security file
```

### 2. Upload to WordPress

#### Method A: Using FTP
1. Connect to WordPress server via FTP
2. Navigate to `/wp-content/plugins/` directory
3. Upload entire `bead-pattern-designer` folder

#### Method B: ZIP Installation
1. Compress `bead-pattern-designer` folder to ZIP
2. WordPress Admin > Plugins > Add New
3. Click "Upload Plugin"
4. Select ZIP file and install

### 3. Activate Plugin
1. WordPress Admin > Plugins
2. Find "Bead Pattern Designer"
3. Click "Activate"

## Usage

### Add to Page/Post
```
[bead-pattern]
```

### Options
```
[bead-pattern width="100%" height="600px"]
[bead-pattern class="my-custom-style"]
```

### Admin Menu
- Test available at WordPress Admin > Bead Pattern menu

## Security Enhancements

✅ **Code Obfuscation**
- JavaScript minification with Terser
- Console.log removal
- Property obfuscation
- Comment removal
- Source map removal (production)

✅ **Directory Protection**
- Direct access blocking with index.php files

✅ **Plugin Security**
- ABSPATH check
- Nonce verification ready
- Escape functions used

## Update Process

1. After modifying source code:
```bash
npm run build
```

2. Copy new build files to plugin directory:
```bash
cp public/build/bundle.* wordpress-plugin/bead-pattern-designer/assets/
```

3. Upload to WordPress server

## Troubleshooting

### Plugin Not Working
1. Check browser console for errors
2. Enable WordPress debug mode
3. Verify PHP version (7.2+ required)

### Style Issues
1. Check for CSS conflicts with theme
2. Isolate styles with custom classes