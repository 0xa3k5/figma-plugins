/* eslint-disable no-unused-vars */
import { EventHandler } from '@create-figma-plugin/utilities';
import { IComponent, IComponentSet, NamingConvention } from '@repo/utils';

export interface ISearchSettings {
  caseSensitive: boolean;
  matchWholeWord: boolean;
  scope: IScope;
  toggles: Record<LintType, boolean>;
}

export type LintType = 'componentName' | 'propName' | 'propValue';

export type IScope = 'page' | 'all pages' | 'selection';

export interface ILintSettings {
  conventions: Record<LintType, NamingConvention>;
  toggles: Record<LintType, boolean>;
  applyScope: IScope;
  ignoreLocalComponents: boolean;
}
export interface ILintError extends IComponent {
  errors: {
    type: LintType;
    value: string;
    convention: NamingConvention;
  }[];
}

export interface ReplaceProperties extends EventHandler {
  name: 'REPLACE_PROPERTIES';
  handler: (
    searchKey: string,
    replace: string,
    componentSets: (IComponentSet | IComponent)[]
  ) => void;
}

export interface MatchingComponents extends EventHandler {
  name: 'MATCHING_COMPONENTS';
  handler: (componentSets: (IComponentSet | IComponent)[]) => void;
}

export interface FindComponents extends EventHandler {
  name: 'FIND_COMPONENTS';
  handler: (searchKey: string) => void;
}

export interface LintSettingsChange extends EventHandler {
  name: 'LINT_SETTINGS_CHANGE';
  handler: (settings: ILintSettings) => void;
}

export interface FindLintErrors extends EventHandler {
  name: 'FIND_LINT_ERRORS';
  handler: (lintErrors: Record<string, ILintError[]>) => void;
}

export interface FixLintErrors extends EventHandler {
  name: 'FIX_LINT_ERRORS';
  handler: (lintErrors: ILintError[]) => void;
}

export interface FindReplaceSettingsChange extends EventHandler {
  name: 'FIND_REPLACE_SETTINGS_CHANGE';
  handler: (settings: ISearchSettings) => void;
}
