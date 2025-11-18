# 🧪 Testing Guide

Complete testing guide for BookDreamer.

## ✅ Pre-Installation Checklist

Before starting, verify you have:
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] At least 500MB free disk space
- [ ] Internet connection (for dependencies and API calls)
- [ ] Anthropic API key (for Claude AI)
- [ ] Replicate API token (for image generation)

## 🚀 Quick Installation Test

Run the automated test script:

```bash
chmod +x test-install.sh
./test-install.sh
```

This will:
1. Check Node.js and npm versions
2. Install all dependencies
3. Verify project structure
4. Run TypeScript type check
5. Run linting
6. Build the project
7. Verify build artifacts

Expected output: All tests should pass ✅

## 📝 Manual Testing Steps

### 1. Installation

```bash
# Clone repository (if not already done)
git clone https://github.com/yourusername/book-dreamer.git
cd book-dreamer

# Install dependencies
npm install
```

**Expected**: No errors, ~500MB downloaded, node_modules/ created

**Troubleshooting**:
- If `npm install` fails: Try `npm cache clean --force` then retry
- If Electron fails to download: Check internet connection, try again

### 2. TypeScript Check

```bash
npm run type-check
```

**Expected**: No TypeScript errors

**If errors appear**:
- Make sure `node_modules/` exists
- Try `rm -rf node_modules && npm install`
- Check that all `.d.ts` files are present in `src/`

### 3. Lint Check

```bash
npm run lint
```

**Expected**: No linting errors or warnings

### 4. Build Test (Web)

```bash
npm run build:vite
```

**Expected**:
- Build completes successfully
- `dist/` folder created
- `dist/index.html` exists
- `dist/assets/` contains JS and CSS files

### 5. Run in Web Mode

```bash
npm run dev:vite
```

**Expected**:
- Vite dev server starts on http://localhost:5173
- Browser opens automatically (or open manually)
- Welcome screen displays
- No console errors

**Test**:
- ✅ UI loads correctly
- ✅ Welcome screen visible
- ✅ Settings button clickable
- ✅ No JavaScript errors in console
- ⚠️  "Open Book" will show alert (expected - no Electron in web mode)

### 6. Run Full Electron App

```bash
npm run dev
```

**Expected**:
- Vite dev server starts
- Electron window opens after ~5-10 seconds
- Welcome screen displays
- DevTools open (development mode)

**Test Welcome Screen**:
- ✅ Welcome message displays
- ✅ API key warning shows (if not configured)
- ✅ "Open Book" button visible
- ✅ "Configure Settings" button works

### 7. Configure API Keys

1. Click **Settings** button (⚙️ icon)
2. Paste your Anthropic API key
3. Paste your Replicate API token
4. Click "Show API Keys" to verify
5. Click **Save Settings**

**Expected**:
- Settings save without error
- Warning disappears from Welcome screen
- Settings persist after closing Settings panel

### 8. Test Book Opening (with EPUB)

You'll need a test EPUB file. Get one from:
- [Standard Ebooks](https://standardebooks.org/) (free, DRM-free)
- [Project Gutenberg](https://www.gutenberg.org/) - Select "EPUB (with images)"

**Test**:
1. Click **Open Book**
2. Select an EPUB file
3. Book should load

**Expected**:
- Book loads within 2-5 seconds
- Chapter list appears in sidebar (click ☰)
- First chapter displays
- Book title shows in header

**If book doesn't load**:
- Try a different EPUB (some may be corrupted)
- Check console for errors
- Ensure EPUB is not DRM-protected

### 9. Test Chapter Navigation

**Test**:
- Click **Next** button → Should go to chapter 2
- Click **Previous** button → Should return to chapter 1
- Press `→` key → Should go forward
- Press `←` key → Should go backward
- Click ☰ icon → Chapter list should appear
- Click a chapter in list → Should jump to that chapter

**Expected**: All navigation works smoothly

### 10. Test Image Generation

**Test**:
1. On any chapter, click **Generate** button
2. Wait 20-30 seconds

**Expected**:
- Progress indicator shows "Analyzing chapter..."
- Then shows "Generating image..."
- After 20-30 seconds, background image appears
- Green checkmark shows "Illustrated"

**If generation fails**:
- Check console for error messages
- Verify API keys are correct
- Check Anthropic/Replicate dashboards for API status
- Ensure you have billing set up on both platforms

### 11. Test Auto-Generation

**Test**:
1. Go to Settings
2. Ensure "Auto-generate" is enabled (default)
3. Set "Pre-generate" to 2 chapters
4. Open a new book or go to a new chapter

**Expected**:
- Image generates automatically for current chapter
- Progress shows "Generating... (1/3)" for upcoming chapters
- After a few minutes, next 2 chapters also have images

### 12. Test Image Caching

**Test**:
1. Generate an image for Chapter 1
2. Navigate away to Chapter 2
3. Navigate back to Chapter 1

**Expected**:
- Image loads INSTANTLY (cached)
- Shows "Cached" instead of "Generated"
- No API calls made

### 13. Test Settings Panel

**Test each setting**:

**Image Style**:
- Switch between Realistic, Artistic, Minimalist
- Regenerate same chapter
- Should see different art styles

**Background Opacity**:
- Adjust slider from 0% to 100%
- Background should become more/less visible

**Background Blur**:
- Adjust from 0px to 20px
- Background should become more/less blurred

**Pre-generate chapters**:
- Set to 0 → No pre-generation
- Set to 5 → Pre-generates next 5 chapters

### 14. Test Cache Management

**Test**:
1. Generate a few images
2. Go to Settings → Cache section
3. Should show cache statistics:
   - Cached Images: 3 (or however many you generated)
   - Total Size: X KB/MB
   - Location: (path to cache)
4. Click "Clear All Cache"
5. Confirm
6. Stats should reset to 0

### 15. Test Recent Books

**Test**:
1. Open multiple EPUB files (3-4)
2. Close app
3. Reopen app
4. Recent Books section should show all opened books
5. Click a recent book → Should reopen it

### 16. Test Keyboard Shortcuts

Press the ⌨️ icon to see shortcuts, then test:
- `→` → Next chapter ✅
- `←` → Previous chapter ✅
- `Ctrl+G` → Generate/regenerate image ✅
- `Ctrl+M` → Toggle chapter list ✅
- `Ctrl+,` → Open settings ✅

### 17. Test Error Handling

**Test deliberate errors**:

**Bad API key**:
1. Go to Settings
2. Change Anthropic key to `sk-ant-FAKE`
3. Try to generate image
4. Should show error message (not crash)

**Network offline**:
1. Disconnect internet
2. Try to generate image
3. Should show network error

**Corrupted EPUB**:
1. Try to open a non-EPUB file
2. Should show error (not crash)

### 18. Test Performance

**Monitor**:
- Memory usage (should be 200-500MB)
- CPU usage (low when idle)
- Image generation time (20-30s)
- Chapter navigation (instant)

**If slow**:
- Close DevTools
- Reduce pre-generation setting
- Clear cache if very large

### 19. Production Build Test

```bash
npm run build
```

**Expected**:
- Vite build completes
- Electron-builder creates packages in `release/`
- File sizes:
  - macOS .dmg: ~150-250MB
  - Windows .exe: ~120-180MB
  - Linux .AppImage: ~150-200MB

**Test the built app**:
1. Open the packaged app (in `release/`)
2. Should work exactly like development mode
3. No DevTools by default
4. All features functional

## ✅ Final Checklist

After testing, verify:
- [ ] App installs without errors
- [ ] TypeScript compiles successfully
- [ ] App runs in web mode
- [ ] App runs in Electron mode
- [ ] Books can be opened
- [ ] Chapters can be navigated
- [ ] Images can be generated
- [ ] Images are cached properly
- [ ] Settings save and load
- [ ] Keyboard shortcuts work
- [ ] Recent books appear
- [ ] Cache can be cleared
- [ ] Error handling works
- [ ] Production build succeeds

## 🐛 Common Issues

### "Cannot find module 'react'"
**Fix**: `npm install`

### "Port 5173 already in use"
**Fix**: `lsof -ti:5173 | xargs kill -9` (Mac/Linux)

### "Image generation failed: 402"
**Fix**: Add billing info to Replicate account

### "Invalid API key"
**Fix**: Verify keys in Anthropic/Replicate dashboards

### EPUB won't open
**Fix**: Try a different EPUB file (DRM-free only)

### Electron window doesn't appear
**Fix**: Check terminal for errors, ensure port 5173 is free

## 📊 Test Results Template

Use this to document your testing:

```
BookDreamer Test Results
========================
Date: ___________
Tester: ___________
OS: ___________
Node: ___________
npm: ___________

Installation
- [ ] npm install: PASS / FAIL
- [ ] Type check: PASS / FAIL
- [ ] Lint check: PASS / FAIL
- [ ] Vite build: PASS / FAIL

Functionality
- [ ] Web mode: PASS / FAIL
- [ ] Electron mode: PASS / FAIL
- [ ] Open EPUB: PASS / FAIL
- [ ] Navigation: PASS / FAIL
- [ ] Image generation: PASS / FAIL
- [ ] Caching: PASS / FAIL
- [ ] Settings: PASS / FAIL
- [ ] Keyboard shortcuts: PASS / FAIL

Performance
- Memory usage: _____ MB
- Image gen time: _____ seconds
- Build size: _____ MB

Issues Found:
1.
2.
3.

Overall Status: PASS / FAIL
```

## 🎯 Next Steps

After successful testing:
1. Report any bugs on GitHub Issues
2. Share feedback and suggestions
3. Try different EPUBs and genres
4. Experiment with different art styles
5. Help improve documentation

---

Happy Testing! 🧪✨
