import { EventHandler } from '@create-figma-plugin/utilities';
import { IComponent, IInstance } from '@repo/utils';

export enum ETabs {
  LOCAL = 'Local Missing',
  REMOTE = 'Remote',
}
export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}
// export interface IComponent {
//   id: string;
//   name: string;
// }
export interface ILibrary {
  name: string;
  components: IComponent[];
}

export type TLibrary = Record<string, ILibrary>;

export interface GetRemoteMissing extends EventHandler {
  name: 'GET_REMOTE_MISSING';
  handler: () => void;
}
export interface UpdateRemoteComponents extends EventHandler {
  name: 'UPDATE_REMOTE_COMPONENTS';
  handle: (remoteComponents: Record<string, IInstance[]>) => void;
}

export interface FindRemoteMissingInstances extends EventHandler {
  name: 'FIND_REMOTE_MISSING';
  handle: (remoteComponents: Record<string, IInstance[]>) => void;
}

export interface GetLocalMissing extends EventHandler {
  name: 'GET_LOCAL_MISSING';
  handler: () => void;
}
export interface UpdateLocalMissing extends EventHandler {
  name: 'UPDATE_LOCAL_MISSING';
  handle: (local: { missing: IInstance[]; components: IComponent[] }) => void;
}

export interface SelectNodes extends EventHandler {
  name: 'SELECT_NODES';
  handler: (components: IInstance[]) => void;
}

export interface ScanLibrary extends EventHandler {
  name: 'SCAN_LIBRARY';
  handler: () => void;
}

export interface GetLibraries extends EventHandler {
  name: 'GET_LIBRARIES';
  handler: () => void;
}

export interface UpdateUserLibraries extends EventHandler {
  name: 'UPDATE_USER_LIBRARIES';
  handler: (data: TLibrary[]) => void;
}

export interface DetachInstances extends EventHandler {
  name: 'DETACH_INSTANCES';
  handler: (instances: IInstance[]) => void;
}
export interface DeleteInstances extends EventHandler {
  name: 'DELETE_INSTANCES';
  handler: (instances: IInstance[]) => void;
}

export interface ReplaceInstances extends EventHandler {
  name: 'REPLACE_INSTANCES';
  handler: (data: { instances: IInstance[]; replaceWith: IComponent }) => void;
}

export interface ClearLibraries extends EventHandler {
  name: 'CLEAR_LIBRARIES';
  handler: () => void;
}
