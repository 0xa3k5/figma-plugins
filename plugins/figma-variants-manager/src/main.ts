import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  ComponentFocusHandler,
  convertString,
  focusOnNodes,
  getNodesByType,
  IComponent,
  IComponentSet,
  NamingConvention,
  ResizeWindowHandler,
} from '@repo/utils';

import {
  FindComponents,
  FindLintErrors,
  FixLintErrors,
  HandleSelect,
  ILintError,
  ILintSettings,
  ISearchSettings,
  LintSettingsChange,
  LintType,
  MatchingComponents,
  ReplaceProperties,
} from './types';

let lintSettings: ILintSettings;

const findMatchingComponents = (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponent[] = [];
  let components: IComponent[];

  switch (searchSettings.searchScope) {
    case 'Page':
      components = getNodesByType({ types: ['COMPONENT'] });
      break;
    case 'All Pages':
      components = getNodesByType({
        types: ['COMPONENT'],
        context: { fromRoot: true },
      });
      break;
    default:
      components = getNodesByType({
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
  components.forEach((comp) => {
    const properties = comp.name.split(', ');

    const newProperties = properties.map((prop) => {
      const [key, value] = prop.split('=');

      if (key.includes(searchKey)) {
        const newKey = key.replace(new RegExp(searchKey, 'gi'), replacement);

        return `${newKey}=${value}`;
      }

      return prop;
    });

    const node = figma.getNodeById(comp.nodeId);

    if (node) node.name = newProperties.join(', ');
  });

  figma.notify('Replacement complete');
};

const fixLintErrors = (lintErrors: ILintError[]) => {
  lintErrors.forEach((error) => {
    error.errors.forEach((err) => {
      const node = error.parent
        ? figma.getNodeById(error.parent.id)
        : figma.getNodeById(error.id);

      if (node) {
        switch (err.type) {
          case 'componentName':
            node.name = convertString({
              str: err.value,
              convention: lintSettings.conventions.componentName!,
            });
            break;
          case 'propName':
            node.name = convertString({
              str: err.value,
              convention: lintSettings.conventions.propName!,
            });
            break;
          case 'propValue':
            node.name = convertString({
              str: err.value,
              convention: lintSettings.conventions.propValue!,
            });
            break;
        }
      }
    });
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

const groupAndCategorizeErrors = (
  components: IComponent[]
): Record<string, Record<LintType, ILintError[]>> => {
  const groupedErrors: Record<string, Record<LintType, ILintError[]>> = {};

  components.forEach((component) => {
    const parentId = component.parent?.id ?? component.id;

    if (!groupedErrors[parentId]) {
      groupedErrors[parentId] = {
        componentName: [],
        propName: [],
        propValue: [],
      };
    }

    const lintError = findErrorsInComponent(component);

    lintError.errors.forEach((error) => {
      groupedErrors[parentId][error.type].push({
        ...lintError,
        errors: [error],
      });
    });
  });

  return groupedErrors;
};

const processedComponentSets = new Set<string>();
const processedProperties = new Set<string>();

function findErrorsInComponent(component: IComponent): ILintError {
  const lintError: ILintError = { ...component, errors: [] };

  const { toggles, conventions } = lintSettings;

  if (toggles.componentName && conventions.componentName) {
    // Check for parent component name error
    if (component.parent) {
      if (checkConventions(component.parent.name, conventions.componentName)) {
        // Add error if it's the first component of the set being processed
        if (!processedComponentSets.has(component.parent.id)) {
          lintError.errors.push({
            type: 'componentName',
            value: component.parent.name,
          });
          processedComponentSets.add(component.parent.id);
        }
      }
    } else if (checkConventions(component.name, conventions.componentName)) {
      lintError.errors.push({ type: 'componentName', value: component.name });
    }
  }

  // Check for property name errors
  if (component.properties) {
    component.properties.forEach((prop) => {
      const [propName, propValue] = prop.split('=');

      // Check for property name errors
      if (toggles.propName && conventions.propName) {
        if (
          checkConventions(propName, conventions.propName) &&
          !processedProperties.has(propName)
        ) {
          lintError.errors.push({ type: 'propName', value: propName });
          processedProperties.add(propName);
        }
      }

      // Check for property value errors
      if (toggles.propValue && conventions.propValue) {
        if (
          checkConventions(propValue, conventions.propValue) &&
          !processedProperties.has(propValue)
        ) {
          lintError.errors.push({ type: 'propValue', value: propValue });
          processedProperties.add(propValue);
        }
      }
    });
  }

  return lintError;
}

const findLintErrors = (): Record<string, Record<LintType, ILintError[]>> => {
  processedComponentSets.clear();
  processedProperties.clear();
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

  const components = getNodesByType({ types: ['COMPONENT'], context });

  return groupAndCategorizeErrors(components);
};

export default function () {
  showUI({ width: 320, height: 480 });
  on<ReplaceProperties>(
    'REPLACE_PROPERTIES',
    (searchKey, replacement, components) => {
      handleReplace(searchKey, replacement, components);
    }
  );

  on<FindComponents>('FIND_COMPONENTS', (searchKey, searchSettings) => {
    const matchingComps = findMatchingComponents(searchKey, searchSettings);

    emit<MatchingComponents>('MATCHING_COMPONENTS', matchingComps);
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

  on<LintSettingsChange>('LINT_SETTINGS_CHANGE', (settings) => {
    lintSettings = settings;
    console.log('lintSettings', lintSettings);
    const linterr = findLintErrors();

    console.log('linterr', linterr);

    emit<FindLintErrors>('FIND_LINT_ERRORS', linterr);
  });

  on<FixLintErrors>('FIX_LINT_ERRORS', (lintErrors: ILintError[]) => {
    console.log('lintErrrs', lintErrors);
    fixLintErrors(lintErrors);
  });

  figma.on('selectionchange', () => {
    emit<HandleSelect>(
      'HANDLE_SELECT',
      getNodesByType({
        types: ['COMPONENT', 'COMPONENT_SET'],
        context: { inSelection: true },
      })
    );
  });
}
