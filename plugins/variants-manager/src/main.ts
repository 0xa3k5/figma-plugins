import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  ComponentFocusHandler,
  focusOnNodes,
  ResizeWindowHandler,
} from '@repo/utils';

import { fixLintErrors } from './ops/fix-lint-errors';
import { replaceMatchingProps } from './ops/replace-matching-props';
import {
  FindComponents,
  FindLintErrors,
  FindReplaceSettingsChange,
  FixLintErrors,
  ILintSettings,
  ISearchSettings,
  LintSettingsChange,
  MatchingComponents,
  ReplaceProperties,
} from './types';
import { findLintErrors, findMatchingComponents } from './utils';

let lintSettings: ILintSettings;
let searchSettings: ISearchSettings;

export default async function () {
  showUI({ width: 320, height: 480 });

  await figma.loadAllPagesAsync();

  on<ComponentFocusHandler>('FOCUS_COMPONENT', (parentId) => {
    focusOnNodes({
      nodeIds: [parentId],
      nodeTypes: ['COMPONENT', 'COMPONENT_SET'],
    });
  });

  on<ResizeWindowHandler>('RESIZE_WINDOW', (windowSize) => {
    const { width, height } = windowSize;

    figma.ui.resize(width, height);
  });

  on<ReplaceProperties>(
    'REPLACE_PROPERTIES',
    (searchKey, replacement, componentSets) => {
      replaceMatchingProps(
        searchKey,
        replacement,
        componentSets,
        searchSettings
      );
      // emit<FindComponents>('FIND_COMPONENTS', searchKey);
    }
  );

  on<FindComponents>('FIND_COMPONENTS', async (searchKey) => {
    const matchingComps = await findMatchingComponents(
      searchKey,
      searchSettings
    );

    emit<MatchingComponents>('MATCHING_COMPONENTS', matchingComps);
  });

  on<FindReplaceSettingsChange>('FIND_REPLACE_SETTINGS_CHANGE', (settings) => {
    searchSettings = settings;
  });

  on<LintSettingsChange>('LINT_SETTINGS_CHANGE', async (settings) => {
    lintSettings = settings;
    const lintErrors = await findLintErrors(lintSettings);

    emit<FindLintErrors>('FIND_LINT_ERRORS', lintErrors);
  });

  on<FixLintErrors>('FIX_LINT_ERRORS', async (lintErrors) => {
    await fixLintErrors(lintErrors);

    const newLintErrors = await findLintErrors(lintSettings);

    emit<FindLintErrors>('FIND_LINT_ERRORS', newLintErrors);
  });
}
