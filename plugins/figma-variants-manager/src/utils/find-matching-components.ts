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

  let components: IComponent[] = [];

  try {
    components = await getNodesByType({ types: ['COMPONENT'], context });
  } catch (err: any) {
    if (err.message.includes('has existing errors')) {
      figma.notify(
        `A component or component set in ${searchSettings.scope} has errors. Please fix them before continuing.`
      );
    }
  }

  components.forEach((component) => {
    const matchedProps: IComponent['properties'] = {};

    if (component.properties) {
      Object.entries(component.properties).forEach(([propName, propValue]) => {
        const searchRegex = new RegExp(
          searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
          searchSettings.caseSensitive ? '' : 'i'
        );

        if (searchSettings.toggles.propName && searchRegex.test(propName)) {
          matchedProps[propName] = propValue;
        }
        if (searchSettings.toggles.propValue && searchRegex.test(propValue)) {
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
