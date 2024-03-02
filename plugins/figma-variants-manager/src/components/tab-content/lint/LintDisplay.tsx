import { convertString, NamingConvention } from '@repo/utils';
import { h } from 'preact';

import { ILintError, LintType } from '../../../types';

interface LintDisplayProps {
  error: ILintError;
}

export default function LintDisplay({
  error,
}: LintDisplayProps): h.JSX.Element {
  return (
    <div className="ml-5 flex w-full flex-col gap-2 whitespace-nowrap">
      {error.errors.map((err, index) => (
        <div key={index} className="flex w-full items-center gap-1">
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
