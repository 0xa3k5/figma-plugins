import { EventHandler } from '@create-figma-plugin/utilities';
import { IComponent, IComponentSet, NamingConvention } from '@repo/utils';
export interface ISearchSettings {
  caseSensitive: boolean;
  matchWholeWord: boolean;
  scope: IScope;
}

export type LintType = 'componentName' | 'propName' | 'propValue';

export type IScope = 'selection' | 'page' | 'all pages';

export interface ILintSettings {
  conventions: Record<LintType, NamingConvention>;
  toggles: Record<LintType, boolean>;
  applyScope: IScope;
}
export interface ILintError extends IComponent {
  errors: {
    type: LintType;
    value: string;
  }[];
}

export interface ReplaceProperties extends EventHandler {
  name: 'REPLACE_PROPERTIES';
  handler: (
    searchKey: string,
    replace: string,
    components: IComponent[]
  ) => void;
}

export interface MatchingComponents extends EventHandler {
  name: 'MATCHING_COMPONENTS';
  handler: (components: IComponent[]) => void;
}

export interface FindComponents extends EventHandler {
  name: 'FIND_COMPONENTS';
  handler: (searchKey: string, searchSettings: ISearchSettings) => void;
}

export interface HandleSelectionChange extends EventHandler {
  name: 'HANDLE_SELECTION_CHANGE';
  handler: (components: (IComponent | IComponentSet)[]) => void;
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
