// Type definitions for epubjs
declare module 'epubjs' {
  export interface NavItem {
    id: string;
    href: string;
    label: string;
    subitems?: NavItem[];
    parent?: NavItem;
  }

  export interface Metadata {
    title: string;
    creator: string;
    description?: string;
    pubdate?: string;
    publisher?: string;
    identifier?: string;
    language?: string;
    rights?: string;
    modified_date?: string;
    layout?: string;
    orientation?: string;
    flow?: string;
    viewport?: string;
    spread?: string;
  }

  export interface Navigation {
    toc: NavItem[];
    landmarks: NavItem[];
    length: number;
  }

  export interface Section {
    index: number;
    href: string;
    url: string;
    canonical: string;
    next: () => Section | null;
    prev: () => Section | null;
    load: (request: any) => Promise<Document>;
    render: (request: any) => Promise<any>;
    find: (query: string) => any[];
    reconcileLayoutSettings: (globalLayout: any) => any;
    cfiFromRange: (range: Range) => string;
    cfiFromElement: (element: Element) => string;
    unload: () => void;
    destroy: () => void;
    contents?: Document;
  }

  export interface Spine {
    items: Section[];
    length: number;
    get: (target: string | number) => Section | undefined;
    first: () => Section;
    last: () => Section;
  }

  export interface Rendition {
    render: () => Promise<void>;
    display: (target?: string | number) => Promise<void>;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    destroy: () => void;
    on: (event: string, callback: Function) => void;
    off: (event: string, callback: Function) => void;
    currentLocation: () => any;
    reportLocation: () => any;
    annotations: any;
    themes: any;
  }

  export interface Book {
    ready: Promise<void>;
    opened: Promise<void>;
    loaded: {
      metadata: Promise<Metadata>;
      navigation: Promise<Navigation>;
      cover: Promise<string | null>;
      spine: Promise<Spine>;
      resources: Promise<any>;
      manifest: Promise<any>;
    };
    spine: Spine;
    navigation: Navigation;
    coverUrl: () => Promise<string | null>;
    load: (path: string) => Promise<any>;
    resolve: (path: string, relative?: boolean) => string;
    canonical: (path: string) => string;
    section: (target: string | number) => Section;
    renderTo: (element: Element | string, options?: any) => Rendition;
    getRange: (cfiRange: string) => Range;
    key: (identifier?: string) => string;
    destroy: () => void;
  }

  export default function ePub(url: string | ArrayBuffer, options?: any): Book;
}
