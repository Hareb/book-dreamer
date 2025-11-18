import { GeneratedImage } from '../types';

export class CacheService {
  private static generateCacheKey(bookTitle: string, chapterId: string, style: string): string {
    return `${bookTitle}_${chapterId}_${style}`.replace(/[^a-zA-Z0-9]/g, '_');
  }

  static async saveImage(
    bookTitle: string,
    image: GeneratedImage
  ): Promise<void> {
    const key = this.generateCacheKey(bookTitle, image.chapterId, image.style);

    const cacheData = {
      ...image,
      cached: true,
    };

    if (window.electron) {
      await window.electron.saveToCache(key, cacheData);
    } else {
      // Fallback to localStorage for web version
      localStorage.setItem(`bd_cache_${key}`, JSON.stringify(cacheData));
    }
  }

  static async getImage(
    bookTitle: string,
    chapterId: string,
    style: string
  ): Promise<GeneratedImage | null> {
    const key = this.generateCacheKey(bookTitle, chapterId, style);

    if (window.electron) {
      return await window.electron.getFromCache(key);
    } else {
      // Fallback to localStorage
      const cached = localStorage.getItem(`bd_cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    }
  }

  static async clearAllCache(): Promise<void> {
    if (window.electron) {
      await window.electron.clearCache();
    } else {
      // Clear localStorage
      Object.keys(localStorage)
        .filter(key => key.startsWith('bd_cache_'))
        .forEach(key => localStorage.removeItem(key));
    }
  }

  static async getCacheSize(): Promise<number> {
    if (window.electron) {
      // Would need to implement this in electron.js
      return 0;
    } else {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('bd_cache_'));
      return keys.length;
    }
  }
}
