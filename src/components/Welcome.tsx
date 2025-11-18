import { BookOpen, Sparkles, Settings, AlertCircle } from 'lucide-react';

interface WelcomeProps {
  onOpenBook: () => void;
  isConfigured: boolean;
  onOpenSettings: () => void;
}

export default function Welcome({ onOpenBook, isConfigured, onOpenSettings }: WelcomeProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-2xl px-8">
        <div className="mb-8">
          <Sparkles className="w-20 h-20 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Welcome to BookDreamer</h1>
          <p className="text-xl text-text-secondary">
            An AI-powered ebook reader that generates beautiful, contextual illustrations
            as you read
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-yellow-500 mb-1">API Keys Required</p>
              <p className="text-sm text-text-secondary">
                You need to configure your Anthropic (Claude) and Replicate API keys before
                generating illustrations. Click the settings button to add them.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-background-light rounded-lg border border-gray-800">
            <BookOpen className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-2">EPUB Support</h3>
            <p className="text-sm text-text-secondary">
              Open any EPUB book and enjoy an immersive reading experience
            </p>
          </div>

          <div className="p-6 bg-background-light rounded-lg border border-gray-800">
            <Sparkles className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-2">AI Illustrations</h3>
            <p className="text-sm text-text-secondary">
              Automatically generated contextual images for each chapter
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onOpenBook}
            disabled={!isConfigured}
            className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
              isConfigured
                ? 'bg-accent hover:bg-accent-hover'
                : 'bg-gray-700 cursor-not-allowed opacity-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Open Your First Book
          </button>

          <button
            onClick={onOpenSettings}
            className="px-8 py-3 bg-background-light hover:bg-gray-800 rounded-lg font-semibold flex items-center gap-2 transition-colors border border-gray-700"
          >
            <Settings className="w-5 h-5" />
            Configure Settings
          </button>
        </div>

        <div className="mt-8 text-sm text-text-secondary">
          <p>
            <strong>Tip:</strong> Images are cached locally, so you only pay once per chapter
          </p>
        </div>
      </div>
    </div>
  );
}
