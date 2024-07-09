import { EventHandler } from '@create-figma-plugin/utilities';

export interface IComponent {
  id: string;
  name: string;
  parent?: IComponentSet;
  isSet?: boolean;
  page?: PageNode;
  remote: boolean;
  properties?: ComponentPropertyDefinitions | null;
  key?: string;
  visible?: boolean;
}

export interface IInstance {
  id: string;
  name: string;
  mainComponent?: IComponent;
  page?: PageNode;
  parent?: BaseNode;
  visible?: boolean;
}

export interface IComponentSet {
  id: string;
  name: string;
  page?: PageNode;
  remote: boolean;
  properties?: ComponentPropertyDefinitions | null;
  visible?: boolean;
}

export type NamingConvention =
  | 'camelCase'
  | 'PascalCase'
  | 'kebab-case'
  | 'snake_case'
  | 'Title Case';

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}

export interface ComponentFocusHandler extends EventHandler {
  name: 'FOCUS_COMPONENT';
  handler: (parentId: string) => void;
}
