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

const findMatchingComponents = async (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponent[] = [];
  let components: IComponent[];

  switch (searchSettings.scope) {
    case 'page':
      components = await getNodesByType({ types: ['COMPONENT'] });
      break;
    case 'all pages':
      components = await getNodesByType({
        types: ['COMPONENT'],
        context: { fromRoot: true },
      });
      break;
    default:
      components = await getNodesByType({
        types: ['COMPONENT'],
        context: { inSelection: true },
      });
      break;
  }

  components.forEach((component) => {
    const searchRegex = new RegExp(
      searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
      searchSettings.caseSensitive ? '' : 'i'
    );

    const matchedProps = component.properties?.filter((prop) =>
      searchRegex.test(prop)
    );

    if (matchedProps && matchedProps.length > 0) {
      const comp: IComponent = {
        ...component,
        properties: matchedProps.map((prop) => prop.split('=')[0]),
      };

      matchingComps.push(comp);
    }
  });
  return matchingComps;
};

const handleReplace = (
  searchKey: string,
  replacement: string,
  components: IComponent[]
) => {
  components.forEach(async (comp) => {
    const properties = comp.name.split(', ');

    const newProperties = properties.map((prop) => {
      const [key, value] = prop.split('=');

      if (key.includes(searchKey)) {
        const newKey = key.replace(new RegExp(searchKey, 'gi'), replacement);

        return `${newKey}=${value}`;
      }

      return prop;
    });

    const node = await figma.getNodeByIdAsync(comp.nodeId);

    if (node) node.name = newProperties.join(', ');
  });

  figma.notify('Replacement complete');
};

const fixLintErrors = async (lintErrors: ILintError[]) => {
  lintErrors.forEach(async (error) => {
    const node = await figma.getNodeByIdAsync(error.id);

    if (node) {
      for (const err of error.errors) {
        // Split the node name into property-value pairs
        const props = node.name.split(', ');

        switch (err.type) {
          case 'componentName':
            if (node.parent) {
              node.parent.name = convertString({
                str: err.value,
                convention: lintSettings.conventions.componentName!,
              });
            } else {
              node.name = convertString({
                str: err.value,
                convention: lintSettings.conventions.componentName!,
              });
            }
            break;
          case 'propName':
            // Update only the matching property names across all components
            node.name = props
              .map((prop) => {
                const [key, value] = prop.split('=');

                return err.value === key
                  ? `${convertString({
                      str: key,
                      convention: lintSettings.conventions.propName!,
                    })}=${value}`
                  : prop;
              })
              .join(', ');
            break;
          case 'propValue':
            // Update only the matching property values across all components
            node.name = props
              .map((prop) => {
                const [key, value] = prop.split('=');

                return err.value === value
                  ? `${key}=${convertString({
                      str: value,
                      convention: lintSettings.conventions.propValue!,
                    })}`
                  : prop;
              })
              .join(', ');
            break;
        }
      }
    }
  });
};

const checkConventions = (
  str: string,
  convention: NamingConvention
): boolean => {
  const camelCaseRegex = new RegExp(`^[a-zA-Z]+([A-Z][a-zA-Z0-9]+)*$`, 'g');
  const pascalCaseRegex = new RegExp(`^[A-Z][a-zA-Z0-9]+$`, 'g');
  const kebabCaseRegex = new RegExp(`^[a-z0-9-]+$`, 'g');
  const snakeCaseRegex = new RegExp(`^[a-z0-9_]+$`, 'g');

  switch (convention) {
    case 'camelCase':
      if (!camelCaseRegex.test(str)) {
        return true;
      }
      break;
    case 'PascalCase':
      if (!pascalCaseRegex.test(str)) {
        return true;
      }
      break;
    case 'kebab-case':
      if (!kebabCaseRegex.test(str)) {
        return true;
      }
      break;
    case 'snake_case':
      if (!snakeCaseRegex.test(str)) {
        return true;
      }
      break;
  }

  return false;
};

function findErrorsInComponent(component: IComponent): ILintError {
  const errors: { type: LintType; value: string }[] = [];

  if (lintSettings.toggles.componentName && component.parent) {
    if (
      checkConventions(
        component.parent.name,
        lintSettings.conventions.componentName
      )
    ) {
      errors.push({ type: 'componentName', value: component.parent.name });
    }
  }

  const properties = component.name.split(',').map((prop) => prop.trim());

  properties.forEach((prop) => {
    const [propName, propValue] = prop.split('=').map((p) => p.trim());

    if (
      lintSettings.toggles.propName &&
      checkConventions(propName, lintSettings.conventions.propName)
    ) {
      errors.push({ type: 'propName', value: propName });
    }

    if (
      lintSettings.toggles.propValue &&
      checkConventions(propValue, lintSettings.conventions.propValue)
    ) {
      errors.push({ type: 'propValue', value: propValue });
    }
  });

  const lintError: ILintError = {
    ...component,
    properties: properties,
    errors: errors,
  };

  return lintError;
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

  components.forEach((component) => {
    const parentId = component.parent?.id ?? component.id;
    const errors = findErrorsInComponent(component);

    if (!groupedErrors[parentId]) {
      groupedErrors[parentId] = [];
    }

    if (errors.errors.length > 0) {
      groupedErrors[parentId].push({
        ...component,
        errors: [...errors.errors],
      });
    }
  });

  return groupedErrors;
};

export default function () {
  showUI({ width: 320, height: 480 });
  on<ReplaceProperties>(
    'REPLACE_PROPERTIES',
    (searchKey, replacement, components) => {
      handleReplace(searchKey, replacement, components);
    }
  );

  on<FindComponents>('FIND_COMPONENTS', async (searchKey, searchSettings) => {
    const matchingComps = findMatchingComponents(searchKey, searchSettings);

    emit<MatchingComponents>('MATCHING_COMPONENTS', await matchingComps);
  });

  on<ComponentFocusHandler>('FOCUS_COMPONENT', (parentId) => {
    focusOnNodes({
      nodeIds: [parentId],
      nodeTypes: ['COMPONENT', 'COMPONENT_SET'],
    });
  });

  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    (windowSize: { width: number; height: number }): void => {
      const { width, height } = windowSize;

      figma.ui.resize(width, height);
    }
  );

  on<LintSettingsChange>('LINT_SETTINGS_CHANGE', async (settings) => {
    lintSettings = settings;
    const linterr = findLintErrors();

    emit<FindLintErrors>('FIND_LINT_ERRORS', await linterr);
  });

  on<FixLintErrors>('FIX_LINT_ERRORS', async (lintErrors: ILintError[]) => {
    // const lintableErrors: Record<string, ILintError[]> = await findLintErrors();

    // iterate over the lintable errors and pass to fixLintErrors
    // Object.entries(lintableErrors).forEach(async ([_, errors]) => {
    //   await fixLintErrors(errors);
    // });
    fixLintErrors(lintErrors);
  });

  figma.on('selectionchange', async () => {
    emit<HandleSelectionChange>(
      'HANDLE_SELECTION_CHANGE',
      await getNodesByType({
        types: ['COMPONENT', 'COMPONENT_SET'],
        context: { inSelection: true },
      })
    );
  });
}
