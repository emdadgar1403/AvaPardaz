import { PauseConfig } from '../types';

export const ZWNJ = '\u200C'; // Zero-Width Non-Joiner (نیم‌فاصله)

export function normalizePersianText(raw: string): string {
  if (!raw) return '';

  let text = raw
    .replace(/ي/g, 'ی')
    .replace(/ى/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ؤ/g, 'و')
    .replace(/إ/g, 'ا')
    .replace(/أ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ۀ/g, 'ه')
    .replace(/ـ/g, '') // remove tatweel
    .replace(/[ \t]+/g, ' ')
    .replace(new RegExp(` ${ZWNJ}`, 'g'), ' ')
    .replace(new RegExp(`${ZWNJ} `, 'g'), ' ')
    .replace(new RegExp(`${ZWNJ}${ZWNJ}+`, 'g'), ZWNJ)
    .replace(/\?/g, '؟')
    .replace(/,/g, '،')
    .replace(/;/g, '؛');

  return text.trim();
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/[\s،؛.؟!]+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function countZWNJ(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ZWNJ) count++;
  }
  return count;
}

export interface TextSegment {
  content: string;
  punctuation: string | null;
  pauseMs: number;
}

export function parsePunctuationSegments(text: string, pauseConfig: PauseConfig): TextSegment[] {
  const normalized = normalizePersianText(text);
  if (!normalized) return [];

  if (!pauseConfig.smartPauseEnabled) {
    return [{ content: normalized, punctuation: null, pauseMs: 0 }];
  }

  // Regex splitting on Persian punctuation
  const regex = /([^،؛.؟!\n]+)([،؛.؟!\n]|$)/g;
  const segments: TextSegment[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(normalized)) !== null) {
    const content = match[1]?.trim();
    const punct = match[2] || null;

    if (content) {
      let pauseMs = 0;
      if (punct === '،') pauseMs = pauseConfig.commaPauseMs;
      else if (punct === '؛') pauseMs = Math.round(pauseConfig.commaPauseMs * 1.3);
      else if (punct === '.' || punct === '!') pauseMs = pauseConfig.periodPauseMs;
      else if (punct === '؟') pauseMs = pauseConfig.questionPauseMs;
      else if (punct === '\n') pauseMs = pauseConfig.paragraphPauseMs;

      segments.push({ content, punctuation: punct, pauseMs });
    }
  }

  return segments.length > 0 ? segments : [{ content: normalized, punctuation: null, pauseMs: 0 }];
}
