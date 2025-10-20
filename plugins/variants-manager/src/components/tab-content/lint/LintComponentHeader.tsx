import { emit } from '@create-figma-plugin/utilities';
import { IconComponent, IconExpandChevron, IconTarget } from '@repo/ui';
import { ComponentFocusHandler } from '@repo/utils';
import { h } from 'preact';

import { ILintError } from '../../../types';
import { IconButton } from '../../button';

interface Props {
  parentId: string;
  errors: ILintError[];
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  selectedErrors: ILintError[];
  setSelectedErrors: (value: ILintError[]) => void;
}

export default function LintComponentHeader({
  parentId,
  errors,
  isExpanded,
  setIsExpanded,
  selectedErrors,
  setSelectedErrors,
}: Props): h.JSX.Element {
  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  const handleSelectedError = (error: ILintError[]) => {
    setSelectedErrors(selectedErrors.includes(error[0]) ? [] : error);
  };

  return (
    <button
      onClick={() => {
        handleSelectedError(errors);
      }}
      className="flex w-full items-center justify-between"
    >
      <button
        type="button"
        className="text-text-component flex w-fit items-center gap-1 hover:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          className={`${isExpanded ? 'rotate-90' : ''} text-text-tertiary -mr-1 duration-150`}
        >
          <IconExpandChevron />
        </span>
        <IconComponent />
        <span className={`text-xs font-semibold capitalize`}>
          {errors[0]?.parent?.name ?? errors[0]?.name}
        </span>
      </button>
      <IconButton
        onClick={() => handleFocusComponents(parentId)}
        className="opacity-0 group-hover:opacity-100"
      >
        <IconTarget />
      </IconButton>
    </button>
  );
}
