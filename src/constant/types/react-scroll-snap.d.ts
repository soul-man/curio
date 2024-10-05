declare module 'react-scroll-snap' {
    import { RefObject } from 'react';
  
    export interface ScrollSnapOptions {
      ref: RefObject<HTMLElement>;
      duration?: number;
      delay?: number;
    }
  
    export function useScrollSnap(options: ScrollSnapOptions): {
      bind: () => void;
      unbind: () => void;
    };
  }