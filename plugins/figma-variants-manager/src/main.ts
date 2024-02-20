import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  ComponentTargetHandler,
  FindComponents,
  IComponent,
  ISearchSettings,
  MatchingComponents,
  ReplaceProperties,
  ResizeWindowHandler,
} from './types';

const searchPage = (): SceneNode[] => {
  return figma.currentPage.findAll((node) => node.type === 'COMPONENT');
};

const searchAllPages = (): SceneNode[] => {
  return figma.root.findAllWithCriteria({
    types: ['COMPONENT_SET', 'COMPONENT'],
  });
};

const getPage = (node: BaseNode): PageNode | null => {
  if (node.type === 'PAGE') {
    return node;
  }
  if (node.parent) {
    return getPage(node.parent);
  }
  return null;
};

const findMatchingComponents = (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponent[] = [];
  let nodes;
  switch (searchSettings.searchScope) {
    case 'Page':
      nodes = searchPage();
      break;
    case 'All Pages':
      nodes = searchAllPages();
      break;
    default:
      nodes = figma.currentPage.selection;
      break;
  }

  nodes.forEach((node) => {
    if (
      node.parent &&
      (node.parent.type === 'COMPONENT' || node.parent.type === 'COMPONENT_SET')
    ) {
      const properties = node.name.split(', ');
      const searchRegex = new RegExp(
        searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
        searchSettings.caseSensitive ? '' : 'i'
      );

      const matchedProps = properties.filter((prop) => searchRegex.test(prop));

      if (matchedProps.length > 0) {
        const component = {
          name: node.name,
          id: node.id,
          matchedProps: matchedProps.map((prop) => prop.split('=')[0]),
          node,
          parent: {
            id: node.parent.id,
            name: node.parent.name,
          },
        };
        matchingComps.push(component);
      }
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

  on<ComponentTargetHandler>('TARGET_COMPONENT', (parentId) => {
    const node = figma.getNodeById(parentId);
    if (node && (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET')) {
      const pageNode = getPage(node);
      if (pageNode) figma.currentPage = pageNode;
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  });

  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    (windowSize: { width: number; height: number }): void => {
      const { width, height } = windowSize;
      figma.ui.resize(width, height);
    }
  );
}
