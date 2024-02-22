import { EventHandler } from '@create-figma-plugin/utilities';

export interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW';
  handler: (windowSize: { width: number; height: number }) => void;
}

export interface UpdatePageDataHandler extends EventHandler {
  name: 'UPDATE_PAGE_DATA';
  handler: (properties: PropertyTypeValues) => void;
}

export interface GetSingleVariableHandler extends EventHandler {
  name: 'GET_SINGLE_VARIABLE';
  handler: (variableId: string) => void;
}
export interface GetVariablesHandler extends EventHandler {
  name: 'GET_VARIABLES';
  handler: (variables: IVariable[]) => void;
}
export interface GetVariableCollectionsHandler extends EventHandler {
  name: 'GET_VARIABLE_COLLECTIONS';
  handler: (variables: IVariableCollection[]) => void;
}

export interface AssignVariableHandler extends Event {
  name: 'ASSIGN_VARIABLE';
  handler: (data: {
    variableId: string;
    key: string;
    type: PropertyType;
    direction?: string;
  }) => void;
}
export interface InspectPageHandler extends EventHandler {
  name: 'INSPECT_PAGE';
  handler: () => void;
}
export interface InspectSelectionHandler extends EventHandler {
  name: 'INSPECT_SELECTION';
  handler: () => void;
}

export interface ValueSelectHandler extends EventHandler {
  name: 'VALUE_SELECT';
  handler: (data: { key: string; direction: string; type: PropertyType }) => void;
}

export interface IncludeVariableValuesHandler extends EventHandler {
  name: 'INCLUDE_VARIABLES_TOGGLE';
  handler: () => void;
}

export enum PropertyType {
  PADDING = 'padding',
  GAP = 'gap',
  STROKE = 'stroke',
  RADIUS = 'radius',
}

export enum ETabs {
  INSPECT = 'inspect',
  AUTOFIX = 'auto-fix',
  VARIABLES = 'variables',
}

export interface NodeReference {
  id: string;
}

export interface PropertyValue {
  [direction: string]: {
    count: number;
    nodes: NodeReference[];
  };
}

export interface PropertyValues {
  padding: PropertyValue;
  gap: PropertyValue;
  stroke: PropertyValue;
  radius: PropertyValue;
}

export interface PropertyTypeValues {
  [key: string]: PropertyValues;
}

export interface IVariable {
  id: string;
  name: string;
  key: string;
  scopes: Array<VariableScope>;
  valuesByMode: { [modeId: string]: VariableValue };
  codeSyntax: { [platform in CodeSyntaxPlatform]?: string };
  description: string;
  remote: boolean;
  resolvedType: VariableResolvedDataType;
  variableCollectionId: string;
}

export interface IVariableCollection {
  id: string;
  name: string;
  hiddenFromPublishing: boolean;
  modes: Array<{ modeId: string; name: string }>;
  variableIds: string[];
  defaultModeId: string;
  key: string;
}
