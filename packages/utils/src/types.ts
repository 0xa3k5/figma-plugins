import { EventHandler } from '@create-figma-plugin/utilities';
export interface IComponent {
  id: string;
  name: string;
  parent?: IComponentSet;
  isSet?: boolean;
  properties?: string[];
  nodeId: string;
  page: PageNode;
  remote: boolean;
}

export interface IInstance {
  id: string;
  name: string;
  nodeId: string;
  mainComponent: IComponent;
  page: PageNode;
}

export interface IComponentSet {
  id: string;
  name: string;
  nodeId: string;
  page: PageNode;
  remote: boolean;
  properties?: string[];
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
