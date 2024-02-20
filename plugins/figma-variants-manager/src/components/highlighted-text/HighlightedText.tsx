/* eslint-disable react/no-array-index-key */
import { h, JSX } from 'preact';
import { ISearchSettings } from '../../types';

interface Props {
  text: string[];
  searchKey: string;
  replace: string;
  searchSettings: ISearchSettings;
}

export default function HighlightedText({
  text,
  searchKey,
  replace,
  searchSettings,
}: Props): JSX.Element {
  const regex = new RegExp(
    searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
    searchSettings.caseSensitive ? '' : 'i'
  );

  const renderReplace = (rplc: string) => {
    return rplc
      .split('')
      .map((char, index) =>
        char === ' ' ? <span key={index}>&nbsp;</span> : char
      );
  };

  return (
    <span className="flex flex-wrap text-sm">
      {text.map((t, index) => (
        <span key={index} className="mr-2 flex last:mr-0">
          {t === searchKey ? (
            <span className="font-medium text-text">
              <span className={replace ? 'line-through opacity-60' : ''}>
                {searchKey}
              </span>
              {renderReplace(replace)}
            </span>
          ) : (
            t.split(regex).map((part, partIndex) => (
              <span
                key={partIndex}
                className={part === '' ? 'font-medium text-text' : 'opacity-60'}
              >
                {part === '' ? (
                  <span>
                    <span className={replace ? 'line-through opacity-60' : ''}>
                      {searchKey}
                    </span>
                    {renderReplace(replace)}
                  </span>
                ) : (
                  part
                )}
              </span>
            ))
          )}
        </span>
      ))}
    </span>
  );
}
