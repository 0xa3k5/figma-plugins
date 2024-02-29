import { Button, IconButton, Stack } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  ChoiceChip,
  IconCaseSensitive,
  IconChip,
  IconComponent,
  IconTarget,
  IconWholeWord,
  TextInput,
} from '@repo/ui';
import {
  ComponentFocusHandler,
  groupComponentsByParent,
  IComponent,
} from '@repo/utils';
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import {
  FindComponents,
  IScope,
  ISearchSettings,
  MatchingComponents,
  ReplaceProperties,
} from '../../types';
import HighlightedText from '../highlighted-text/HighlightedText';

export default function FindReplace(): h.JSX.Element {
  const [searchKey, setSearchKey] = useState('');
  const [replace, setReplacement] = useState('');

  const [replaceComps, setReplaceComps] = useState<IComponent[]>([]);
  const [matchingComps, setMatchingComps] = useState<Record<
    string,
    IComponent[]
  > | null>();

  const searchscope: IScope[] = ['selection', 'page', 'all pages'];

  const [searchSettings, setSearchSettings] = useState<ISearchSettings>({
    caseSensitive: false,
    matchWholeWord: false,
    scope: searchscope[1],
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchKey) {
        emit<FindComponents>('FIND_COMPONENTS', searchKey, searchSettings);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchKey, searchSettings]);

  on<MatchingComponents>('MATCHING_COMPONENTS', (components) => {
    const groupedComponents = groupComponentsByParent(components);

    setMatchingComps(groupedComponents);
    setReplaceComps(groupedComponents[Object.keys(groupedComponents)[0]]);

    const firstGroup = Object.values(groupedComponents)[0];

    if (firstGroup && firstGroup.length > 0) {
      emit<ComponentFocusHandler>('FOCUS_COMPONENT', firstGroup[0].id);
    }
  });

  const handleReplace = (components: IComponent[]) => {
    emit<ReplaceProperties>(
      'REPLACE_PROPERTIES',
      searchKey,
      replace,
      components
    );
    emit<FindComponents>('FIND_COMPONENTS', searchKey, searchSettings);
  };

  const handleReplaceAll = () => {
    handleReplace(Object.values(matchingComps ?? {}).flat());
  };

  const handleComponentTarget = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  const handleComponentSelect = (
    parentId: string,
    components: IComponent[]
  ) => {
    setReplaceComps(components);
    if (components.length > 0) {
      emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
    }
  };

  return (
    <Fragment>
      <div className="border-border bg-bg sticky inset-0 z-10 flex w-full flex-col gap-4 border-b p-4">
        <Stack space="small">
          <div className="flex items-center gap-1">
            <span className="text-text-secondary mr-2">Search in</span>
            {searchscope.map((opt) => (
              <ChoiceChip
                id={opt}
                key={opt}
                value={opt}
                checked={opt === searchSettings.scope}
                onChange={() =>
                  setSearchSettings({
                    ...searchSettings,
                    scope: opt,
                  })
                }
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-full">
              <TextInput
                label="search"
                placeholder="Search variants"
                value={searchKey}
                onInput={(e) => setSearchKey(e.currentTarget.value)}
              >
                <div className="flex gap-1">
                  <IconChip
                    icon={<IconCaseSensitive />}
                    label="Case Sensitive"
                    tooltip="Case Sensitive"
                    onChange={() =>
                      setSearchSettings({
                        ...searchSettings,
                        caseSensitive: !searchSettings.caseSensitive,
                      })
                    }
                  />
                  <IconChip
                    icon={<IconWholeWord />}
                    label="Match Whole Word"
                    tooltip="Match Whole Word"
                    onChange={() =>
                      setSearchSettings({
                        ...searchSettings,
                        matchWholeWord: !searchSettings.matchWholeWord,
                      })
                    }
                  />
                </div>
              </TextInput>
            </div>
          </div>
          <TextInput
            label="replace with"
            placeholder="Replace with..."
            value={replace}
            onInput={(e) => setReplacement(e.currentTarget.value)}
          />
        </Stack>
        <div className="flex items-center justify-between">
          <div className="flex w-full gap-2">
            <Button
              disabled={replace.trim() === ''}
              onClick={() => handleReplace(replaceComps)}
              secondary
            >
              Replace
            </Button>
            <Button
              disabled={replace.trim() === ''}
              onClick={handleReplaceAll}
              secondary
            >
              Replace All
            </Button>
          </div>
        </div>
      </div>
      {matchingComps && (
        <ul className="flex flex-col pt-4">
          {Object.entries(matchingComps).map(([parentId, components]) => {
            const uniqueProps = new Set<string>(
              components
                .flatMap((comp) => comp.properties ?? [])
                .filter(Boolean)
            );

            return (
              <li key={parentId}>
                <button
                  type="button"
                  className={`group ${replaceComps.includes(components[0]) ? 'bg-bg-selected bg-opacity-20' : ''} flex w-full cursor-default justify-between gap-3 px-4 py-1 text-sm`}
                  onClick={() => handleComponentSelect(parentId, components)}
                >
                  <span className="flex items-start">
                    <span className="text-text-component">
                      <IconComponent />
                    </span>
                    <span className="flex flex-col items-start gap-1 py-1">
                      <span className="text-text-component text-xs">
                        {components[0].parent?.name ?? components[0].name}
                      </span>
                      {searchKey.length > 0 &&
                        uniqueProps.size > 0 &&
                        Array.from(uniqueProps).map((prop) => (
                          <HighlightedText
                            key={prop}
                            highlightedPart={searchKey}
                            fullText={prop}
                            replace={replace}
                          />
                        ))}
                    </span>
                  </span>
                  <IconButton
                    onClick={() => handleComponentTarget(parentId)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <IconTarget />
                  </IconButton>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Fragment>
  );
}
