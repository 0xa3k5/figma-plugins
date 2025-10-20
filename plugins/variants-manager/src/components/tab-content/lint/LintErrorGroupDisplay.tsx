import { IconExpandChevron } from '@repo/ui';
import { convertString } from '@repo/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { ILintError, LintType } from '../../../types';
import LintDisplay from './LintDisplay';

interface Props {
  className?: string;
  category: LintType;
  uniqueErrors: ILintError[];
}

export default function LintErrorGroupDisplay({
  className,
  category,
  uniqueErrors,
}: Props): h.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <button
      key={category}
      className={`${className} flex w-fit cursor-default flex-col gap-2`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <span className="flex items-center gap-1">
        <span
          className={`text-text-tertiary opacity-0 duration-150 group-hover:opacity-100 ${isExpanded ? 'rotate-90' : ''}`}
        >
          <IconExpandChevron />
        </span>
        <span className="text-text-danger">
          {convertString({
            str: `${category} • ${uniqueErrors.length}`,
            convention: 'Title Case',
          })}
        </span>
      </span>
      {isExpanded &&
        uniqueErrors.map((error, index) => (
          <LintDisplay key={`${category}-${error.id}-${index}`} error={error} />
        ))}
    </button>
  );
}
