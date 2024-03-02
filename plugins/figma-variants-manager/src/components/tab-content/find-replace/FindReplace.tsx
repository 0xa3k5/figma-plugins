import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  IconCaseSensitive,
  IconChip,
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
  FindReplaceSettingsChange,
  IScope,
  ISearchSettings,
  MatchingComponents,
  ReplaceProperties,
} from '../../../types';
import { ButtonDock } from '../../button';
import { EmptyState } from '../../empty-state';
import { Layout } from '../../Layout';
import ScopeSelector from '../../scope-selector/ScopeSelector';
import FindReplaceGroupCard from './FindReplaceGroupCard';

export default function FindReplace(): h.JSX.Element {
  const [searchKey, setSearchKey] = useState('');
  const [replace, setReplacement] = useState('');

  const [replaceQue, setReplaceQue] = useState<IComponent[]>([]);
  const [matchingComps, setMatchingComps] = useState<Record<
    string,
    IComponent[]
  > | null>();

  const [searchSettings, setSearchSettings] = useState<ISearchSettings>({
    caseSensitive: false,
    matchWholeWord: false,
    scope: 'page',
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchKey) {
        emit<FindComponents>('FIND_COMPONENTS', searchKey);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchKey, searchSettings]);

  on<MatchingComponents>('MATCHING_COMPONENTS', (components) => {
    const groupedComponents = groupComponentsByParent(components);

    setMatchingComps(groupedComponents);
    setReplaceQue(groupedComponents[Object.keys(groupedComponents)[0]]);

    const firstGroup = Object.values(groupedComponents)[0];

    if (firstGroup && firstGroup.length > 0) {
      emit<ComponentFocusHandler>(
        'FOCUS_COMPONENT',
        firstGroup[0].parent?.id ?? firstGroup[0].id
      );
    }
  });

  const handleReplace = (components: IComponent[]) => {
    emit<ReplaceProperties>(
      'REPLACE_PROPERTIES',
      searchKey,
      replace,
      components
    );
  };

  const handleReplaceAll = () => {
    handleReplace(Object.values(matchingComps ?? {}).flat());
  };

  const handleComponentSelect = (
    parentId: string,
    components: IComponent[]
  ) => {
    setReplaceQue(components);
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
