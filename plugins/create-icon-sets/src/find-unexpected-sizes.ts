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
    const widthSize = parseFloat(parameters['width']);
    const heightSize = parseFloat(parameters['height']);

    const selectedFrames = figma.currentPage.selection.filter(
      (frame) => frame.type === 'FRAME'
    );

    if (selectedFrames.length === 0) {
      figma.notify('Select frames to start');
      figma.closePlugin();
    }

    const unexpectedFrames = selectedFrames.filter(
      (frame) => frame.width !== widthSize || frame.height !== heightSize
    );

    figma.currentPage.selection = unexpectedFrames;
  });

  figma.on('run', () => {
    figma.notify('Update Icon Size');

    figma.parameters.on('input', (input) => {});

    figma.closePlugin();
  });
}
