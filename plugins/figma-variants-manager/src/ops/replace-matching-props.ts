import { IComponent } from '@repo/utils';

import { ISearchSettings } from '../types';

export const replaceMatchingProps = async (
  searchKey: string,
  replacement: string,
  components: IComponent[],
  searchSettings: ISearchSettings
) => {
  components.forEach(async (comp) => {
    const node = (await figma.getNodeByIdAsync(comp.id)) as ComponentNode;

    if (node && comp.properties) {
      const props = node.name.split(', ');

      for (const [propName, propValue] of Object.entries(comp.properties)) {
        if (searchSettings.toggles.propName) {
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
        if (searchSettings.toggles.propValue) {
          const index = props.findIndex(
            (p) => p.split('=')[1].trim() === propValue
          );

          const searchRegex = new RegExp(searchKey, 'gi');

          if (index !== -1 && searchRegex.test(propValue)) {
            const newPropValue = propValue.replace(
              new RegExp(searchKey, 'gi'),
              replacement
            );

            props[index] = `${propName}=${newPropValue}`;
          }
        }
      }

      node.name = props.join(', ');
    }
  });

  figma.notify('Replacement complete');
};
