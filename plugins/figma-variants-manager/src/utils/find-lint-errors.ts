import {
  getNodesByType,
  IComponent,
  IComponentSet,
  NamingConvention,
} from '@repo/utils';

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
      context = { root: true };
      break;
  }

  const componentSets: (IComponentSet | IComponent)[] = await getNodesByType({
    types: ['COMPONENT_SET', 'COMPONENT'],
    context,
  });

  const groupedErrors: Record<string, ILintError[]> = {};

  for (const componentSet of componentSets) {
    const isLocal =
      componentSet.name.startsWith('_') || componentSet.name.startsWith('.');

    if (lintSettings.ignoreLocalComponents && isLocal) {
      continue;
    }

    if (!componentSet.properties) {
      continue;
    }

    const errors = await findLintErrorsInComponent(componentSet, lintSettings);

    if (errors.errors.length > 0) {
      groupedErrors[componentSet.id] = groupedErrors[componentSet.id] || [];
      groupedErrors[componentSet.id].push(errors);
    }
  }

  return groupedErrors;
};

async function findLintErrorsInComponent(
  componentSet: IComponentSet | IComponent,
  lintSettings: ILintSettings
): Promise<ILintError> {
  const errors: {
    type: LintType;
    value: string;
    convention: NamingConvention;
  }[] = [];

  if (lintSettings.toggles.componentName) {
    const passesConvention = checkConventions(
      componentSet.name,
      lintSettings.conventions.componentName
    );

    if (!passesConvention) {
      errors.push({
        type: 'componentName',
        value: componentSet.name,
        convention: lintSettings.conventions.componentName,
      });
    }
  }

  if (componentSet.properties) {
    Object.entries(componentSet.properties).forEach(([propName, propValue]) => {
      if (
        lintSettings.toggles.propName &&
        !checkConventions(
          propName.split('#')[0], // remove the id from the prop name while checking
          lintSettings.conventions.propName
        )
      ) {
        errors.push({
          type: 'propName',
          value: propName,
          convention: lintSettings.conventions.propName,
        });
      }

      if (lintSettings.toggles.propValue) {
        if (propValue.type === 'VARIANT') {
          const propValues = propValue.variantOptions;

          if (propValues !== undefined) {
            propValues.forEach((value) => {
              if (
                !checkConventions(value, lintSettings.conventions.propValue)
              ) {
                errors.push({
                  type: 'propValue',
                  value,
                  convention: lintSettings.conventions.propValue,
                });
              }
            });
          }
        }
      }
    });
  }

  return { ...componentSet, errors: errors };
}
