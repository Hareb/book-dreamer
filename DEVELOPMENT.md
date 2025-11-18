# 🛠️ Development Guide

Complete guide for developers working on BookDreamer.

## 📋 Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+ or **yarn** v1.22+
- **Git**
- A code editor (VS Code recommended)

## 🚀 Initial Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/book-dreamer.git
cd book-dreamer
npm install
```

This will install all dependencies and run `postinstall` scripts for Electron.

### 2. Get API Keys

Create accounts and get your API keys:

**Anthropic (Claude AI)**
- Go to: https://console.anthropic.com/
- Sign up and navigate to API Keys
- Create a new key (starts with `sk-ant-`)
- Cost: ~$0.001-0.005 per chapter analysis

**Replicate (Stable Diffusion)**
- Go to: https://replicate.com/
- Sign up and go to Account > API Tokens
- Create a new token (starts with `r8_`)
- Cost: ~$0.002-0.02 per image

### 3. Configure for Development

API keys are stored in browser localStorage (configured in the app Settings panel).

For convenience during development, you can also set environment variables:

```bash
cp .env.example .env
# Edit .env and add your keys
```

Note: The app currently stores API keys in localStorage via the Settings UI, not from .env.

## 🏃 Running the App

### Development Mode

There are two ways to run the app during development:

**Option 1: Full Electron App (Recommended)**
```bash
npm run dev
```

This runs:
- Vite dev server on http://localhost:5173
- Electron app that loads from the dev server
- Hot reload for React components
- DevTools open by default

**Option 2: Web Only (UI Development)**
```bash
npm run dev:vite
```

Then open http://localhost:5173 in your browser.

This is useful for:
- UI development without Electron overhead
- Testing responsive layouts
- Faster iteration on styles
- Note: File selection won't work (mock Electron API is used)

### Building for Production

```bash
npm run build
```

This creates distributable packages in `release/`:
- **macOS**: `.dmg` file
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` file

Build artifacts are in `dist/` (renderer) and `release/` (packaged apps).

## 📁 Project Structure

```
book-dreamer/
├── src/                      # React application source
│   ├── components/           # React components
│   │   ├── Reader.tsx       # Main ebook reader
│   │   ├── Settings.tsx     # Settings panel
│   │   ├── Welcome.tsx      # Welcome screen
│   │   ├── RecentBooks.tsx  # Recent books list
│   │   └── ErrorBoundary.tsx # Error handling
│   ├── services/            # Business logic
│   │   ├── epubService.ts   # EPUB parsing (epub.js)
│   │   ├── aiService.ts     # Claude AI integration
│   │   ├── imageService.ts  # Stable Diffusion via Replicate
│   │   └── cacheService.ts  # Local image caching
│   ├── hooks/               # Custom React hooks
│   │   ├── useImageGeneration.ts    # Image generation queue
│   │   ├── useRecentBooks.ts        # Recent books history
│   │   └── useKeyboardShortcuts.ts  # Keyboard navigation
│   ├── utils/               # Utility functions
│   │   └── mockElectron.ts  # Mock Electron API for web mode
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   ├── types.ts             # TypeScript type definitions
│   └── epubjs.d.ts         # Type definitions for epub.js
├── electron.js              # Electron main process
├── preload.js               # Electron preload script (IPC bridge)
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── .gitignore               # Git ignore rules
```

## 🔧 Development Workflow

### Making Changes

1. **UI Changes**: Edit files in `src/components/`
   - Hot reload is active
   - Changes appear instantly

2. **Service Changes**: Edit files in `src/services/`
   - May require app restart
   - Test with actual API calls

3. **Electron Changes**: Edit `electron.js` or `preload.js`
   - Requires restart (`Ctrl+C` then `npm run dev`)
   - No hot reload for main process

### Testing

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Run in web mode to test UI
npm run dev:vite
```

### Debugging

**React DevTools**
- Automatically available in development mode
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

**Console Logging**
- All console.log/error/warn go to DevTools console
- Electron main process logs appear in terminal

**Breakpoints**
- Use DevTools debugger
- Set breakpoints in `.tsx` files
- Step through code execution

## 🎨 Adding Features

### Adding a New Component

1. Create file in `src/components/YourComponent.tsx`
2. Define props interface
3. Export default component
4. Import and use in parent component

Example:
```tsx
interface YourComponentProps {
  title: string;
  onClose: () => void;
}

export default function YourComponent({ title, onClose }: YourComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Adding a New Service

1. Create file in `src/services/yourService.ts`
2. Export a class with methods
3. Use in components via useState/useEffect

Example:
```typescript
export class YourService {
  async doSomething(): Promise<string> {
    // Implementation
    return 'result';
  }
}
```

### Adding an Electron IPC Channel

1. **Add handler in `electron.js`**:
```javascript
ipcMain.handle('your-channel', async (event, data) => {
  // Handle request
  return result;
});
```

2. **Add to `preload.js`**:
```javascript
contextBridge.exposeInMainWorld('electron', {
  // ...existing methods
  yourMethod: (data) => ipcRenderer.invoke('your-channel', data),
});
```

3. **Update types in `src/types.ts`**:
```typescript
interface Window {
  electron?: {
    // ...existing methods
    yourMethod: (data: any) => Promise<any>;
  };
}
```

## 🐛 Common Issues

### "Cannot find module 'electron'"

```bash
npm install electron --save-dev
```

### "Port 5173 is already in use"

```bash
# Kill the process using port 5173
# Linux/Mac:
lsof -ti:5173 | xargs kill -9
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### TypeScript errors in epubjs

Make sure `src/epubjs.d.ts` exists. If not:
```bash
# It should be in the repo, but you can recreate it
# Check the src/epubjs.d.ts file
```

### Build fails with "Cannot find dist"

```bash
# Clean and rebuild
rm -rf dist release
npm run build
```

### Electron window doesn't appear

Check terminal for errors. Common causes:
- Vite dev server not running (http://localhost:5173)
- Port 5173 blocked
- Electron version incompatibility

## 📦 Dependencies

### Production Dependencies
- `@anthropic-ai/sdk` - Claude AI client
- `replicate` - Stable Diffusion API client
- `epubjs` - EPUB file parsing
- `react` / `react-dom` - UI framework
- `lucide-react` - Icon library

### Development Dependencies
- `electron` - Desktop app framework
- `electron-builder` - Package and distribute
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `eslint` - Code linting

## 🔐 Security Notes

- API keys stored in browser localStorage
- Electron uses `contextIsolation: true`
- `nodeIntegration: false` for security
- IPC communication via preload script only

## 📝 Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Keep components small and focused
- Comment complex logic
- Use meaningful variable names

## 🚢 Release Process

1. **Update version** in `package.json`
2. **Build**: `npm run build`
3. **Test** the built apps in `release/`
4. **Tag release**: `git tag v0.1.0`
5. **Push**: `git push --tags`
6. **Upload** binaries to GitHub releases

## 💡 Tips

- Use the web mode (`npm run dev:vite`) for faster UI iteration
- Test with small EPUB files first
- Monitor API costs in Anthropic/Replicate dashboards
- Clear cache often during development to test generation
- Use React DevTools to inspect component state

## 📚 Resources

- [Electron Docs](https://www.electronjs.org/docs/latest)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [epub.js Docs](https://github.com/futurepress/epub.js/)
- [Anthropic API](https://docs.anthropic.com/)
- [Replicate API](https://replicate.com/docs)

---

Happy coding! If you have questions, check existing issues or create a new one.
