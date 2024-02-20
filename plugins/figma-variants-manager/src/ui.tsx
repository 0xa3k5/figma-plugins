// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import '!./output.css';
import {
  Button,
  Stack,
  render,
  useWindowResize,
} from '@create-figma-plugin/ui';
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  FindComponents,
  IComponent,
  MatchingComponents,
  ReplaceProperties,
  ResizeWindowHandler,
  ComponentTargetHandler,
  ISearchSettings,
} from './types';
import IconButton from './components/button/IconButton';
import {
  IconCaseSensitive,
  IconComponent,
  IconTarget,
  IconWholeWord,
} from './components/icons';
import HighlightedText from './components/highlighted-text/HighlightedText';
import groupByParent from './utils';
import TextInput from './components/input';
import { ChoiceChip, IconChip } from './components/chip';

function Plugin() {
  const [searchKey, setSearchKey] = useState('');
  const [replace, setReplacement] = useState('');

  const [replaceComps, setReplaceComps] = useState<IComponent[]>([]);
  const [matchingComps, setMatchingComps] = useState<Record<
    string,
    IComponent[]
  > | null>();

  const searchScopeOpts: ISearchSettings['searchScope'][] = [
    'Selection',
    'Page',
    'All Pages',
  ];

  const [searchSettings, setSearchSettings] = useState<ISearchSettings>({
    caseSensitive: false,
    matchWholeWord: false,
    searchScope: searchScopeOpts[1],
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
    const groupedComponents = groupByParent(components);
    setMatchingComps(groupedComponents);
    setReplaceComps(groupedComponents[Object.keys(groupedComponents)[0]]);

    const firstGroup = Object.values(groupedComponents)[0];
    if (firstGroup && firstGroup.length > 0) {
      emit<ComponentTargetHandler>('TARGET_COMPONENT', firstGroup[0].id);
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
    emit<ComponentTargetHandler>('TARGET_COMPONENT', parentId);
  };

  const handleComponentSelect = (
    parentId: string,
    components: IComponent[]
  ) => {
    setReplaceComps(components);
    if (components.length > 0) {
      emit<ComponentTargetHandler>('TARGET_COMPONENT', parentId);
    }
  };

  function onWindowResize(windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize);
  }

  useWindowResize(onWindowResize, {
    maxHeight: 720,
    maxWidth: 720,
    minHeight: 320,
    minWidth: 320,
    resizeBehaviorOnDoubleClick: 'minimize',
  });

  return (
    <Fragment>
      <div className="sticky inset-0 z-10 flex w-full flex-col gap-4 border-b border-border bg-bg p-4">
        <Stack space="small">
          <div className="flex items-center gap-1">
            <span className="mr-2 text-text-secondary">Search in</span>
            {searchScopeOpts.map((opt) => (
              <ChoiceChip
                key={opt}
                value={opt}
                checked={opt === searchSettings.searchScope}
                onChange={() =>
                  setSearchSettings({
                    ...searchSettings,
                    searchScope: opt,
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

          {/* <IconButton
            // className={

            //     ? 'bg-bg-secondary'
            //     : ''
            // }
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <IconMenu />
          </IconButton> */}

          {/* <div className="relative mt-8" ref={menuRef}>
            {isDropdownVisible && (
              <Menu
                options={menuOptions}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            )}
          </div> */}
        </div>
      </div>
      {matchingComps && (
        <ul className="flex flex-col pt-4">
          {Object.entries(matchingComps).map(([parentId, components]) => {
            const uniqueProps = new Set(
              components.flatMap((comp) => comp.matchedProps)
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
                      <span className="text-xs text-text-component">
                        {components[0].parent?.name ?? components[0].name}
                      </span>
                      {searchKey.length > 0 &&
                        Array.from(uniqueProps).map((prop) => (
                          <HighlightedText
                            key={prop}
                            text={[prop]}
                            searchKey={searchKey}
                            replace={replace}
                            searchSettings={searchSettings}
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

export default render(Plugin);
