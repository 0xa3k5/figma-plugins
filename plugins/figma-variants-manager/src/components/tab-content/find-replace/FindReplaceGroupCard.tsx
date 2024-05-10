import { emit } from '@create-figma-plugin/utilities';
import { IconComponent, IconTarget } from '@repo/ui';
import { ComponentFocusHandler, IComponentSet } from '@repo/utils';
import { h } from 'preact';

import { IconButton } from '../../button';
import HighlightedText from '../../highlighted-text/HighlightedText';

interface Props {
  searchKey: string;
  replace: string;
  matchingComps: [string, IComponentSet[]];
  replaceQue: IComponentSet[];
  handleCompSelect: (parentId: string, components: IComponentSet[]) => void;
}

export default function FindReplaceGroupCard({
  searchKey,
  replace,
  matchingComps,
  replaceQue,
  handleCompSelect,
}: Props): h.JSX.Element {
  const [parentId, components] = matchingComps;

  const uniquePropNames = new Set(
    components.flatMap((comp) =>
      comp.properties ? Object.keys(comp.properties) : []
    )
  );

  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  return (
    <button
      key={`${parentId}_${components[0].id}`}
      className={`group flex w-full cursor-default justify-between px-4 py-1 ${
        replaceQue.includes(components[0]) ? 'bg-bg-selected-tertiary' : ''
      }`}
      onClick={() => handleCompSelect(parentId, components)}
    >
      <span className="flex w-full">
        <span className="text-text-component">
          <IconComponent />
        </span>
        <span className="flex flex-col items-start gap-1 py-1">
          <span className="text-text-component text-xs">
            {components[0].name}
          </span>
          {searchKey.length > 0 &&
            uniquePropNames.size > 0 &&
            Array.from(uniquePropNames).map((propName) => (
              <HighlightedText
                key={propName}
                highlightedPart={searchKey}
                fullText={propName}
                replace={replace}
              />
            ))}
        </span>
      </span>
      <IconButton
        onClick={() => handleFocusComponents(parentId)}
        className="opacity-0 duration-150 group-hover:opacity-100"
      >
        <IconTarget />
      </IconButton>
    </button>
  );
}
