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
  setIsExpanded: (parentId: string) => void;
}

export default function LintComponentHeader({
  parentId,
  errors,
  isExpanded,
  setIsExpanded,
}: Props): h.JSX.Element {
  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  return (
    <button
      type="button"
      onClick={() => setIsExpanded(parentId)}
      className="flex w-full justify-between hover:cursor-default"
    >
      <span className="text-text-component flex items-center gap-1">
        <span
          className={`${isExpanded ? 'rotate-90' : ''} text-text-tertiary -mr-1 duration-150`}
        >
          <IconExpandChevron />
        </span>
        <IconComponent />
        <span className={`text-xs font-semibold capitalize`}>
          {errors[0]?.parent?.name ?? errors[0]?.name}
        </span>
      </span>
      <IconButton
        onClick={() => handleFocusComponents(parentId)}
        className="opacity-0 group-hover:opacity-100"
      >
        <IconTarget />
      </IconButton>
    </button>
  );
}
