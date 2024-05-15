import { on } from '@create-figma-plugin/utilities';

export default async function () {
  figma.on('run', () => {
    const selectedFrames = figma.currentPage.selection;

    console.log(selectedFrames.map((frame) => frame.name));
    if (selectedFrames.length === 0) {
      figma.notify('Select frames to start');
      figma.closePlugin();
    }

    let groupedFrames: { [name: string]: SceneNode[] } = {};

    // group frames based on the name before the first "/"
    selectedFrames.forEach((frame) => {
      // detect the separator (between "/", ":", or "\")
      const separator = ['/', ':', '\\'].find((separator) =>
        frame.name.includes(separator)
      );

      if (!separator) {
        figma.notify(
          'Frames must be named with a separator ("/", ":", or "\\")'
        );
        figma.closePlugin();
        return
      }

      const [name] = frame.name.split(separator);

      if (!groupedFrames[name]) {
        groupedFrames[name] = [];
      }
      groupedFrames[name].push(frame);
    });

    // sort
    groupedFrames = Object.fromEntries(
      Object.entries(groupedFrames).sort(([a], [b]) => a.localeCompare(b))
    );

    let xOffset = 0;
    let yOffset = 0;
    const maxRowWidth = 4800;
    const spacing = 32;

    Object.values(groupedFrames).forEach((frames) => {
      const components = frames.map((frame) =>
        figma.createComponentFromNode(frame)
      );

      const componentSet = figma.combineAsVariants(
        components,
        figma.currentPage
      );

      componentSet.strokes = [
        {
          type: 'SOLID',
          visible: true,
          opacity: 1,
          blendMode: 'NORMAL',
          color: { r: 0.48235294222831726, g: 0.3803921639919281, b: 1 },
        },
      ];
      componentSet.strokeWeight = 1;
      componentSet.strokeAlign = 'INSIDE';
      componentSet.strokeCap = 'NONE';
      componentSet.strokeJoin = 'MITER';
      componentSet.strokeMiterLimit = 4;
      componentSet.dashPattern = [10, 5];
      componentSet.cornerRadius = 4;
      componentSet.paddingLeft = 16;
      componentSet.paddingRight = 16;
      componentSet.paddingTop = 16;
      componentSet.paddingBottom = 16;
      componentSet.primaryAxisAlignItems = 'MIN';
      componentSet.counterAxisAlignItems = 'MIN';
      componentSet.primaryAxisSizingMode = 'AUTO';
      componentSet.layoutGrids = [];
      componentSet.expanded = true;
      componentSet.constraints = { horizontal: 'MIN', vertical: 'MIN' };
      componentSet.layoutMode = 'HORIZONTAL';
      componentSet.counterAxisSizingMode = 'AUTO';
      componentSet.itemSpacing = 16;

      if (xOffset + componentSet.width > maxRowWidth) {
        // Move to the next row
        xOffset = 0;
        yOffset += componentSet.height + spacing;
      }

      componentSet.x = xOffset;
      componentSet.y = yOffset;

      // Update xOffset for the next component set with spacing
      xOffset += componentSet.width + spacing;
    });

    figma.closePlugin();
  });
}
