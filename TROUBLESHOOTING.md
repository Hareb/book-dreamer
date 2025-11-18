# 🔧 Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### npm install fails

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Don't use sudo! Instead, fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to ~/.bashrc or ~/.zshrc:
export PATH=~/.npm-global/bin:$PATH
```

**Error**: `node-gyp rebuild failed`

**Solution**:
```bash
# macOS
xcode-select --install

# Windows
npm install --global windows-build-tools

# Linux (Ubuntu/Debian)
sudo apt-get install build-essential
```

### Electron installation fails

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Runtime Issues

### App won't start - "Electron not found"

**Check**:
```bash
# Verify electron is installed
npm list electron
```

**Solution**:
```bash
npm install electron --save-dev
```

### White screen on launch

**Possible causes**:
1. Vite dev server not running
2. Port 5173 blocked
3. JavaScript error

**Debug steps**:
```bash
# 1. Open DevTools (Ctrl+Shift+I)
# 2. Check Console for errors
# 3. Check Network tab for failed requests
# 4. Try web mode: npm run dev:vite
```

### "Cannot read properties of undefined (reading 'electron')"

**Cause**: Running in web mode without mock Electron API

**Solution**: Already fixed in the code. If you still see this:
1. Make sure `src/utils/mockElectron.ts` exists
2. Check `src/main.tsx` imports and calls `initMockElectronIfNeeded()`
3. Restart dev server

### Port 5173 already in use

**Find and kill the process**:

```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or change the port in vite.config.ts:
server: {
  port: 5174, // Use different port
}
```

## File Operations

### "File selection is only available in the Electron app"

**Cause**: Running in web mode (`npm run dev:vite`)

**Solution**: Use full Electron mode:
```bash
npm run dev
```

### EPUB won't open - "Failed to parse book"

**Possible causes**:
1. Corrupted EPUB file
2. DRM-protected file
3. Invalid EPUB format

**Debug**:
```bash
# Try opening the EPUB in another reader (Calibre, etc.)
# Check file size (should be > 0 bytes)
# Try a different EPUB file
```

**Valid test EPUBs**:
- [Standard Ebooks](https://standardebooks.org/) - Free, DRM-free classics
- [Project Gutenberg](https://www.gutenberg.org/) - Select EPUB with images

### Cache errors - "Cannot save to cache"

**Check**:
```bash
# macOS
~/Library/Application Support/book-dreamer/image-cache/

# Windows
%APPDATA%/book-dreamer/image-cache/

# Linux
~/.config/book-dreamer/image-cache/
```

**Solution**:
```bash
# Clear cache from app Settings
# Or manually delete the folder above
```

## API Issues

### "Invalid API key" errors

**Anthropic**:
- Key should start with `sk-ant-`
- Check at https://console.anthropic.com/settings/keys
- Make sure billing is set up

**Replicate**:
- Token should start with `r8_`
- Check at https://replicate.com/account/api-tokens
- Verify account has billing info

**Quick test**:
```bash
# Test Anthropic key
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'

# Test Replicate token
curl -s -H "Authorization: Token YOUR_TOKEN" \
  https://api.replicate.com/v1/models
```

### Image generation fails

**Error**: `429 Too Many Requests`
- **Cause**: Rate limiting
- **Solution**: Wait a few seconds and try again

**Error**: `402 Payment Required`
- **Cause**: No billing info or insufficient credits
- **Solution**: Add payment method in Replicate dashboard

**Error**: `Image generation timeout`
- **Cause**: Replicate is overloaded
- **Solution**:
  - Retry after 30 seconds
  - Check [Replicate status](https://status.replicate.com/)

### Slow image generation

**Normal behavior**:
- First generation: 20-30 seconds (cold start)
- Subsequent: 10-20 seconds
- Cached images: Instant

**If consistently >60 seconds**:
- Check Replicate dashboard for issues
- Try a different time of day
- Consider pre-generation settings

## Build Issues

### TypeScript errors

**Error**: `Cannot find module 'epubjs'`

**Solution**:
```bash
# Make sure type definitions exist
ls src/epubjs.d.ts

# If missing, the file should be in the repo
# Re-clone or check git status
```

**Error**: `Property 'electron' does not exist on type 'Window'`

**Solution**:
```bash
# Check src/types.ts has the declaration
# Make sure tsconfig.json includes src/
```

### Build fails - "dist folder not found"

**Solution**:
```bash
# Clean build
rm -rf dist release node_modules
npm install
npm run build
```

### Electron builder fails

**Error**: `Cannot find electron binary`

**Solution**:
```bash
npm run postinstall
# Or manually:
cd node_modules/electron && node install.js
```

## Performance Issues

### App is slow/laggy

**Possible causes**:
1. Too many images cached
2. Large EPUB files
3. Multiple generations running
4. Dev tools open

**Solutions**:
```bash
# 1. Clear cache from Settings
# 2. Close DevTools (Ctrl+Shift+I)
# 3. Disable pre-generation in Settings
# 4. Use smaller EPUB files for testing
```

### High memory usage

**Normal**: 200-400 MB
**High**: >1 GB

**Solutions**:
- Close other apps
- Clear cache
- Restart the app
- Disable pre-generation

## Display Issues

### Images not showing

**Debug checklist**:
1. Check image was generated (look for green checkmark)
2. Check background opacity (increase in Settings)
3. Check DevTools Console for errors
4. Verify URL is valid (starts with https://)

**Solution**:
- Click "Regenerate" button
- Increase opacity to 50%+
- Check internet connection

### Text is unreadable over background

**Solution**:
- Increase background blur (Settings)
- Decrease opacity (Settings)
- Try different art style

### UI elements overlapping

**Cause**: Window too small

**Solution**:
- Resize window (minimum 800x600)
- Check responsive breakpoints in browser DevTools

## Other Issues

### Keyboard shortcuts not working

**Check**:
1. Click inside the app first (focus)
2. No modal is open (Settings, etc.)
3. Keyboard help shows correct shortcuts (⌨️ icon)

**Conflicts**:
- Some shortcuts may conflict with OS or browser
- Try in Electron mode, not web browser

### Recent books not appearing

**Check**:
```bash
# Open DevTools Console
localStorage.getItem('bookdreamer_recent_books')
# Should return JSON array
```

**Solution**:
```bash
# Clear and re-add
localStorage.removeItem('bookdreamer_recent_books')
# Then open a book again
```

### Settings not saving

**Check**:
```bash
# Open DevTools Console
localStorage.getItem('bookdreamer_settings')
# Should return JSON object
```

**Solution**:
```bash
# Check browser/Electron allows localStorage
# Try clearing: localStorage.clear()
# Reconfigure in Settings panel
```

## Getting Help

Still stuck? Here's how to get help:

1. **Check existing issues**: https://github.com/yourusername/book-dreamer/issues

2. **Create a new issue** with:
   - OS and version (Windows 11, macOS 14, Ubuntu 22.04, etc.)
   - Node version (`node --version`)
   - npm version (`npm --version`)
   - Error message (full text)
   - Steps to reproduce
   - Screenshots if applicable

3. **Include logs**:
   - DevTools Console output
   - Terminal output
   - Error stack traces

4. **Example good issue**:
   ```
   Title: Image generation fails with 402 error

   Environment:
   - OS: macOS 14.2
   - Node: v20.10.0
   - npm: 10.2.3

   Steps to reproduce:
   1. Open an EPUB book
   2. Click "Generate" on Chapter 1
   3. Wait 30 seconds
   4. Error appears: "Image generation failed: 402 Payment Required"

   Expected: Image should generate
   Actual: Error message

   Screenshot: [attached]
   Console logs: [attached]

   Additional context:
   - Replicate token is set correctly
   - Token works in curl test
   - Billing is set up in Replicate
   ```

## Quick Fixes Checklist

Before asking for help, try these:

- [ ] Restart the app
- [ ] Clear cache (Settings → Clear Cache)
- [ ] Clear browser localStorage
- [ ] Restart dev server (`Ctrl+C` → `npm run dev`)
- [ ] Re-install dependencies (`rm -rf node_modules && npm install`)
- [ ] Update to latest code (`git pull`)
- [ ] Check API keys are correct
- [ ] Try a different EPUB file
- [ ] Check internet connection
- [ ] Review console for errors
- [ ] Test in web mode (`npm run dev:vite`)

---

Most issues can be solved with the solutions above. For bugs, please report them on GitHub!
