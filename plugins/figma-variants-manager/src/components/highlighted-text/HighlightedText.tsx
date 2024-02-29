import { h } from 'preact';

interface HighlightedTextProps {
  highlightedPart: string;
  fullText: string;
  replace: string;
}

export default function HighlightedText({
  highlightedPart,
  fullText,
  replace,
}: HighlightedTextProps): h.JSX.Element {
  const parts = fullText.split(new RegExp(`(${highlightedPart})`, 'gi'));

  return (
    <span className="flex flex-wrap text-sm">
      {parts.map((part, index) => {
        return (
          <span
            key={index}
            className={
              part.toLowerCase() === highlightedPart.toLowerCase()
                ? 'text-text font-medium'
                : 'opacity-60'
            }
          >
            {part}
          </span>
        );
      })}
      {replace && <span className="line-through opacity-60">{replace}</span>}
    </span>
  );
}
