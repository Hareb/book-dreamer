import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, BookOpen, Image as ImageIcon } from 'lucide-react';
import Reader from './components/Reader';
import Settings from './components/Settings';
import Welcome from './components/Welcome';
import RecentBooks from './components/RecentBooks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Settings as SettingsType, Book } from './types';
import { EPubService } from './services/epubService';
import { AIService } from './services/aiService';
import { ImageService } from './services/imageService';
import { useRecentBooks } from './hooks/useRecentBooks';

const DEFAULT_SETTINGS: SettingsType = {
  apiKeys: {
    anthropic: '',
    replicate: '',
  },
  imageStyle: 'artistic',
  backgroundOpacity: 0.3,
  backgroundBlur: 8,
  autoGenerate: true,
  preGenerateChapters: 2,
};

function App() {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [bookData, setBookData] = useState<ArrayBuffer | null>(null);
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [epubService] = useState(() => new EPubService());
  const [aiService] = useState(() => new AIService());
  const [imageService] = useState(() => new ImageService());
  const { recentBooks, addRecentBook, removeRecentBook, clearRecentBooks } = useRecentBooks();

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookdreamer_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);

        // Initialize services with saved API keys
        if (parsed.apiKeys.anthropic) {
          aiService.setApiKey(parsed.apiKeys.anthropic);
        }
        if (parsed.apiKeys.replicate) {
          imageService.setApiKey(parsed.apiKeys.replicate);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [aiService, imageService]);

  // Save settings to localStorage
  const updateSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    localStorage.setItem('bookdreamer_settings', JSON.stringify(newSettings));

    // Update service API keys
    if (newSettings.apiKeys.anthropic) {
      aiService.setApiKey(newSettings.apiKeys.anthropic);
    }
    if (newSettings.apiKeys.replicate) {
      imageService.setApiKey(newSettings.apiKeys.replicate);
    }
  };

  const handleOpenBook = async () => {
    if (!window.electron) {
      alert('File selection is only available in the Electron app');
      return;
    }

    const result = await window.electron.openFileDialog();
    if (result) {
      const arrayBuffer = new Uint8Array(result.data).buffer;
      setBookData(arrayBuffer);

      const book = await epubService.loadBook(arrayBuffer);
      const fullBook = { ...book, path: result.path };
      setCurrentBook(fullBook);
      addRecentBook(fullBook);
    }
  };

  const handleOpenRecentBook = async (book: Book) => {
    if (!window.electron) {
      alert('File selection is only available in the Electron app');
      return;
    }

    try {
      // Read the file from the saved path
      const fileBuffer = await window.electron.openFileDialog();
      // In production, you'd want to read from book.path directly
      // For now, we'll just open the file dialog
      if (fileBuffer) {
        const arrayBuffer = new Uint8Array(fileBuffer.data).buffer;
        setBookData(arrayBuffer);
        const loadedBook = await epubService.loadBook(arrayBuffer);
        const fullBook = { ...loadedBook, path: fileBuffer.path };
        setCurrentBook(fullBook);
        addRecentBook(fullBook);
      }
    } catch (error) {
      console.error('Error opening recent book:', error);
      alert('Could not open book. It may have been moved or deleted.');
      removeRecentBook(book.path);
    }
  };

  const isConfigured = settings.apiKeys.anthropic && settings.apiKeys.replicate;

  return (
    <ErrorBoundary>
      <div className="w-full h-full bg-background text-text-primary">
      {/* Header */}
      <header className="h-14 bg-background-light border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-semibold">BookDreamer</h1>
          {currentBook && (
            <div className="ml-4 text-sm text-text-secondary">
              <BookOpen className="w-4 h-4 inline mr-2" />
              {currentBook.title}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenBook}
            className="px-4 py-2 bg-accent hover:bg-accent-hover rounded-lg transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Open Book
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-background-light rounded-lg transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100%-3.5rem)] relative">
        {showSettings ? (
          <Settings
            settings={settings}
            onSave={updateSettings}
            onClose={() => setShowSettings(false)}
          />
        ) : currentBook && bookData ? (
          <Reader
            book={currentBook}
            bookData={bookData}
            settings={settings}
            epubService={epubService}
            aiService={aiService}
            imageService={imageService}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto p-8">
              <Welcome
                onOpenBook={handleOpenBook}
                isConfigured={isConfigured}
                onOpenSettings={() => setShowSettings(true)}
              />
              {recentBooks.length > 0 && (
                <div className="mt-12">
                  <RecentBooks
                    recentBooks={recentBooks}
                    onOpenBook={handleOpenRecentBook}
                    onRemoveBook={removeRecentBook}
                    onClearAll={clearRecentBooks}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
