import { EventHandler } from '@create-figma-plugin/utilities';
import { IComponent } from '@repo/utils';
export interface ISearchSettings {
  caseSensitive: boolean;
  matchWholeWord: boolean;
  searchScope: 'Selection' | 'Page' | 'All Pages';
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
