import { EventHandler } from '@create-figma-plugin/utilities';

export interface IComponent {
  id: string;
  name: string;
  parent?: {
    id: string;
    name: string;
  };
  isSet?: boolean;
  properties: string[];
  node: ComponentNode;
  page: PageNode;
  remote: boolean;
}

export interface IInstance {
  id: string;
  name: string;
  node: InstanceNode;
  mainComponent: IComponent;
  page: PageNode;
}

export interface IComponentSet {
  id: string;
  name: string;
  node: ComponentSetNode;
  page: PageNode;
  remote: boolean;
  properties: string[];
}

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}

export interface ComponentFocusHandler extends EventHandler {
  name: 'FOCUS_COMPONENT';
  handler: (parentId: string) => void;
}
