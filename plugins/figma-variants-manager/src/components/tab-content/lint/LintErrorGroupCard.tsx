import { h } from 'preact';
import { StateUpdater, useState } from 'preact/hooks';

import { ILintError, LintType } from '../../../types';
import LintComponentHeader from './LintComponentHeader';
import LintErrorGroupDisplay from './LintErrorGroupDisplay';

interface Props {
  className?: string;
  errorGroup: [string, ILintError[]];
  selectedErrors: ILintError[];
  setSelectedErrors: StateUpdater<ILintError[]>;
}

const categories: LintType[] = ['componentName', 'propName', 'propValue'];

export default function LintErrorGroupCard({
  className,
  errorGroup,
  selectedErrors,
  setSelectedErrors,
}: Props): h.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  const [parentId, errors] = errorGroup;

  const getUniqueErrorsByType = (
    errors: ILintError[],
    type: LintType
  ): ILintError[] => {
    const uniqueErrors = new Map<string, ILintError>();

    errors.forEach((error) => {
      error.errors
        .filter((err) => err.type === type)
        .forEach((err) => {
          const key = `${type}-${err.value}`;

          if (!uniqueErrors.has(key)) {
            uniqueErrors.set(key, { ...error, errors: [err] });
          }
        });
    });

    return Array.from(uniqueErrors.values());
  };

  const isSelected = errors.some((err) => selectedErrors.includes(err));

  return (
    <div
      key={parentId}
      className={`${className} ${isSelected ? 'bg-bg-selected-secondary' : 'bg-bg'} border-border group flex w-full flex-col gap-2 overflow-clip border-t p-2`}
    >
      <LintComponentHeader
        errors={errors}
        parentId={parentId}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        setSelectedErrors={setSelectedErrors}
      />
      {isExpanded && (
        <div className="no-scrollbar flex w-full flex-col gap-2 overflow-x-scroll pl-2">
          {categories.map((category) => {
            const uniqueErrors = getUniqueErrorsByType(
              Object.values(errorGroup[1]).flat(),
              category
            );

            return uniqueErrors.length > 0 ? (
              <LintErrorGroupDisplay
                className="last-of-type:mb-2"
                key={category}
                category={category}
                uniqueErrors={uniqueErrors}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
