import { convertString } from '@repo/utils';

import { ILintError, ILintSettings } from '../types';

export const fixLintErrors = async (
  lintErrors: ILintError[],
  lintSettings: ILintSettings
): Promise<void> => {
  for (const lintError of lintErrors) {
    const node = await figma.getNodeByIdAsync(lintError.id);

    if (node) {
      for (const err of lintError.errors) {
        // Split the node name into property-value pairs
        const props = node.name.split(', ');

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
        if (err.type === 'propName' && lintError.properties) {
          for (const [propName, propValue] of Object.entries(
            lintError.properties
          )) {
            const index = props.findIndex(
              (p) => p.split('=')[0].trim() === propName
            );

            if (index !== -1) {
              const convertedPropName = convertString({
                str: propName,
                convention: err.convention,
              });

              props[index] = `${convertedPropName}=${propValue}`;
            }
          }

          node.name = props.join(', ');
        }
        if (err.type === 'propValue' && lintError.properties) {
          for (const [propName, propValue] of Object.entries(
            lintError.properties
          )) {
            const index = props.findIndex(
              (p) => p.split('=')[1].trim() === propValue
            );

            if (index !== -1) {
              const convertedPropValue = convertString({
                str: propValue,
                convention: lintSettings['conventions']['propValue'],
              });

              // Replace the property name in the property string
              props[index] = `${propName}=${convertedPropValue}`;
            }
          }
          node.name = props.join(', ');
        }
      }
    }
  }
};
