import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'auto-rotate'?: boolean;
          'auto-rotate-delay'?: string;
          'rotation-per-second'?: string;
          'camera-controls'?: boolean;
          'disable-zoom'?: boolean;
          'disable-pan'?: boolean;
          'interaction-prompt'?: string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          exposure?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
