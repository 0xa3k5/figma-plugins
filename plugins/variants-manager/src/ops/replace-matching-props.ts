import { IComponent, IComponentSet } from '@repo/utils';

import { ISearchSettings } from '../types';

export const replaceMatchingProps = async (
  searchKey: string,
  replacement: string,
  componentSets: (IComponentSet | IComponent)[],
  searchSettings: ISearchSettings
) => {
  componentSets.forEach(async (compSet) => {
    const node = (await figma.getNodeByIdAsync(compSet.id)) as ComponentSetNode;

    if (node && compSet.properties) {
      Object.entries(compSet.properties).forEach(([propName, propValue]) => {
        if (searchSettings.toggles.propName) {
          const newPropName = propName.replace(
            new RegExp(searchKey, 'gi'),
            replacement
          );

          // figma includes an id in the name of the property
          // when the property is not a variant
          // we don't want the id on the prop name to be persisted

          try {
            node.editComponentProperty(propName, {
              name: newPropName.split('#')[0], // remove the id from the prop name while replacing
            });
          } catch (err: any) {
            console.log(err);
            figma.notify(
              `Error replacing property name: ${err.message}. Please fix the property name before continuing.`
            );
          }
        }

        // if we want to replace the property value
        // we need to rename the children of the component set
        if (searchSettings.toggles.propValue) {
          node.children.forEach((child) => {
            child.name = child.name
              .split(', ')
              .map((n) => {
                return n.replace(new RegExp(searchKey, 'gi'), replacement);
              })
              .join(', ');
          });
        }
      });
    }
    figma.notify('Replacement complete');
  });
};
