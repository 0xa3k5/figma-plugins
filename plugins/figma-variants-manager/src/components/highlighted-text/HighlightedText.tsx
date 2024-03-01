import { Fragment, h } from 'preact';

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
  const regex = new RegExp(`(${highlightedPart})`, 'gi');
  const parts = fullText.split(regex);

  const renderReplace = (text: string) => {
    return text
      .split('')
      .map((char, index) =>
        char === ' ' ? <span key={index}>&nbsp;</span> : char
      );
  };

  return (
    <span className="flex flex-wrap text-sm">
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === highlightedPart.toLowerCase();

        return (
          <span
            key={index}
            className={
              isMatch ? 'text-text font-medium' : 'text-text-secondary'
            }
          >
            {isMatch && replace ? (
              <Fragment>
                <span className="text-text-secondary line-through">{part}</span>
                <span className="">{renderReplace(replace)}</span>
              </Fragment>
            ) : (
              <span>{part}</span>
            )}
          </span>
        );
      })}
    </span>
  );
  // const parts = fullText.split(new RegExp(`(${highlightedPart})`, 'gi'));

  // return (
  //   <span className="flex flex-wrap text-sm">
  //     {parts.map((part, index) => {
  //       return (
  //         <span
  //           key={index}
  //           className={
  //             part.toLowerCase() === highlightedPart.toLowerCase()
  //               ? 'text-text font-medium'
  //               : 'opacity-60'
  //           }
  //         >
  //           {part}
  //         </span>
  //       );
  //     })}
  //     {replace && <span className="line-through opacity-60">{replace}</span>}
  //   </span>
  // );
}
