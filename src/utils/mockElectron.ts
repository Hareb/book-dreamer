/**
 * Mock Electron API for web development and testing
 * This allows testing the UI without running the full Electron app
 */

import type { CacheStats } from '../types';

export const mockElectronAPI = {
  openFileDialog: async (): Promise<{ path: string; data: number[] } | null> => {
    console.warn('[Mock Electron] openFileDialog called - file selection not available in web mode');
    alert('File selection is only available in the Electron app. In web mode, you can only test the UI.');
    return null;
  },

  saveToCache: async (key: string, data: any): Promise<boolean> => {
    console.log('[Mock Electron] Saving to cache:', key);
    try {
      localStorage.setItem(`mock_cache_${key}`, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },

  getFromCache: async (key: string): Promise<any> => {
    console.log('[Mock Electron] Getting from cache:', key);
    try {
      const data = localStorage.getItem(`mock_cache_${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearCache: async (): Promise<boolean> => {
    console.log('[Mock Electron] Clearing cache');
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('mock_cache_'));
      keys.forEach(k => localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },

  getCacheStats: async (): Promise<CacheStats> => {
    console.log('[Mock Electron] Getting cache stats');
    const keys = Object.keys(localStorage).filter(k => k.startsWith('mock_cache_'));
    let totalSize = 0;

    keys.forEach(k => {
      const data = localStorage.getItem(k);
      if (data) totalSize += data.length;
    });

    return {
      fileCount: keys.length,
      totalSize: totalSize,
      path: 'localStorage (web mode)',
    };
  },
};

/**
 * Initialize mock Electron API if not running in Electron
 */
export function initMockElectronIfNeeded() {
  if (typeof window !== 'undefined' && !window.electron) {
    console.log('[Mock Electron] Running in web mode - initializing mock Electron API');
    (window as any).electron = mockElectronAPI;
  }
}
