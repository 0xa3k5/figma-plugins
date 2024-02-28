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
  console.log('highlightedPart', highlightedPart);
  console.log('fullText', fullText);
  console.log('replace', replace);
  const parts = fullText.split(new RegExp(`(${highlightedPart})`, 'gi'));

  return (
    <span className="flex flex-wrap text-sm">
      {parts.map((part, index) => {
        console.log('part', part);
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

// interface Props {
//   text: string[];
//   searchKey: string;
//   replace: string;
//   searchSettings: ISearchSettings;
// }

// export default function HighlightedText({
//   text,
//   searchKey,
//   replace,
//   searchSettings,
// }: Props): h.JSX.Element {
//   const regex = new RegExp(
//     searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
//     searchSettings.caseSensitive ? '' : 'i'
//   );

//   const renderReplace = (rplc: string) => {
//     return rplc
//       .split('')
//       .map((char, index) =>
//         char === ' ' ? <span key={index}>&nbsp;</span> : char
//       );
//   };

//   return (
//     <span className="flex flex-wrap text-sm">
//       {text.map((t, index) => (
//         <span key={index} className="mr-2 flex last:mr-0">
//           {t === searchKey ? (
//             <span className="text-text font-medium">
//               <span className={replace ? 'line-through opacity-60' : ''}>
//                 {searchKey}
//               </span>
//               {renderReplace(replace)}
//             </span>
//           ) : (
//             t.split(regex).map((part, partIndex) => (
//               <span
//                 key={partIndex}
//                 className={part === '' ? 'text-text font-medium' : 'opacity-60'}
//               >
//                 {part === '' ? (
//                   <span>
//                     <span className={replace ? 'line-through opacity-60' : ''}>
//                       {searchKey}
//                     </span>
//                     {renderReplace(replace)}
//                   </span>
//                 ) : (
//                   part
//                 )}
//               </span>
//             ))
//           )}
//         </span>
//       ))}
//     </span>
//   );
// }
