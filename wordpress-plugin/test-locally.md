# 🧪 Bead Pattern Designer Local Testing Guide

## Method 1: Simple HTML Test (Recommended)

### How to Run
```bash
# 1. Navigate to test directory
cd wordpress-plugin

# 2. Start simple HTTP server (Python 3)
python3 -m http.server 8000

# Or use Node.js
npx serve .

# Or use PHP
php -S localhost:8000
```

### Access in Browser
```
http://localhost:8000/test-environment.html
```

### Test Items
- ✅ XSS attack blocking test
- ✅ CSP header validation
- ✅ Rate limiting simulation
- ✅ Nonce token verification
- ✅ JavaScript obfuscation check
- ✅ CSS injection prevention test

---

## Method 2: Docker WordPress Environment Test

### 1. Check Docker Installation
```bash
docker --version
docker-compose --version
```

### 2. Start WordPress Container
```bash
cd wordpress-plugin
docker-compose up -d
```

### 3. Access WordPress
- WordPress: http://localhost:8080
- phpMyAdmin: http://localhost:8081

### 4. Initial Setup
1. Access http://localhost:8080
2. Complete WordPress installation wizard
3. Create admin account

### 5. Activate Plugin
1. Login to WordPress admin
2. Plugins → Installed Plugins
3. Activate "Bead Pattern Designer"

### 6. Test
1. Pages → Add New
2. Add `[bead-pattern]` to content
3. Publish and verify

### 7. Shutdown
```bash
docker-compose down
```

### 8. Complete Data Removal (Optional)
```bash
docker-compose down -v
```

---

## Method 3: Install to Existing WordPress

### 1. Compress Plugin
```bash
tar -czf bead-pattern-designer.tar.gz bead-pattern-designer/
```

### 2. WordPress Admin
1. Plugins → Add New → Upload Plugin
2. Select tar.gz file (or extract and recompress as ZIP)
3. Install and activate

---

## Security Test Checklist

### JavaScript Console Tests
```javascript
// 1. XSS Test
document.querySelector('#bpd-test1').innerHTML = '<img src=x onerror="alert(1)">';
// → Alert should NOT execute

// 2. Nonce Verification
console.log(window.bpdNonce);
// → Should output unique token

// 3. Obfuscation Check
console.log(BeadApp);
// → Should show obfuscated object

// 4. CSP Test
eval('alert("CSP Test")');
// → Should be blocked if CSP is strict
```

### Developer Tools Network Tab
1. Check bundle.js file size (~56KB)
2. Check bundle.css file size (~24KB)
3. Confirm no source maps

### Security Headers Check (Developer Tools)
1. Network tab → Select test-environment.html
2. Check Response Headers
3. Verify security-related headers exist

---

## Troubleshooting

### Docker Execution Errors
```bash
# Permission issues
sudo docker-compose up -d

# Port conflicts
# Change ports in docker-compose.yml
# 8080 → 8082, 8081 → 8083, etc.
```

### Plugin Not Visible
1. Check file permissions
```bash
chmod -R 755 bead-pattern-designer/
```

2. Verify plugin folder structure
```
bead-pattern-designer/
├── bead-pattern-designer.php  # Required!
├── assets/
│   ├── bundle.js
│   └── bundle.css
└── includes/
    └── security.php
```

### JavaScript Errors
1. Check browser console
2. Verify bundle.js file loading
3. Check Svelte app initialization

---

## Performance Benchmarks

### Metrics
- Initial load time: < 500ms
- Time to interactive: < 1s
- Memory usage: < 50MB
- CPU usage: < 10%

### Measurement Tools
- Chrome DevTools → Performance
- Lighthouse (Chrome extension)
- GTmetrix (online)