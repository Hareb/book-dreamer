export interface Book {
  title: string;
  author: string;
  cover?: string;
  path: string;
}

export interface Chapter {
  id: string;
  label: string;
  href: string;
  content?: string;
}

export interface SceneDescription {
  chapterId: string;
  description: string;
  imagePrompt: string;
  timestamp: number;
}

export interface GeneratedImage {
  chapterId: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  timestamp: number;
  cached: boolean;
}

export type ImageStyle = 'realistic' | 'artistic' | 'minimalist';

export interface Settings {
  apiKeys: {
    anthropic: string;
    replicate: string;
  };
  imageStyle: ImageStyle;
  backgroundOpacity: number;
  backgroundBlur: number;
  autoGenerate: boolean;
  preGenerateChapters: number;
}

export interface ReaderState {
  currentBook: Book | null;
  chapters: Chapter[];
  currentChapter: number;
  generatedImages: Map<string, GeneratedImage>;
  isGenerating: boolean;
}

declare global {
  interface Window {
    electron: {
      openFileDialog: () => Promise<{ path: string; data: number[] } | null>;
      saveToCache: (key: string, data: any) => Promise<boolean>;
      getFromCache: (key: string) => Promise<any>;
      clearCache: () => Promise<boolean>;
    };
  }
}
