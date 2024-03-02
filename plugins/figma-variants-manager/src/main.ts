import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  ComponentFocusHandler,
  convertString,
  focusOnNodes,
  getNodesByType,
  IComponent,
  NamingConvention,
  ResizeWindowHandler,
} from '@repo/utils';

import {
  FindComponents,
  FindLintErrors,
  FixLintErrors,
  HandleSelectionChange,
  ILintError,
  ILintSettings,
  ISearchSettings,
  LintSettingsChange,
  LintType,
  MatchingComponents,
  ReplaceProperties,
} from './types';

let lintSettings: ILintSettings;

const checkConventions = (
  str: string,
  convention: NamingConvention
): boolean => {
  const regexPatterns = {
    camelCase: /^[a-zA-Z]+([A-Z][a-zA-Z0-9]+)*$/,
    PascalCase: /^[A-Z][a-zA-Z0-9]+$/,
    'kebab-case': /^[a-z0-9-]+$/,
    snake_case: /^[a-z0-9_]+$/,
    'Title Case': /^[A-Z][a-zA-Z0-9]+$/,
  };

  return regexPatterns[convention].test(str);
};

const findMatchingComponents = async (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponent[] = [];
  let context: any;

  switch (searchSettings.scope) {
    case 'selection':
      context = { inSelection: true };
      break;
    case 'page':
      context = { page: figma.currentPage };
      break;
    case 'all pages':
      context = { fromRoot: true };
      break;
  }

  const components = await getNodesByType({ types: ['COMPONENT'], context });

  components.forEach((component) => {
    const matchedProps: IComponent['properties'] = {};

    if (component.properties) {
      Object.entries(component.properties).forEach(([propName, propValue]) => {
        const searchRegex = new RegExp(
          searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
          searchSettings.caseSensitive ? '' : 'i'
        );

        if (searchRegex.test(propName)) {
          matchedProps[propName] = propValue;
        }
      });
    }

    if (Object.keys(matchedProps).length > 0) {
      matchingComps.push({
        ...component,
        properties: matchedProps,
      });
    }
  });

  return matchingComps;
};

const handleReplace = async (
  searchKey: string,
  replacement: string,
  components: IComponent[]
) => {
  components.forEach(async (comp) => {
    const node = (await figma.getNodeByIdAsync(comp.id)) as ComponentNode;

    if (node && comp.properties) {
      const props = node.name.split(', ');

      for (const [propName, propValue] of Object.entries(comp.properties)) {
        const index = props.findIndex(
          (p) => p.split('=')[0].trim() === propName
        );

        const searchRegex = new RegExp(searchKey, 'gi');

        if (index !== -1 && searchRegex.test(propName)) {
          const newPropName = propName.replace(
            new RegExp(searchKey, 'gi'),
            replacement
          );

          props[index] = `${newPropName}=${propValue}`;
        }
      }

      node.name = props.join(', ');
    }
  });

  figma.notify('Replacement complete');
};

async function findErrorsInComponent(
  component: IComponent
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

const findLintErrors = async (): Promise<Record<string, ILintError[]>> => {
  let context: any;

  switch (lintSettings.applyScope) {
    case 'selection':
      context = { inSelection: true };
      break;
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
    const parentId = component.parent?.id ?? component.id;
    const errors = await findErrorsInComponent(component);

    if (errors.errors.length > 0) {
      groupedErrors[parentId] = groupedErrors[parentId] || [];
      groupedErrors[parentId].push(errors);
    }
  }

  return groupedErrors;
};

const fixLintErrors = async (lintErrors: ILintError[]): Promise<void> => {
  for (const lintError of lintErrors) {
    const node = await figma.getNodeByIdAsync(lintError.id);

    if (node) {
      for (const err of lintError.errors) {
        // Split the node name into property-value pairs
        const props = node.name.split(', ');

        if (err.type === 'componentName') {
          if (node.parent?.type === 'COMPONENT_SET') {
            node.parent.name = convertString({
              str: err.value,
              convention: err.convention,
            });
          } else {
            node.name = convertString({
              str: err.value,
              convention: err.convention,
            });
          }
        }
        if (err.type === 'propName' && lintError.properties) {
          for (const [propName, propValue] of Object.entries(
            lintError.properties
          )) {
            const index = props.findIndex(
              (p) => p.split('=')[0].trim() === propName
            );

            if (index !== -1) {
              const convertedPropName = convertString({
                str: propName,
                convention: err.convention,
              });

              props[index] = `${convertedPropName}=${propValue}`;
            }
          }

          node.name = props.join(', ');
        }
        if (err.type === 'propValue' && lintError.properties) {
          for (const [propName, propValue] of Object.entries(
            lintError.properties
          )) {
            const index = props.findIndex(
              (p) => p.split('=')[1].trim() === propValue
            );

            if (index !== -1) {
              const convertedPropValue = convertString({
                str: propValue,
                convention: lintSettings['conventions']['propValue'],
              });

              // Replace the property name in the property string
              props[index] = `${propName}=${convertedPropValue}`;
            }
          }
          node.name = props.join(', ');
        }
      }
    }
  }
};

export default function initializePlugin() {
  showUI({ width: 320, height: 480 });

  on<ComponentFocusHandler>('FOCUS_COMPONENT', (parentId) => {
    focusOnNodes({
      nodeIds: [parentId],
      nodeTypes: ['COMPONENT', 'COMPONENT_SET'],
    });
  });

  on<ResizeWindowHandler>('RESIZE_WINDOW', (windowSize) => {
    const { width, height } = windowSize;

    figma.ui.resize(width, height);
  });

  on<ReplaceProperties>(
    'REPLACE_PROPERTIES',
    (searchKey, replacement, components) => {
      handleReplace(searchKey, replacement, components);
    }
  );

  on<FindComponents>('FIND_COMPONENTS', async (searchKey, searchSettings) => {
    const matchingComps = await findMatchingComponents(
      searchKey,
      searchSettings
    );

    emit<MatchingComponents>('MATCHING_COMPONENTS', matchingComps);
  });

  on<LintSettingsChange>('LINT_SETTINGS_CHANGE', async (settings) => {
    lintSettings = settings;
    const lintErrors = await findLintErrors();

    emit<FindLintErrors>('FIND_LINT_ERRORS', lintErrors);
  });

  on<FixLintErrors>('FIX_LINT_ERRORS', async (lintErrors) => {
    await fixLintErrors(lintErrors);
  });

  figma.on('selectionchange', async () => {
    const selectedNodes = await getNodesByType({
      types: ['COMPONENT', 'COMPONENT_SET'],
      context: { inSelection: true },
    });

    // emit<HandleSelectionChange>('HANDLE_SELECTION_CHANGE', selectedNodes);
  });
}
