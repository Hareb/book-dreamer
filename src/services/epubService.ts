import ePub, { Book as EpubBook, NavItem } from 'epubjs';
import { Book, Chapter } from '../types';

export class EPubService {
  private book: EpubBook | null = null;

  async loadBook(arrayBuffer: ArrayBuffer): Promise<Book> {
    this.book = ePub(arrayBuffer);

    await this.book.ready;

    const metadata = await this.book.loaded.metadata;
    const cover = await this.book.coverUrl();

    return {
      title: metadata.title || 'Unknown',
      author: metadata.creator || 'Unknown',
      cover: cover || undefined,
      path: '',
    };
  }

  async getChapters(): Promise<Chapter[]> {
    if (!this.book) throw new Error('Book not loaded');

    const navigation = await this.book.loaded.navigation;
    const toc = navigation.toc;

    return this.flattenTOC(toc);
  }

  private flattenTOC(items: NavItem[], chapters: Chapter[] = []): Chapter[] {
    items.forEach((item) => {
      chapters.push({
        id: item.id || item.href,
        label: item.label,
        href: item.href,
      });

      if (item.subitems && item.subitems.length > 0) {
        this.flattenTOC(item.subitems, chapters);
      }
    });

    return chapters;
  }

  async getChapterContent(chapter: Chapter): Promise<string> {
    if (!this.book) throw new Error('Book not loaded');

    try {
      const section = this.book.spine.get(chapter.href);
      if (!section) {
        console.warn(`Section not found for ${chapter.href}`);
        return '';
      }

      await section.load(this.book.load.bind(this.book));
      const contents = section.contents;

      if (!contents) return '';

      // Extract text content
      const textContent = this.extractTextFromElement(contents);
      return textContent;
    } catch (error) {
      console.error('Error loading chapter:', error);
      return '';
    }
  }

  private extractTextFromElement(element: any): string {
    if (!element) return '';

    // Get text content, removing script and style elements
    const clone = element.cloneNode(true);
    const scripts = clone.querySelectorAll('script, style');
    scripts.forEach((script: any) => script.remove());

    return clone.textContent || clone.innerText || '';
  }

  getBook(): EpubBook | null {
    return this.book;
  }

  destroy() {
    if (this.book) {
      this.book.destroy();
      this.book = null;
    }
  }
}
