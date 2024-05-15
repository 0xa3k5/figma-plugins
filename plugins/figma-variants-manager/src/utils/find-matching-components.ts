import { getNodesByType, IComponent, IComponentSet } from '@repo/utils';

import { ISearchSettings } from '../types';

export const findMatchingComponents = async (
  searchKey: string,
  searchSettings: ISearchSettings
) => {
  const matchingComps: IComponentSet[] = [];
  let context: any;

  switch (searchSettings.scope) {
    case 'page':
      context = { page: figma.currentPage };
      break;
    case 'all pages':
      context = { root: true };
      break;
    case 'selection':
      context = { selection: true };
      break;
  }

  const componentSets: (IComponentSet | IComponent)[] = await getNodesByType({
    types: ['COMPONENT_SET', 'COMPONENT'],
    context,
  });

  const searchRegex = new RegExp(
    searchSettings.matchWholeWord ? `\\b${searchKey}\\b` : searchKey,
    searchSettings.caseSensitive ? '' : 'i'
  );

  componentSets.forEach((compSet) => {
    if (compSet.properties) {
      Object.entries(compSet.properties).forEach(([propName, propValue]) => {
        if (searchSettings.toggles.propName) {
          if (searchRegex.test(propName)) {
            matchingComps.push({
              ...compSet,
              properties: { [propName]: { ...propValue } },
            });
          }
        }

        if (searchSettings.toggles.propValue) {
          if (propValue.type === 'VARIANT') {
            const propValues = propValue.variantOptions;

            if (propValues !== undefined) {
              propValues.forEach((value) => {
                if (searchRegex.test(value)) {
                  matchingComps.push({
                    ...compSet,
                    properties: {
                      [propName]: {
                        variantOptions: [value],
                        ...propValue,
                      },
                    },
                  });
                }
              });
            }
          }
        }
      });
    }
  });

  return matchingComps;
};
