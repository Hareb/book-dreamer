# 📚 BookDreamer - AI-Illustrated Ebook Reader

An innovative ebook reader that automatically generates beautiful, contextual illustrations as you read using AI. Transform your reading experience with immersive visuals that bring your books to life.

![BookDreamer Demo](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=BookDreamer+Demo)

## ✨ Features

- **📖 EPUB Support**: Read any EPUB ebook with a clean, distraction-free interface
- **🎨 AI-Generated Illustrations**: Automatically creates contextual background images for each chapter using Stable Diffusion
- **🧠 Smart Scene Extraction**: Uses Claude AI to analyze text and identify the best scenes to illustrate
- **💾 Intelligent Caching**: Generated images are cached locally to save costs and improve performance
- **🎯 Pre-Generation Queue**: Automatically generates images for upcoming chapters while you read
- **🎨 Multiple Art Styles**: Choose between Realistic, Artistic, or Minimalist illustration styles
- **⚙️ Customizable Display**: Adjust background opacity and blur to your preference
- **⌨️ Keyboard Shortcuts**: Navigate efficiently with keyboard controls
- **📚 Recent Books**: Quick access to recently opened books
- **🔄 Cross-Platform**: Works on Windows, macOS, and Linux

## 🎯 Use Cases

- **Fantasy/Sci-Fi Novels**: Visualize the worlds, creatures, and scenes described in your favorite books
- **Young Readers**: Enhanced engagement through visual storytelling
- **Language Learning**: Contextual images help understand foreign language texts
- **Book Clubs**: Share generated illustrations to discuss interpretations
- **Authors/Writers**: Visualize scenes from manuscripts

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Anthropic API Key** (for Claude AI)
- **Replicate API Token** (for image generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/book-dreamer.git
   cd book-dreamer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**

   The app stores API keys locally in browser storage for security. You'll configure them in the Settings panel on first launch.

   **Getting your API keys:**
   - **Anthropic (Claude)**: Sign up at [console.anthropic.com](https://console.anthropic.com/)
   - **Replicate**: Get your token at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

### Running the App

**Development mode:**
```bash
npm run dev
```

This will start both the Vite dev server and Electron. The app will open automatically.

**Build for production:**
```bash
npm run build
```

This creates distributable packages in the `release/` directory.

## 💰 Cost Estimation

BookDreamer uses cloud AI APIs, which have associated costs:

| Service | Cost per Image | Average Book (20 chapters) |
|---------|---------------|---------------------------|
| Claude API (Scene Analysis) | ~$0.001-0.005 | $0.02-0.10 |
| Stable Diffusion (Image Gen) | ~$0.002-0.02 | $0.04-0.40 |
| **Total per book** | | **~$0.06-0.50** |

**Cost-saving features:**
- ✅ Images are cached locally - you only pay once per chapter
- ✅ Pre-generation is optional and configurable
- ✅ You can regenerate specific chapters only
- ✅ Shared cache means popular books cost less over time

**Example usage:**
- Reading 10 books/month @ $0.25 average = **~$2.50/month**
- Light usage (3-4 books/month) = **~$1/month**

## 📖 How to Use

### Opening a Book

1. Click **"Open Book"** in the header
2. Select an EPUB file from your computer
3. The book will load and appear in your Recent Books

### Generating Illustrations

**Automatic (Recommended):**
- Enable "Auto-generate" in Settings
- Images generate automatically as you read

**Manual:**
- Click the "Generate" button in the reader header
- Or press `Ctrl+G` (keyboard shortcut)

### Navigation

**Mouse:**
- Use Previous/Next buttons at the bottom
- Click chapter list icon (☰) to jump to specific chapters

**Keyboard:**
- `→` Next chapter
- `←` Previous chapter
- `Ctrl+M` Toggle chapter list
- `Ctrl+G` Generate/regenerate image
- `Ctrl+,` Open settings

### Customization

Open **Settings** to customize:

- **Image Style**: Realistic, Artistic, or Minimalist
- **Background Opacity**: How visible the background image is
- **Background Blur**: Blur amount for better text readability
- **Auto-generate**: Enable/disable automatic generation
- **Pre-generate Chapters**: How many upcoming chapters to generate (0-5)

## 🏗️ Architecture

```
book-dreamer/
├── src/
│   ├── components/         # React components
│   │   ├── Reader.tsx     # Main reading interface
│   │   ├── Settings.tsx   # Settings panel
│   │   ├── Welcome.tsx    # Welcome screen
│   │   └── ...
│   ├── services/          # Business logic
│   │   ├── epubService.ts     # EPUB parsing
│   │   ├── aiService.ts       # Claude API integration
│   │   ├── imageService.ts    # Replicate/SD integration
│   │   └── cacheService.ts    # Local caching
│   ├── hooks/             # Custom React hooks
│   │   ├── useImageGeneration.ts  # Queue management
│   │   ├── useRecentBooks.ts      # Recent books
│   │   └── useKeyboardShortcuts.ts
│   └── types.ts           # TypeScript types
├── electron.js            # Electron main process
├── preload.js            # Electron preload script
└── package.json
```

**Tech Stack:**
- **Electron** - Cross-platform desktop app
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **epub.js** - EPUB parsing
- **Anthropic SDK** - Claude AI
- **Replicate SDK** - Stable Diffusion

## 🎨 How It Works

1. **EPUB Parsing**: The app parses your EPUB file and extracts chapters
2. **Scene Analysis**: When you open a chapter, Claude AI analyzes the text to identify the main visual scene
3. **Prompt Generation**: Claude creates a detailed image prompt optimized for Stable Diffusion
4. **Image Generation**: Stable Diffusion generates a high-quality image (1024x768)
5. **Caching**: The image is cached locally for instant loading next time
6. **Display**: The image is shown as a customizable background while you read

## 🔧 Development

### Project Structure

- `src/main.tsx` - React entry point
- `src/App.tsx` - Main application component
- `electron.js` - Electron main process
- `preload.js` - Electron preload (IPC bridge)

### Adding Features

The app is modular and easy to extend:

**Adding a new image style:**
1. Update `ImageStyle` type in `src/types.ts`
2. Add style prompt in `aiService.ts`
3. Update Settings UI

**Adding a new AI provider:**
1. Create a new service (e.g., `openaiService.ts`)
2. Implement the same interface as `aiService.ts`
3. Add toggle in Settings

### Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

## 🐛 Troubleshooting

### Images not generating

1. **Check API keys**: Ensure your keys are correctly entered in Settings
2. **Check console**: Open DevTools (Ctrl+Shift+I) and check for errors
3. **Try manual generation**: Click "Generate" button instead of auto-generate

### "File not found" error

- The EPUB file may be corrupted
- Try opening a different EPUB file
- Make sure the file is a valid EPUB format

### Slow image generation

- Normal: Image generation takes 20-30 seconds per image
- Enable pre-generation to prepare images in advance
- Use cached images (they load instantly)

### High API costs

- Disable pre-generation in Settings
- Set pre-generate chapters to 0 or 1
- Only generate for chapters you're actively reading
- Remember: cached images are free on subsequent reads

## 📝 Roadmap

- [ ] **Local AI support** - Run Stable Diffusion locally (no API costs)
- [ ] **Character consistency** - Track characters across chapters
- [ ] **Multiple images per chapter** - Illustrate key scenes
- [ ] **Community sharing** - Share/download illustrations for popular books
- [ ] **PDF support** - Read illustrated PDFs
- [ ] **Kindle integration** - Plugin for Kindle Cloud Reader
- [ ] **Mobile app** - iOS and Android versions
- [ ] **Custom models** - Fine-tuned models for specific genres
- [ ] **Animation** - Subtle animations between scenes
- [ ] **Voice narration** - AI voice reading with synchronized images

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚖️ Legal & Privacy

- **Copyright**: Generated images from copyrighted books are for personal use only
- **Privacy**: All data (books, images, settings) is stored locally on your device
- **API Keys**: Stored in browser localStorage, never sent anywhere except to respective APIs
- **No tracking**: BookDreamer doesn't collect any usage data or telemetry

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [epub.js](https://github.com/futurepress/epub.js/) - EPUB parsing library
- [Anthropic](https://anthropic.com/) - Claude AI
- [Replicate](https://replicate.com/) - Stable Diffusion hosting
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- All the amazing open-source contributors

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/book-dreamer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/book-dreamer/discussions)
- **Email**: support@bookdreamer.app (example)

---

**Made with ❤️ for book lovers and AI enthusiasts**

*Happy Reading! 📚✨*
