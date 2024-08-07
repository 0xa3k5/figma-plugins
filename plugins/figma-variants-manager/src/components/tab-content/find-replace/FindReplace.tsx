import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  ChoiceChip,
  IconCaseSensitive,
  IconChip,
  IconWholeWord,
  TextInput,
} from '@repo/ui';
import {
  ComponentFocusHandler,
  convertString,
  groupComponentsByParent,
  IComponent,
  IComponentSet,
} from '@repo/utils';
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import {
  FindComponents,
  FindReplaceSettingsChange,
  IScope,
  ISearchSettings,
  LintType,
  MatchingComponents,
  ReplaceProperties,
} from '../../../types';
import { ButtonDock } from '../../button';
import { EmptyState } from '../../empty-state';
import { Layout } from '../../Layout';
import ScopeSelector from '../../scope-selector/ScopeSelector';
import FindReplaceGroupCard from './FindReplaceGroupCard';

export default function FindReplace(): h.JSX.Element {
  const categories: LintType[] = ['propName', 'propValue'];
  const [searchKey, setSearchKey] = useState('');
  const [replace, setReplacement] = useState('');

  const [replaceQue, setReplaceQue] = useState<(IComponentSet | IComponent)[]>(
    []
  );
  const [matchingComps, setMatchingComps] = useState<Record<
    string,
    (IComponentSet | IComponent)[]
  > | null>();

  const [searchSettings, setSearchSettings] = useState<ISearchSettings>({
    caseSensitive: false,
    matchWholeWord: false,
    scope: 'page',
    toggles: {
      componentName: true,
      propName: true,
      propValue: true,
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchKey) {
        emit<FindComponents>('FIND_COMPONENTS', searchKey);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchKey, searchSettings]);

  on<MatchingComponents>('MATCHING_COMPONENTS', (componentSets) => {
    const groupedComponents = groupComponentsByParent(componentSets);

    setMatchingComps(groupedComponents);
    setReplaceQue(groupedComponents[Object.keys(groupedComponents)[0]]);

    const firstGroup = Object.values(groupedComponents)[0];

    if (firstGroup && firstGroup.length > 0) {
      emit<ComponentFocusHandler>('FOCUS_COMPONENT', firstGroup[0].id);
    }
  });

  const handleReplace = (componentSets: (IComponentSet | IComponent)[]) => {
    emit<ReplaceProperties>(
      'REPLACE_PROPERTIES',
      searchKey,
      replace,
      componentSets
    );
  };

  const handleReplaceAll = () => {
    handleReplace(Object.values(matchingComps ?? {}).flat());
  };

  const handleComponentSelect = (
    parentId: string,
    componentSets: (IComponentSet | IComponent)[]
  ) => {
    setReplaceQue(componentSets);
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  const handleScopeChange = (opt: IScope) => {
    setSearchSettings({
      ...searchSettings,
      scope: opt,
    });
  };

  useEffect(() => {
    emit<FindReplaceSettingsChange>(
      'FIND_REPLACE_SETTINGS_CHANGE',
      searchSettings
    );
  }, [searchSettings]);

  // todo
  const renderEmptyState = () => {
    if (searchKey) {
      if (matchingComps && Object.entries(matchingComps).length === 0) {
        return (
          <EmptyState className="py-4">
            <span className="flex w-full items-start">
              {`no property named: ${searchKey}`}
            </span>
          </EmptyState>
        );
      }
    }
  };

  return (
    <Fragment>
      <Layout>
        <div className="border-border bg-bg sticky inset-0 z-10 -mx-4 flex flex-col gap-4 border-b p-4">
          <div className="flex flex-col gap-2">
            <ScopeSelector
              label="Search in"
              currentScope={searchSettings.scope}
              onChange={handleScopeChange}
            />
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
            <TextInput
              label="replace with"
              placeholder="Replace with..."
              value={replace}
              onInput={(e) => setReplacement(e.currentTarget.value)}
            />
          </div>
          <div className="no-scrollbar flex w-fit gap-1 overflow-x-scroll">
            {categories.map((category) => {
              return (
                <ChoiceChip
                  id={`${category}_${category}`}
                  checked={searchSettings.toggles[category]}
                  onChange={() =>
                    setSearchSettings({
                      ...searchSettings,
                      toggles: {
                        ...searchSettings.toggles,
                        [category]: !searchSettings.toggles[category],
                      },
                    })
                  }
                  value={convertString({
                    str: category,
                    convention: 'Title Case',
                  })}
                />
              );
            })}
          </div>
        </div>
        {searchKey ? (
          matchingComps && Object.entries(matchingComps).length > 0 ? (
            <div className="-mx-4 flex h-full flex-col gap-1 pt-4">
              {Object.entries(matchingComps).map((comps) => {
                return (
                  <FindReplaceGroupCard
                    replace={replace}
                    searchKey={searchKey}
                    key={comps[0]}
                    matchingComps={comps}
                    replaceQue={replaceQue}
                    handleCompSelect={handleComponentSelect}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState className="py-4">{`no property named: ${searchKey}`}</EmptyState>
          )
        ) : (
          <EmptyState className="py-4">
            <span className="flex w-full items-start">{`no property named: ${searchKey}`}</span>
          </EmptyState>
        )}
      </Layout>
      <ButtonDock>
        <div className="flex w-full gap-2">
          <Button
            disabled={replace.trim() === ''}
            onClick={() => handleReplace(replaceQue)}
            secondary
          >
            Replace
          </Button>
          <Button disabled={replace.trim() === ''} onClick={handleReplaceAll}>
            Replace All
          </Button>
        </div>
      </ButtonDock>
    </Fragment>
  );
}
