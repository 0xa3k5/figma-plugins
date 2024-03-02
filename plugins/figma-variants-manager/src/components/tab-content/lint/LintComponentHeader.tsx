import { emit, on } from '@create-figma-plugin/utilities';
import { IconComponent, IconExpandChevron, IconTarget } from '@repo/ui';
import { ComponentFocusHandler } from '@repo/utils';
import { h } from 'preact';
import { StateUpdater } from 'preact/hooks';

import { ILintError } from '../../../types';
import { IconButton } from '../../button';

interface Props {
  parentId: string;
  errors: ILintError[];
  isExpanded: boolean;
  setIsExpanded: StateUpdater<boolean>;
  setSelectedErrors: StateUpdater<ILintError[]>;
}

export default function LintComponentHeader({
  parentId,
  errors,
  isExpanded,
  setIsExpanded,
  setSelectedErrors,
}: Props): h.JSX.Element {
  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  const handleSelectedError = (error: ILintError[]) => {
    setSelectedErrors((prev) => (prev.includes(error[0]) ? [] : error));
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
