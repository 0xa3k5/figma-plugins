import { emit } from '@create-figma-plugin/utilities';

import {
  AssignVariableHandler,
  InspectPageHandler,
  IVariable,
  PropertyType,
  ValueSelectHandler,
} from '../types';

export const handleValueSelect = (key: string, type: PropertyType, direction: string) => {
  emit<ValueSelectHandler>('VALUE_SELECT', { key, type, direction });
};

export const handleAssignVariable = (
  key: string,
  type: PropertyType,
  variable: IVariable,
  direction?: string
) => {
  emit<AssignVariableHandler>('ASSIGN_VARIABLE', {
    variableId: variable.id,
    key,
    type,
    direction: direction ?? undefined,
  });
  emit<InspectPageHandler>('INSPECT_PAGE');
};

export const handleInspectPage = () => {
  emit<InspectPageHandler>('INSPECT_PAGE');
};
