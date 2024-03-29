import { once, showUI } from '@create-figma-plugin/utilities';
import { focusOnNodes } from '@repo/utils';

import { CreateAll, CreateSvgFrame, ICryptoIcon } from './types';

const CreateOneSvg = (
  icon: ICryptoIcon,
  asComponent: boolean,
  variant: 'black' | 'icon' | 'white' | 'color'
) => {
  const svgNode = figma.createNodeFromSvg(icon.path[`${variant}`]);

  svgNode.name = `${icon.name}/${variant}`;

  if (asComponent) {
    const svgComponent = figma.createComponent();

    svgComponent.name = `${icon.name}/${variant}`;
    svgComponent.layoutMode = 'HORIZONTAL';
    svgComponent.primaryAxisSizingMode = 'AUTO';
    svgComponent.counterAxisSizingMode = 'AUTO';
    svgComponent.appendChild(svgNode);

    focusOnNodes({
      nodeIds: [svgComponent.id],
      notification: `${icon.name} is created`,
    });
  } else {
    focusOnNodes({
      nodeIds: [svgNode.id],
      notification: `${icon.name} is created`,
    });
  }
  figma.closePlugin();
};

const CreateAllSvg = (
  icons: ICryptoIcon[],
  asComponent: boolean,
  variant: 'black' | 'icon' | 'white' | 'color'
) => {
  const parentFrame = figma.createFrame();

  parentFrame.name = 'Crypto Currency Icons';
  parentFrame.layoutMode = 'VERTICAL';
  parentFrame.itemSpacing = 16;
  parentFrame.verticalPadding = 16;
  parentFrame.horizontalPadding = 16;
  parentFrame.primaryAxisSizingMode = 'AUTO';
  parentFrame.counterAxisSizingMode = 'AUTO';
  parentFrame.fills = [
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, visible: false },
  ];

  const numPerRow = 20;
  const rows: FrameNode[] = [];
  const svgComponents: ComponentNode[] = [];

  for (let i = 0; i < icons.length; i += numPerRow) {
    const rowIcons = icons.slice(i, i + numPerRow);
    const rowFrame = figma.createFrame();

    rowFrame.name = 'row';
    rowFrame.layoutMode = 'HORIZONTAL';
    rowFrame.itemSpacing = 16;
    rowFrame.primaryAxisSizingMode = 'AUTO';
    rowFrame.counterAxisSizingMode = 'AUTO';
    rowFrame.fills = [
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, visible: false },
    ];
    rows.push(rowFrame);
    rowIcons.forEach((icon) => {
      const svgNode = figma.createNodeFromSvg(icon.path[`${variant}`]);

      svgNode.name = `${icon.name}/${variant}`;

      if (asComponent) {
        const svgComponent = figma.createComponent();

        svgComponent.name = icon.name;
        svgComponent.layoutMode = 'HORIZONTAL';
        svgComponent.primaryAxisSizingMode = 'AUTO';
        svgComponent.counterAxisSizingMode = 'AUTO';
        svgComponent.appendChild(svgNode);

        svgComponents.push(svgComponent);
        rowFrame.appendChild(svgComponent);
      } else {
        rowFrame.appendChild(svgNode);
      }
    });

    parentFrame.appendChild(rowFrame);
  }

  if (asComponent) {
    figma.ungroup(parentFrame);
    rows.forEach((row) => {
      figma.ungroup(row);
    });

    const combinedComponents = figma.combineAsVariants(
      svgComponents,
      figma.currentPage
    );

    combinedComponents.name = 'Crypto Currency Icons';

    focusOnNodes({ nodeIds: [combinedComponents.id] });
  } else {
    focusOnNodes({
      nodeIds: [parentFrame.id],
      notification: 'all icons created',
    });
  }
  figma.closePlugin();
};

export default function () {
  once<CreateSvgFrame>(
    'CREATE_SVG_FRAME',
    (
      icon: ICryptoIcon,
      asComponent: boolean,
      variant: 'black' | 'icon' | 'white' | 'color'
    ) => {
      CreateOneSvg(icon, asComponent, variant);
    }
  );
  once<CreateAll>(
    'CREATE_ALL',
    (
      icons: ICryptoIcon[],
      asComponent: boolean,
      variant: 'black' | 'icon' | 'white' | 'color'
    ) => {
      CreateAllSvg(icons, asComponent, variant);
    }
  );
  showUI({ height: 600, width: 400 });
}
