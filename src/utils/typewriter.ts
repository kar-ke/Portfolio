export type TypewriterPhase = 'typing' | 'pausing' | 'deleting' | 'switching';

export interface TypewriterState {
  readonly wordIndex: number;
  readonly charCount: number;
  readonly phase: TypewriterPhase;
}

export interface TypewriterTiming {
  readonly typeMs: number;
  readonly deleteMs: number;
  readonly pauseAfterTypeMs: number;
  readonly pauseBeforeNextMs: number;
}

export const DEFAULT_TYPEWRITER_TIMING: TypewriterTiming = {
  typeMs: 82,
  deleteMs: 40,
  pauseAfterTypeMs: 2000,
  pauseBeforeNextMs: 320,
};

type GraphemeSegmenter = {
  segment(input: string): Iterable<{ segment: string }>;
};

let cachedSegmenter: GraphemeSegmenter | null | undefined;

function getSegmenter(): GraphemeSegmenter | null {
  if (cachedSegmenter !== undefined) {
    return cachedSegmenter;
  }
  const intlWithSegmenter = Intl as unknown as {
    Segmenter?: new (
      locales?: string | string[],
      options?: { granularity: 'grapheme' },
    ) => GraphemeSegmenter;
  };

  if (typeof intlWithSegmenter.Segmenter === 'function') {
    cachedSegmenter = new intlWithSegmenter.Segmenter(undefined, {
      granularity: 'grapheme',
    });
  } else {
    cachedSegmenter = null;
  }
  return cachedSegmenter;
}

/**
 * Splits Unicode strings (including Indic scripts like Tamil, Hindi,
 * Malayalam, Kannada, and Telugu) into visual grapheme clusters so
 * combining vowel marks are never sliced mid-character.
 */
export function segmentGraphemes(text: string): string[] {
  if (!text) return [];
  const segmenter = getSegmenter();
  if (segmenter) {
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

export function createInitialTypewriterState(startTyped = false, firstWord = ''): TypewriterState {
  if (startTyped) {
    return {
      wordIndex: 0,
      charCount: segmentGraphemes(firstWord).length,
      phase: 'pausing',
    };
  }
  return {
    wordIndex: 0,
    charCount: 0,
    phase: 'typing',
  };
}

export function getCurrentDisplayText(
  words: readonly string[],
  state: TypewriterState,
): string {
  if (words.length === 0) return '';
  const word = words[state.wordIndex % words.length] ?? '';
  const graphemes = segmentGraphemes(word);
  return graphemes.slice(0, Math.max(0, state.charCount)).join('');
}

export function stepTypewriterState(
  words: readonly string[],
  state: TypewriterState,
): TypewriterState {
  if (words.length === 0) {
    return state;
  }

  const safeIndex = state.wordIndex % words.length;
  const currentGraphemes = segmentGraphemes(words[safeIndex] ?? '');
  const wordLength = currentGraphemes.length;

  switch (state.phase) {
    case 'typing': {
      const nextCount = Math.min(wordLength, state.charCount + 1);
      if (nextCount >= wordLength) {
        return {
          wordIndex: safeIndex,
          charCount: wordLength,
          phase: 'pausing',
        };
      }
      return {
        wordIndex: safeIndex,
        charCount: nextCount,
        phase: 'typing',
      };
    }

    case 'pausing': {
      return {
        wordIndex: safeIndex,
        charCount: wordLength,
        phase: 'deleting',
      };
    }

    case 'deleting': {
      const nextCount = Math.max(0, state.charCount - 1);
      if (nextCount === 0) {
        return {
          wordIndex: safeIndex,
          charCount: 0,
          phase: 'switching',
        };
      }
      return {
        wordIndex: safeIndex,
        charCount: nextCount,
        phase: 'deleting',
      };
    }

    case 'switching': {
      return {
        wordIndex: (safeIndex + 1) % words.length,
        charCount: 0,
        phase: 'typing',
      };
    }
  }
}

export function getNextDelayMs(
  phase: TypewriterPhase,
  timing: TypewriterTiming = DEFAULT_TYPEWRITER_TIMING,
): number {
  switch (phase) {
    case 'typing':
      return timing.typeMs;
    case 'pausing':
      return timing.pauseAfterTypeMs;
    case 'deleting':
      return timing.deleteMs;
    case 'switching':
      return timing.pauseBeforeNextMs;
  }
}
