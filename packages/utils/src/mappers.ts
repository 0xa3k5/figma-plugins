import { IComponent, IComponentSet, IInstance } from './types';
import { getNodePage } from './utils';

export const mapComponentNodeToIComponent = (
  node: ComponentNode
): IComponent => {
  return {
    id: node.id,
    name: node.name,
    parent:
      node.parent && node.parent.type === 'COMPONENT_SET'
        ? mapComponentSetNodeToIComponentSet(node.parent)
        : undefined,
    remote: node.remote,
    page: getNodePage(node),
    properties: node.componentPropertyDefinitions,
  };
};

export const mapInstanceNodeToIInstance = async (
  node: InstanceNode
): Promise<IInstance> => {
  return {
    id: node.id,
    name: node.name,
    nodeId: node.id,
    mainComponent: mapComponentNodeToIComponent(
      (await node.getMainComponentAsync()) as ComponentNode
    ), // instances must have a main component
    page: getNodePage(node),
  };
};

export const mapComponentSetNodeToIComponentSet = (
  node: ComponentSetNode
): IComponentSet => {
  return {
    id: node.id,
    name: node.name,
    page: getNodePage(node),
    remote: node.remote,
    properties: node.componentPropertyDefinitions,
  };
};
