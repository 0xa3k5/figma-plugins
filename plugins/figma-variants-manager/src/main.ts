import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  ComponentFocusHandler,
  focusOnNodes,
  getNodesByType,
  IComponent,
  ResizeWindowHandler,
} from '@repo/utils';

import {
  FindComponents,
  ISearchSettings,
  MatchingComponents,
  ReplaceProperties,
} from './types';

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

    const matchedProps = component.properties.filter((prop) =>
      searchRegex.test(prop)
    );

    if (matchedProps.length > 0) {
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

    const node = figma.getNodeById(comp.node.id);

    if (node) node.name = newProperties.join(', ');
  });

  figma.notify('Replacement complete');
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
}
