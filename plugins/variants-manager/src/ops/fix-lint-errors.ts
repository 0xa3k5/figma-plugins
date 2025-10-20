import { convertString } from '@repo/utils';

import { ILintError } from '../types';

export const fixLintErrors = async (
  lintErrors: ILintError[]
): Promise<void> => {
  for (const lintError of lintErrors) {
    const node = (await figma.getNodeByIdAsync(lintError.id)) as
      | ComponentNode
      | ComponentSetNode;

    if (node) {
      for (const err of lintError.errors) {
        // Split the node name into property-value pairs

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
        if (err.type === 'propName') {
          const newPropName = convertString({
            str: err.value,
            convention: err.convention,
          });

          console.log('newPropName', newPropName);
          console.log('propName', err.value);

          node.editComponentProperty(err.value, {
            name: newPropName,
          });
        }
        if (err.type === 'propValue') {
          node.children.forEach((child) => {
            child.name = child.name
              .split(', ')
              .map((n) => {
                return convertString({
                  str: n,
                  convention: err.convention,
                });
              })
              .join(', ');
          });
        }
      }
    }
  }
};
