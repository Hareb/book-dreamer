import { useState, useCallback, useRef, useEffect } from 'react';
import { GeneratedImage, Chapter, Settings, Book } from '../types';
import { AIService } from '../services/aiService';
import { ImageService } from '../services/imageService';
import { CacheService } from '../services/cacheService';
import { EPubService } from '../services/epubService';

interface GenerationTask {
  chapter: Chapter;
  priority: number; // Lower = higher priority
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface UseImageGenerationProps {
  book: Book;
  settings: Settings;
  aiService: AIService;
  imageService: ImageService;
  epubService: EPubService;
}

export function useImageGeneration({
  book,
  settings,
  aiService,
  imageService,
  epubService,
}: UseImageGenerationProps) {
  const [imageCache, setImageCache] = useState<Map<string, GeneratedImage>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const queueRef = useRef<GenerationTask[]>([]);
  const isProcessingRef = useRef(false);

  // Process queue
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    setIsGenerating(true);

    while (queueRef.current.length > 0) {
      // Sort by priority
      queueRef.current.sort((a, b) => a.priority - b.priority);

      const task = queueRef.current[0];
      if (!task || task.status !== 'pending') {
        queueRef.current.shift();
        continue;
      }

      task.status = 'processing';
      setProgress({
        current: queueRef.current.filter(t => t.status === 'completed').length + 1,
        total: queueRef.current.length,
      });

      try {
        // Check cache first
        setCurrentTask(`Checking cache for ${task.chapter.label}...`);
        const cached = await CacheService.getImage(
          book.title,
          task.chapter.id,
          settings.imageStyle
        );

        if (cached) {
          setImageCache(prev => new Map(prev).set(task.chapter.id, cached));
          task.status = 'completed';
          queueRef.current.shift();
          continue;
        }

        // Get chapter content
        setCurrentTask(`Reading ${task.chapter.label}...`);
        const content = await epubService.getChapterContent(task.chapter);

        if (!content.trim()) {
          task.status = 'failed';
          queueRef.current.shift();
          continue;
        }

        // Extract scene
        setCurrentTask(`Analyzing ${task.chapter.label}...`);
        const sceneDesc = await aiService.extractSceneDescription(
          task.chapter.id,
          content,
          settings.imageStyle
        );

        if (!sceneDesc.imagePrompt) {
          task.status = 'failed';
          queueRef.current.shift();
          continue;
        }

        // Generate image
        setCurrentTask(`Generating image for ${task.chapter.label}...`);
        const image = await imageService.generateImage(
          task.chapter.id,
          sceneDesc.imagePrompt,
          settings.imageStyle
        );

        // Cache it
        await CacheService.saveImage(book.title, image);

        // Update cache
        setImageCache(prev => new Map(prev).set(task.chapter.id, image));

        task.status = 'completed';
      } catch (error) {
        console.error('Error generating image:', error);
        task.status = 'failed';
      }

      queueRef.current.shift();
    }

    isProcessingRef.current = false;
    setIsGenerating(false);
    setCurrentTask('');
    setProgress({ current: 0, total: 0 });
  }, [book.title, settings.imageStyle, aiService, imageService, epubService]);

  // Add chapter to queue
  const queueGeneration = useCallback(
    (chapter: Chapter, priority: number = 1) => {
      // Don't queue if already in cache
      if (imageCache.has(chapter.id)) {
        return;
      }

      // Don't queue if already queued
      if (queueRef.current.some(t => t.chapter.id === chapter.id)) {
        return;
      }

      queueRef.current.push({
        chapter,
        priority,
        status: 'pending',
      });

      // Start processing
      processQueue();
    },
    [imageCache, processQueue]
  );

  // Queue multiple chapters (for pre-generation)
  const queueMultipleGenerations = useCallback(
    (chapters: Chapter[], startPriority: number = 1) => {
      chapters.forEach((chapter, index) => {
        queueGeneration(chapter, startPriority + index);
      });
    },
    [queueGeneration]
  );

  // Get image for chapter
  const getImage = useCallback(
    (chapterId: string): GeneratedImage | null => {
      return imageCache.get(chapterId) || null;
    },
    [imageCache]
  );

  // Clear cache
  const clearCache = useCallback(() => {
    setImageCache(new Map());
  }, []);

  return {
    queueGeneration,
    queueMultipleGenerations,
    getImage,
    clearCache,
    isGenerating,
    currentTask,
    progress,
    cacheSize: imageCache.size,
  };
}
