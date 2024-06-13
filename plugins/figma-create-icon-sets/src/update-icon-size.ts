import { on } from '@create-figma-plugin/utilities';

export default async function () {
  figma.parameters.on(
    'input',
    ({ parameters, key, query, result }: ParameterInputEvent) => {
      const sizes = ['16', '24', '32', '40', '48', '64'];
      result.setSuggestions(sizes.filter((s) => s.includes(query)));
    }
  );

  figma.on('run', ({ command, parameters }: RunEvent) => {
    if (!parameters) {
      return;
    }
    const frameSize = parseFloat(parameters['frame-size']);
    const biggestDimensionSize = parseFloat(
      parameters['biggest-dimension-size']
    );

    const selectedFrames = figma.currentPage.selection.filter(
      (frame) => frame.type === 'FRAME'
    );

    if (selectedFrames.length === 0) {
      figma.notify('Select frames to start');
      figma.closePlugin();
    }

    selectedFrames.forEach((frame) => {
      const children = frame.children;
      // create a new group for the children
      const group = figma.group(children, frame);
      group.constrainProportions = true;
      if (group.width > group.height) {
        const height = (biggestDimensionSize / group.width) * group.height;
        group.resize(biggestDimensionSize, height);
      }
      // group width is either smaller or equal to group height
      if (group.width < group.height) {
        const width = (biggestDimensionSize / group.height) * group.width;
        group.resize(width, biggestDimensionSize);
      }

      if (group.width === group.height) {
        group.resize(biggestDimensionSize, biggestDimensionSize);
      }
      /**
       * This is a hack to scale and center the children of the frame
       * the wrapper frame is set to auto layout
       * we leverage Auto Layout to center the children
       * then we remove the auto layout
       * and ungroup the children
       */
      frame.layoutMode = 'HORIZONTAL';
      frame.primaryAxisAlignItems = 'CENTER';
      frame.counterAxisAlignItems = 'CENTER';
      frame.resize(frameSize, frameSize);
      frame.layoutMode = 'NONE';
      figma.ungroup(group);
    });
  });

  figma.on('run', () => {
    figma.notify('Update Icon Size');

    figma.parameters.on('input', (input) => {});

    figma.closePlugin();
  });
}
