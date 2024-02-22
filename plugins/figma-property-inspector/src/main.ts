import { emit, on, showUI } from '@create-figma-plugin/utilities';

// import { SceneNode, VariableBindableNodeField } from '@figma/plugin-typings';
import {
  AssignVariableHandler,
  GetVariableCollectionsHandler,
  GetVariablesHandler,
  InspectPageHandler,
  IVariable,
  IVariableCollection,
  PropertyType,
  PropertyTypeValues,
  ResizeWindowHandler,
  UpdatePageDataHandler,
  ValueSelectHandler,
} from './types';

const processPropertyValue = (
  node: SceneNode,
  propValue: number,
  direction: string,
  type: PropertyType,
  sizingData: PropertyTypeValues
) => {
  // todo: boundVariable Check

  if (propValue > 0) {
    const key = propValue.toString();

    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
    }
    if (!sizingData[key][type][direction]) {
      sizingData[key][type][direction] = { count: 0, nodes: [] };
    }
    sizingData[key][type][direction].count += 1;
    sizingData[key][type][direction].nodes.push(node);
  }
};

const propertyToBindableNodeField: {
  [key: string]: { [direction: string]: VariableBindableNodeField[] };
} = {
  padding: {
    left: ['paddingLeft'],
    right: ['paddingRight'],
    top: ['paddingTop'],
    bottom: ['paddingBottom'],
    vertical: ['paddingTop', 'paddingBottom'],
    horizontal: ['paddingLeft', 'paddingRight'],
  },
  radius: {
    'bottom-left': ['bottomLeftRadius'],
    'bottom-right': ['bottomRightRadius'],
    'top-left': ['topLeftRadius'],
    'top-right': ['topRightRadius'],
    all: ['bottomLeftRadius', 'bottomRightRadius', 'topLeftRadius', 'topRightRadius'],
  },
  gap: {
    HORIZONTAL: ['itemSpacing'],
    VERTICAL: ['itemSpacing'],
  },
};

const processValues = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const isAutoLayout =
    'layoutMode' in node &&
    node.layoutMode !== 'NONE' &&
    node.primaryAxisAlignItems !== 'SPACE_BETWEEN';
  // const hasStroke = "strokes" in node && node.strokes.length > 0 && "strokeLeftWeight" in node;
  const hasCornerRadius = 'cornerRadius' in node && 'topLeftRadius' in node;

  if (isAutoLayout) {
    const { paddingLeft, paddingTop, paddingRight, paddingBottom, itemSpacing } = node;

    const isHorizontal = paddingLeft === paddingRight;
    const isVertical = paddingTop === paddingBottom;

    const hasVerticalVariable =
      isVertical && node.boundVariables?.paddingTop && node.boundVariables.paddingBottom;
    const hasHorizontalVariable =
      isHorizontal && node.boundVariables?.paddingRight && node.boundVariables.paddingLeft;

    if (isHorizontal && isVertical) {
      hasHorizontalVariable ??
        processPropertyValue(node, paddingLeft, 'horizontal', PropertyType.PADDING, sizingData);
      hasVerticalVariable ??
        processPropertyValue(node, paddingTop, 'vertical', PropertyType.PADDING, sizingData);
    } else if (isHorizontal) {
      hasHorizontalVariable ??
        processPropertyValue(node, paddingLeft, 'horizontal', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingTop ??
        processPropertyValue(node, paddingTop, 'top', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingBottom ??
        processPropertyValue(node, paddingBottom, 'bottom', PropertyType.PADDING, sizingData);
    } else if (isVertical) {
      hasVerticalVariable ??
        processPropertyValue(node, paddingTop, 'vertical', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingLeft ??
        processPropertyValue(node, paddingLeft, 'left', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingRight ??
        processPropertyValue(node, paddingRight, 'right', PropertyType.PADDING, sizingData);
    } else {
      node.boundVariables?.paddingLeft ??
        processPropertyValue(node, paddingLeft, 'left', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingTop ??
        processPropertyValue(node, paddingTop, 'top', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingRight ??
        processPropertyValue(node, paddingRight, 'right', PropertyType.PADDING, sizingData);
      node.boundVariables?.paddingBottom ??
        processPropertyValue(node, paddingBottom, 'bottom', PropertyType.PADDING, sizingData);
    }

    node.boundVariables?.itemSpacing ??
      processPropertyValue(node, itemSpacing, node.layoutMode, PropertyType.GAP, sizingData);
  }

  if (hasCornerRadius) {
    const { topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } = node;

    const isAllRadius = topLeftRadius === topRightRadius && bottomLeftRadius === bottomRightRadius;
    const hasAllVariable =
      isAllRadius &&
      node.boundVariables?.bottomLeftRadius &&
      node.boundVariables.bottomRightRadius &&
      node.boundVariables.topLeftRadius &&
      node.boundVariables.topRightRadius;

    if (isAllRadius) {
      hasAllVariable ??
        processPropertyValue(node, topLeftRadius, 'all', PropertyType.RADIUS, sizingData);
    } else {
      node.boundVariables?.topLeftRadius ??
        processPropertyValue(node, topLeftRadius, 'top-left', PropertyType.RADIUS, sizingData);
      node.boundVariables?.topRightRadius ??
        processPropertyValue(node, topRightRadius, 'top-right', PropertyType.RADIUS, sizingData);
      node.boundVariables?.bottomLeftRadius ??
        processPropertyValue(
          node,
          bottomLeftRadius,
          'bottom-left',
          PropertyType.RADIUS,
          sizingData
        );
      node.boundVariables?.bottomRightRadius ??
        processPropertyValue(
          node,
          bottomRightRadius,
          'bottom-right',
          PropertyType.RADIUS,
          sizingData
        );
    }
  }

  // if (hasStroke) {
  //   const { strokeLeftWeight, strokeRightWeight, strokeTopWeight, strokeBottomWeight } = node;

  //   processPropertyValue(node, strokeLeftWeight, "left", PropertyType.STROKE, sizingData);
  //   processPropertyValue(node, strokeTopWeight, "top", PropertyType.STROKE, sizingData);
  //   processPropertyValue(node, strokeRightWeight, "right", PropertyType.STROKE, sizingData);
  //   processPropertyValue(node, strokeBottomWeight, "bottom", PropertyType.STROKE, sizingData);
  // }
};

const updateSizingData = (nodeSizingData: PropertyTypeValues, sizingData: PropertyTypeValues) => {
  Object.keys(nodeSizingData).forEach((key) => {
    if (!sizingData[key]) {
      sizingData[key] = { padding: {}, gap: {}, stroke: {}, radius: {} };
    }

    const updatePropertyData = (type: PropertyType) => {
      const propertyData = nodeSizingData[key][type];

      Object.keys(propertyData).forEach((direction) => {
        if (!sizingData[key][type][direction]) {
          sizingData[key][type][direction] = { count: 0, nodes: [] };
        }
        sizingData[key][type][direction].count += propertyData[direction].count;
        sizingData[key][type][direction].nodes.push(...propertyData[direction].nodes);
      });
    };

    Object.values(PropertyType).map((type) => updatePropertyData(type));
  });
};

const getSingleVariable = (variableId: string): IVariable | null => {
  const res = figma.variables.getVariableById(variableId);

  if (res) {
    return {
      id: res.id,
      name: res.name,
      key: res.key,
      scopes: res.scopes,
      valuesByMode: res.valuesByMode,
      codeSyntax: res.codeSyntax,
      description: res.description,
      remote: res.remote,
      resolvedType: res.resolvedType,
      variableCollectionId: res.variableCollectionId,
    } as IVariable;
  }
  return null;
};

const getFloatVariables = (): IVariable[] => {
  return figma.variables.getLocalVariables('FLOAT').map((v) => {
    return {
      id: v.id,
      name: v.name,
      key: v.key,
      scopes: v.scopes,
      valuesByMode: v.valuesByMode,
      codeSyntax: v.codeSyntax,
      description: v.description,
      remote: v.remote,
      resolvedType: v.resolvedType,
      variableCollectionId: v.variableCollectionId,
    };
  });
};

const getVariableCollections = (): IVariableCollection[] => {
  return figma.variables.getLocalVariableCollections().map((col) => {
    return {
      id: col.id,
      defaultModeId: col.defaultModeId,
      hiddenFromPublishing: col.hiddenFromPublishing,
      key: col.key,
      modes: col.modes,
      name: col.name,
      variableIds: col.variableIds,
    };
  });
};

const inspectNode = (node: SceneNode, sizingData: PropertyTypeValues) => {
  const nodeSizingData: PropertyTypeValues = {};

  processValues(node, sizingData);
  updateSizingData(nodeSizingData, sizingData);

  if ('children' in node) {
    node.children.forEach((childNode) => {
      inspectNode(childNode, sizingData);
    });
  }
};

let properties: PropertyTypeValues = {};

const inspectPage = () => {
  properties = {};
  const nodeData = figma.currentPage.children;

  nodeData.forEach((node) => {
    inspectNode(node, properties);
  });

  figma.notify(
    `${nodeData.length === 0 ? 'there is no inspectable nodes' : `Inspected: ${figma.currentPage.name}`}`
  );
  emit<GetVariableCollectionsHandler>('GET_VARIABLE_COLLECTIONS', getVariableCollections());
  emit<GetVariablesHandler>('GET_VARIABLES', getFloatVariables());
  emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', properties);
};

const getVariables = () => {
  emit<GetVariableCollectionsHandler>('GET_VARIABLE_COLLECTIONS', getVariableCollections());
  emit<GetVariablesHandler>('GET_VARIABLES', getFloatVariables());
};

const inspectSelection = () => {
  properties = {};
  const nodeData = figma.currentPage.selection;

  if (nodeData.length === 0) {
    inspectPage();
  }

  nodeData.forEach((node) => {
    inspectNode(node, properties);
  });

  emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', properties);
};

export default function (): void {
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    function (windowSize: { width: number; height: number }): void {
      const { width, height } = windowSize;

      figma.ui.resize(width, height);
    }
  );

  on<InspectPageHandler>('INSPECT_PAGE', (): void => {
    properties = {};
    const nodeData = figma.currentPage.children;

    nodeData.forEach((node) => {
      inspectNode(node, properties);
    });

    emit<GetVariableCollectionsHandler>('GET_VARIABLE_COLLECTIONS', getVariableCollections());
    emit<GetVariablesHandler>('GET_VARIABLES', getFloatVariables());
    emit<UpdatePageDataHandler>('UPDATE_PAGE_DATA', properties);
  });

  // on<GetSingleVariableHandler>('GET_SINGLE_VARIABLE', getSingleVariable(variableId))

  on<AssignVariableHandler>('ASSIGN_VARIABLE', (data): void => {
    const nodesArray: SceneNode[] = [];

    const assignVariable = (dir: string) => {
      const nodesForDirection = properties[data.key][data.type][dir]?.nodes || [];

      nodesForDirection.forEach((nodeData) => {
        const node = figma.getNodeById(nodeData.id) as SceneNode;

        if (node) {
          nodesArray.push(node);
          const fields = propertyToBindableNodeField[data.type][dir];

          fields.map((field) => {
            node.setBoundVariable(field, data.variableId);
          });
        }
        figma.currentPage.selection = nodesArray;
      });
    };

    // assign to given direction
    if (data.direction !== undefined) {
      assignVariable(data.direction);
    } else {
      // assign to all directions
      for (const dir of Object.keys(properties[data.key][data.type])) {
        assignVariable(dir);
      }
    }
  });

  on<ValueSelectHandler>('VALUE_SELECT', (data): void => {
    const nodesArray = properties[data.key][data.type][data.direction].nodes
      .map((node) => {
        return figma.getNodeById(node.id);
      })
      .filter(Boolean) as SceneNode[];

    figma.currentPage.selection = nodesArray;
    figma.viewport.scrollAndZoomIntoView(nodesArray);
  });

  figma.on('run', () => {
    getVariables();
    inspectPage();
  });
  figma.on('currentpagechange', () => inspectPage());
  // figma.on('selectionchange', () => inspectSelection())

  showUI({
    width: 420,
    height: 512,
  });
}
