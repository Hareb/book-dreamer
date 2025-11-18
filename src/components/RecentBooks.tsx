import { Clock, X, Trash2 } from 'lucide-react';
import { RecentBook } from '../hooks/useRecentBooks';

interface RecentBooksProps {
  recentBooks: RecentBook[];
  onOpenBook: (book: RecentBook) => void;
  onRemoveBook: (path: string) => void;
  onClearAll: () => void;
}

export default function RecentBooks({
  recentBooks,
  onOpenBook,
  onRemoveBook,
  onClearAll,
}: RecentBooksProps) {
  if (recentBooks.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Books
        </h2>
        {recentBooks.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-text-secondary hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentBooks.map(book => (
          <div
            key={book.path}
            className="group bg-background-light hover:bg-gray-800 border border-gray-800 hover:border-accent rounded-lg transition-all cursor-pointer relative"
            onClick={() => onOpenBook(book)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveBook(book.path);
              }}
              className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove from recent"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4">
              {book.cover && (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h3 className="font-semibold mb-1 truncate">{book.title}</h3>
              <p className="text-sm text-text-secondary mb-2 truncate">{book.author}</p>
              <p className="text-xs text-text-secondary">{formatDate(book.lastOpened)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
