# Changelog

All notable changes to BookDreamer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-11-18

### Added

#### Core Features
- **EPUB Reader**: Complete ebook reader with epub.js integration
- **AI Scene Analysis**: Automatic scene extraction using Claude AI (Anthropic)
- **Image Generation**: Beautiful AI-generated illustrations using Stable Diffusion (Replicate)
- **Smart Caching**: Local image cache to save API costs on re-reads
- **Pre-generation Queue**: Intelligent system to pre-generate upcoming chapters
- **Multiple Art Styles**: Choose between Realistic, Artistic, or Minimalist styles
- **Customizable Display**: Adjustable background opacity (0-100%) and blur (0-20px)

#### User Interface
- **Modern Dark Theme**: Beautiful dark UI with TailwindCSS
- **Chapter Navigation**: Easy navigation with chapter list sidebar
- **Recent Books**: Quick access to recently opened books with covers
- **Settings Panel**: Comprehensive settings for API keys and preferences
- **Welcome Screen**: Helpful onboarding for new users
- **Error Boundaries**: Robust error handling to prevent crashes
- **Keyboard Shortcuts**: Full keyboard navigation support
  - `→` / `←` - Next/Previous chapter
  - `Ctrl+G` - Generate/regenerate image
  - `Ctrl+M` - Toggle chapter list
  - `Ctrl+,` - Open settings
- **Keyboard Help Modal**: In-app shortcut reference

#### Developer Features
- **TypeScript**: Full type safety throughout the codebase
- **Mock Electron API**: Test UI in browser without Electron
- **Web Development Mode**: Faster iteration with `npm run dev:vite`
- **Hot Reload**: Instant React component updates in dev mode
- **Complete Type Definitions**: Types for epub.js and all APIs
- **Error Logging**: Comprehensive error handling and logging

#### Documentation
- **README.md**: Complete project documentation with architecture, features, and costs
- **QUICKSTART.md**: 5-minute setup guide for end users
- **DEVELOPMENT.md**: Comprehensive developer guide
- **TROUBLESHOOTING.md**: Common issues and solutions
- **CHANGELOG.md**: Version history and changes
- **LICENSE**: MIT License

#### Technical Implementation
- **Electron App**: Cross-platform desktop application (macOS, Windows, Linux)
- **React + TypeScript**: Modern UI framework with type safety
- **Vite**: Fast build tool and dev server
- **IPC Communication**: Secure Electron preload script
- **Context Isolation**: Enhanced security with isolated contexts
- **File System Access**: Electron APIs for file operations
- **LocalStorage Integration**: Settings and cache management

#### Services
- **EPubService**: EPUB parsing and chapter extraction
- **AIService**: Claude API integration for scene analysis
- **ImageService**: Replicate/Stable Diffusion integration
- **CacheService**: Local image caching with Electron or localStorage

#### Custom Hooks
- **useImageGeneration**: Queue management and pre-generation
- **useRecentBooks**: Recent books history management
- **useKeyboardShortcuts**: Global keyboard shortcut handling

#### Cost Optimization
- **Intelligent Caching**: Images cached permanently after first generation
- **Configurable Pre-generation**: Choose how many chapters to pre-generate (0-5)
- **On-demand Generation**: Manual generation option to control costs
- **Estimated Costs**: ~$0.06-0.50 per book (first read), FREE on re-reads

### Fixed
- **Electron Configuration**: Proper isDev detection and path resolution
- **Build System**: Correct output directories and file inclusions
- **TypeScript Types**: Complete type definitions for all dependencies
- **IPC Handlers**: Robust error handling for all Electron IPC calls
- **Production Paths**: Correct file paths for production builds
- **Cache Stats**: Added IPC handler for cache statistics

### Technical Details

#### Dependencies
**Production:**
- @anthropic-ai/sdk: ^0.27.0
- epubjs: ^0.3.93
- react: ^18.2.0
- react-dom: ^18.2.0
- replicate: ^0.31.0
- lucide-react: ^0.294.0

**Development:**
- electron: ^28.0.0
- electron-builder: ^24.9.1
- vite: ^5.0.8
- typescript: ^5.3.3
- tailwindcss: ^3.3.6
- @types/node: ^20.10.0
- @types/react: ^18.2.43
- cross-env: ^7.0.3
- concurrently: ^8.2.2
- wait-on: ^7.2.0

#### Supported Platforms
- macOS 10.13+ (High Sierra and newer)
- Windows 10/11
- Linux (tested on Ubuntu 20.04+)

#### Build Outputs
- **macOS**: .dmg installer
- **Windows**: .exe NSIS installer
- **Linux**: .AppImage portable app

### Security
- Context isolation enabled
- Node integration disabled
- Secure IPC communication via preload script
- API keys stored in localStorage (never transmitted except to respective APIs)
- No telemetry or tracking

### Known Limitations
- EPUB format only (no PDF, MOBI, or other formats yet)
- DRM-protected books not supported
- Character consistency between chapters not guaranteed
- Requires internet connection for AI generation
- API costs for first-time generation

### Future Roadmap
Planned features for future releases:
- [ ] Local Stable Diffusion support (no API costs)
- [ ] Character consistency tracking
- [ ] Multiple images per chapter
- [ ] PDF format support
- [ ] Community image sharing
- [ ] Kindle Cloud Reader plugin
- [ ] Mobile apps (iOS/Android)
- [ ] Custom fine-tuned models for specific genres
- [ ] Animation between scenes
- [ ] Voice narration with synchronized images

---

## Version History

### [0.1.0] - 2024-11-18
Initial release of BookDreamer

**Stats:**
- 31 files created
- 3,600+ lines of code
- 5 custom React hooks
- 4 services
- 7 React components
- Complete TypeScript coverage
- Full documentation

---

For detailed upgrade instructions, see [README.md](README.md)

For bug reports and feature requests, visit [GitHub Issues](https://github.com/yourusername/book-dreamer/issues)
