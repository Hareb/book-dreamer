import { useState, useEffect } from 'react';
import { Book } from '../types';

const RECENT_BOOKS_KEY = 'bookdreamer_recent_books';
const MAX_RECENT_BOOKS = 10;

export interface RecentBook extends Book {
  lastOpened: number;
}

export function useRecentBooks() {
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);

  // Load recent books on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_BOOKS_KEY);
    if (saved) {
      try {
        const books = JSON.parse(saved);
        setRecentBooks(books);
      } catch (error) {
        console.error('Error loading recent books:', error);
      }
    }
  }, []);

  // Add book to recent
  const addRecentBook = (book: Book) => {
    setRecentBooks(prev => {
      // Remove if already exists
      const filtered = prev.filter(b => b.path !== book.path);

      // Add to front
      const updated = [
        {
          ...book,
          lastOpened: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_RECENT_BOOKS);

      // Save to localStorage
      localStorage.setItem(RECENT_BOOKS_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  // Remove book from recent
  const removeRecentBook = (path: string) => {
    setRecentBooks(prev => {
      const updated = prev.filter(b => b.path !== path);
      localStorage.setItem(RECENT_BOOKS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all recent
  const clearRecentBooks = () => {
    setRecentBooks([]);
    localStorage.removeItem(RECENT_BOOKS_KEY);
  };

  return {
    recentBooks,
    addRecentBook,
    removeRecentBook,
    clearRecentBooks,
  };
}
