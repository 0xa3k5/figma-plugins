import { convertString } from '@repo/utils';
import { h } from 'preact';

import { ILintError, ILintSettings, LintType } from '../../../types';

interface LintDisplayProps {
  error: ILintError;
  lintSettings: ILintSettings;
}

export default function LintDisplay({
  error,
  lintSettings,
}: LintDisplayProps): h.JSX.Element {
  const correctedName = replaceLogic({
    lintSettings,
    error: error.errors[0],
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <span className="text-text-secondary line-through">
          {error.errors[0].value}
        </span>
        <span className="text-text">-&gt; {correctedName}</span>
      </div>
    </div>
  );
}

const replaceLogic = ({
  lintSettings,
  error,
}: {
  lintSettings: ILintSettings;
  error: {
    type: LintType;
    value: string;
  };
}) => {
  switch (error.type) {
    case 'componentName':
      return convertString({
        str: error.value,
        convention: lintSettings.conventions.componentName,
      });
    case 'propName':
      return convertString({
        str: error.value,
        convention: lintSettings.conventions.propName,
      });
    case 'propValue':
      return convertString({
        str: error.value,
        convention: lintSettings.conventions.propValue,
      });
  }
};
