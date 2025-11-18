import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  RefreshCw,
  Menu,
  Keyboard,
} from 'lucide-react';
import { Book, Chapter, Settings } from '../types';
import { EPubService } from '../services/epubService';
import { AIService } from '../services/aiService';
import { ImageService } from '../services/imageService';
import { useImageGeneration } from '../hooks/useImageGeneration';
import { useKeyboardShortcuts, createReaderShortcuts } from '../hooks/useKeyboardShortcuts';

interface ReaderProps {
  book: Book;
  bookData: ArrayBuffer;
  settings: Settings;
  epubService: EPubService;
  aiService: AIService;
  imageService: ImageService;
  onOpenSettings?: () => void;
}

export default function Reader({
  book,
  bookData,
  settings,
  epubService,
  aiService,
  imageService,
  onOpenSettings,
}: ReaderProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);

  // Use image generation hook
  const {
    queueGeneration,
    queueMultipleGenerations,
    getImage,
    clearCache,
    isGenerating,
    currentTask,
    progress,
    cacheSize,
  } = useImageGeneration({
    book,
    settings,
    aiService,
    imageService,
    epubService,
  });

  // Load chapters
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chaps = await epubService.getChapters();
        setChapters(chaps);
      } catch (error) {
        console.error('Error loading chapters:', error);
      }
    };

    loadChapters();
  }, [epubService]);

  // Render current chapter
  useEffect(() => {
    if (chapters.length === 0 || !viewerRef.current) return;

    const renderChapter = async () => {
      const epubBook = epubService.getBook();
      if (!epubBook) return;

      // Clear previous rendition
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }

      // Create new rendition
      const rendition = epubBook.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'scrolled-doc',
      });

      const chapter = chapters[currentChapterIndex];
      await rendition.display(chapter.href);

      renditionRef.current = rendition;
    };

    renderChapter();
  }, [currentChapterIndex, chapters, epubService]);

  // Auto-generate images when chapter changes
  useEffect(() => {
    if (chapters.length === 0 || !settings.autoGenerate) return;

    const chapter = chapters[currentChapterIndex];
    if (!chapter) return;

    // Queue current chapter
    queueGeneration(chapter, 0);

    // Pre-generate next chapters
    if (settings.preGenerateChapters > 0) {
      const nextChapters = chapters.slice(
        currentChapterIndex + 1,
        currentChapterIndex + 1 + settings.preGenerateChapters
      );
      queueMultipleGenerations(nextChapters, 1);
    }
  }, [currentChapterIndex, chapters, settings.autoGenerate, settings.preGenerateChapters, queueGeneration, queueMultipleGenerations]);

  const goToChapter = useCallback((index: number) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentChapterIndex(index);
      setShowChapterList(false);
    }
  }, [chapters.length]);

  const handleGenerateImage = useCallback(() => {
    const chapter = chapters[currentChapterIndex];
    if (chapter) {
      queueGeneration(chapter, 0);
    }
  }, [currentChapterIndex, chapters, queueGeneration]);

  // Keyboard shortcuts
  const shortcuts = createReaderShortcuts({
    nextChapter: () => goToChapter(currentChapterIndex + 1),
    prevChapter: () => goToChapter(currentChapterIndex - 1),
    toggleChapterList: () => setShowChapterList(prev => !prev),
    generateImage: handleGenerateImage,
    openSettings: () => onOpenSettings?.(),
  });

  useKeyboardShortcuts(shortcuts, !showKeyboardHelp);

  const currentChapter = chapters[currentChapterIndex];
  const currentImage = currentChapter ? getImage(currentChapter.id) : null;

  return (
    <div className="h-full relative">
      {/* Background Image */}
      {currentImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${currentImage.url})`,
            opacity: settings.backgroundOpacity,
            filter: `blur(${settings.backgroundBlur}px)`,
          }}
        />
      )}

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setShowKeyboardHelp(false)}>
          <div className="bg-background-light p-8 rounded-lg border border-gray-800 max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              {shortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-text-secondary">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-background rounded border border-gray-700 font-mono text-xs">
                    {shortcut.ctrl && 'Ctrl+'}
                    {shortcut.shift && 'Shift+'}
                    {shortcut.alt && 'Alt+'}
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="mt-6 w-full px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex">
        {/* Chapter List Sidebar */}
        {showChapterList && (
          <div className="w-80 bg-background-light/95 backdrop-blur-lg border-r border-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold">Chapters</h3>
            </div>
            <div className="p-2">
              {chapters.map((chapter, index) => {
                const hasImage = !!getImage(chapter.id);
                return (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors relative ${
                      index === currentChapterIndex
                        ? 'bg-accent text-white'
                        : 'hover:bg-background-light'
                    }`}
                  >
                    <div className="text-sm font-medium">{chapter.label}</div>
                    {hasImage && (
                      <ImageIcon className="w-3 h-3 absolute top-3 right-3 text-green-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Reader Area */}
        <div className="flex-1 flex flex-col">
          {/* Reader Header */}
          <div className="h-12 bg-background-light/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className="p-1 hover:bg-background rounded transition-colors"
                title="Toggle chapter list (Ctrl+M)"
              >
                <Menu className="w-5 h-5" />
              </button>

              {currentChapter && (
                <span className="text-sm font-medium">{currentChapter.label}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isGenerating && progress.total > 0 && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {currentTask} ({progress.current}/{progress.total})
                  </span>
                </div>
              )}

              {currentImage ? (
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-text-secondary">
                    {currentImage.cached ? 'Cached' : 'Generated'}
                  </span>
                  <button
                    onClick={handleGenerateImage}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Regenerate image (Ctrl+G)"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateImage}
                  disabled={!aiService.isConfigured() || !imageService.isConfigured() || isGenerating}
                  className="px-3 py-1 bg-accent hover:bg-accent-hover rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Generate
                </button>
              )}

              <button
                onClick={() => setShowKeyboardHelp(true)}
                className="p-1 hover:bg-background rounded transition-colors"
                title="Keyboard shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* EPUB Viewer */}
          <div ref={viewerRef} className="flex-1 overflow-y-auto epub-container bg-background/80 backdrop-blur-sm" />

          {/* Navigation */}
          <div className="h-16 bg-background-light/80 backdrop-blur-lg border-t border-gray-800 flex items-center justify-between px-8">
            <button
              onClick={() => goToChapter(currentChapterIndex - 1)}
              disabled={currentChapterIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm text-text-secondary">
                Chapter {currentChapterIndex + 1} of {chapters.length}
              </div>
              {cacheSize > 0 && (
                <div className="text-xs text-text-secondary mt-1">
                  {cacheSize} images cached
                </div>
              )}
            </div>

            <button
              onClick={() => goToChapter(currentChapterIndex + 1)}
              disabled={currentChapterIndex === chapters.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
