import { getNodesByType, IComponent, NamingConvention } from '@repo/utils';

import { ILintError, ILintSettings, LintType } from '../types';
import { checkConventions } from './check-conventions';

export const findLintErrors = async (
  lintSettings: ILintSettings
): Promise<Record<string, ILintError[]>> => {
  let context: any;

  switch (lintSettings.applyScope) {
    case 'page':
      context = { page: figma.currentPage };
      break;
    case 'all pages':
      context = { fromRoot: true };
      break;
  }

  const components = await getNodesByType({ types: ['COMPONENT'], context });

  const groupedErrors: Record<string, ILintError[]> = {};

  for (const component of components) {
    const isLocal =
      component.parent?.name.startsWith('_') ||
      component.parent?.name.startsWith('_') ||
      component.name.startsWith('.') ||
      component.name.startsWith('_');

    if (lintSettings.ignoreLocalComponents && isLocal) {
      continue;
    }
    const parentId = component.parent?.id ?? component.id;
    const errors = await findLintErrorsInComponent(component, lintSettings);

    if (errors.errors.length > 0) {
      groupedErrors[parentId] = groupedErrors[parentId] || [];
      groupedErrors[parentId].push(errors);
    }
  }

  return groupedErrors;
};

async function findLintErrorsInComponent(
  component: IComponent,
  lintSettings: ILintSettings
): Promise<ILintError> {
  const errors: {
    type: LintType;
    value: string;
    convention: NamingConvention;
  }[] = [];
  const node = (await figma.getNodeByIdAsync(component.id)) as ComponentNode;

  if (lintSettings.toggles.componentName) {
    if (component.parent) {
      const passesConvention = checkConventions(
        component.parent.name,
        lintSettings.conventions.componentName
      );

      if (!passesConvention) {
        errors.push({
          type: 'componentName',
          value: component.parent.name,
          convention: lintSettings.conventions.componentName,
        });
      }
    } else {
      const passesConvention = checkConventions(
        component.name,
        lintSettings.conventions.componentName
      );

      if (!passesConvention) {
        errors.push({
          type: 'componentName',
          value: component.name,
          convention: lintSettings.conventions.componentName,
        });
      }
    }
  }

  const properties = node.variantProperties;

  if (properties) {
    for (const [propName, propValue] of Object.entries(properties)) {
      if (
        lintSettings.toggles.propName &&
        !checkConventions(propName, lintSettings.conventions.propName)
      ) {
        errors.push({
          type: 'propName',
          value: propName,
          convention: lintSettings.conventions.propName,
        });
      }
      if (
        lintSettings.toggles.propValue &&
        !checkConventions(propValue, lintSettings.conventions.propValue)
      ) {
        errors.push({
          type: 'propValue',
          value: propValue,
          convention: lintSettings.conventions.propValue,
        });
      }
    }
  }

  return { ...component, properties: properties, errors: errors };
}
