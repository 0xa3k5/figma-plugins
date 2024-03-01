import { convertString, NamingConvention } from '@repo/utils';
import { h } from 'preact';

import { ILintError, LintType } from '../../../types';

interface LintDisplayProps {
  error: ILintError;
  onToggleErrorSelection: (error: ILintError, isSelected: boolean) => void;
  isSelected: boolean;
}

export default function LintDisplay({
  error,
  onToggleErrorSelection,
  isSelected,
}: LintDisplayProps): h.JSX.Element {
  const handleCheckboxChange = (
    event: h.JSX.TargetedEvent<HTMLInputElement>
  ) => {
    onToggleErrorSelection(error, event.currentTarget.checked);
  };

  return (
    <div className="flex w-full flex-col gap-1 whitespace-nowrap">
      {error.errors.map((err, index) => (
        <div key={index} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
          />
          <span className="text-text-secondary line-through">{err.value}</span>
          <span className="text-text">-&gt; {replaceLogic(err)}</span>
        </div>
      ))}
    </div>
  );
}

const replaceLogic = (error: {
  type: LintType;
  value: string;
  convention: NamingConvention;
}) => {
  switch (error.type) {
    case 'componentName':
      return convertString({
        str: error.value,
        convention: error.convention,
      });
    case 'propName':
      return convertString({
        str: error.value,
        convention: error.convention,
      });
    case 'propValue':
      return convertString({
        str: error.value,
        convention: error.convention,
      });
  }
};
