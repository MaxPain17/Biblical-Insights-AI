
import React from 'react';
import { THEOLOGICAL_TERMS } from '../theologicalTerms';
import { getCanonicalBookName, referenceRegex } from '../utils/referenceParser';

const termsRegexString = `\\b(${THEOLOGICAL_TERMS.join('|')})\\b`;
const termsRegex = new RegExp(termsRegexString, 'gi');

interface ClickableTextProps {
  text: string;
  onReferenceSelect: (reference: string) => void;
  onThemeSelect?: (theme: string) => void;
  className?: string;
  as?: React.ElementType;
}

export const ClickableText: React.FC<ClickableTextProps> = ({ text, onReferenceSelect, onThemeSelect, className, as: Component = 'span' }) => {
  if (!text) return <Component className={className}></Component>;

  const allMatches: { index: number; length: number; content: string; type: 'reference' | 'term' }[] = [];

  // Find all reference matches
  let match;
  referenceRegex.lastIndex = 0; // Reset regex state before use
  while ((match = referenceRegex.exec(text)) !== null) {
    allMatches.push({
      index: match.index,
      length: match[0].length,
      content: match[0],
      type: 'reference',
    });
  }

  // Find all term matches
  if (onThemeSelect) {
    termsRegex.lastIndex = 0; // Reset regex state before use
    while ((match = termsRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[0],
        type: 'term',
      });
    }
  }

  // Sort all matches by index, and for same index, prioritize longer match
  allMatches.sort((a, b) => {
    if (a.index !== b.index) {
      return a.index - b.index;
    }
    return b.length - a.length;
  });

  const filteredMatches: typeof allMatches = [];
  let lastMatchEnd = -1;

  // Filter out overlapping matches
  for (const currentMatch of allMatches) {
    if (currentMatch.index >= lastMatchEnd) {
      filteredMatches.push(currentMatch);
      lastMatchEnd = currentMatch.index + currentMatch.length;
    }
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  filteredMatches.forEach(matchInfo => {
    // Add text before the match
    if (matchInfo.index > lastIndex) {
      parts.push(text.substring(lastIndex, matchInfo.index));
    }

    // Add the clickable button
    if (matchInfo.type === 'reference') {
       // Re-run the local regex to capture groups correctly for this specific match
      const localRegex = new RegExp(referenceRegex.source, 'i');
      const [, bookMatch, chapter, startVerse, endVerse] = matchInfo.content.match(localRegex) || [];
      const canonicalBook = getCanonicalBookName(bookMatch);

      if (canonicalBook) {
        const reference = `${canonicalBook} ${chapter}:${startVerse}${endVerse ? `-${endVerse}` : ''}`;
        parts.push(
          <button
            key={matchInfo.index}
            onClick={(e) => {
              e.stopPropagation();
              onReferenceSelect(reference);
            }}
            className="text-accent-light hover:underline font-semibold p-0 bg-transparent border-none cursor-pointer"
          >
            {matchInfo.content}
          </button>
        );
      } else {
        parts.push(matchInfo.content);
      }
    } else if (matchInfo.type === 'term' && onThemeSelect) {
      const term = matchInfo.content;
      parts.push(
        <button
          key={matchInfo.index}
          onClick={(e) => {
            e.stopPropagation();
            onThemeSelect(term);
          }}
          className="text-secondary-accent hover:underline font-semibold p-0 bg-transparent border-none cursor-pointer"
        >
          {term}
        </button>
      );
    }

    lastIndex = matchInfo.index + matchInfo.length;
  });

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <Component className={className}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </Component>
  );
};
