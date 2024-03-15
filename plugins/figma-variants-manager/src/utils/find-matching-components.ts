import { getNodesByType, IComponent } from '@repo/utils';

import { ISearchSettings } from '../types';

export const findMatchingComponents = async (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponent[] = [];
  let context: any;

  switch (searchSettings.scope) {
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

        if (searchSettings.toggles.propName && searchRegex.test(propName)) {
          matchedProps[propName] = propName;
        }
        if (searchSettings.toggles.propValue && searchRegex.test(propValue)) {
          matchedProps[propValue] = propValue;
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
