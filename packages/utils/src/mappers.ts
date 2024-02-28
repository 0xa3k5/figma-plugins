import { IComponent, IComponentSet, IInstance } from './types';
import { getNodePage } from './utils';

export const mapComponentNodeToIComponent = (
  node: ComponentNode
): IComponent => {
  return {
    id: node.id,
    name: node.name,
    nodeId: node.id,
    parent:
      node.parent && node.parent.type === 'COMPONENT_SET'
        ? mapComponentSetNodeToIComponentSet(node.parent)
        : undefined,
    remote: node.remote,
    page: getNodePage(node),
    properties: node.parent ? node.name.split(', ') : undefined,
  };
};

export const mapInstanceNodeToIInstance = (node: InstanceNode): IInstance => ({
  id: node.id,
  name: node.name,
  nodeId: node.id,
  mainComponent: mapComponentNodeToIComponent(
    node.mainComponent as ComponentNode
  ),
  page: getNodePage(node),
});

export const mapComponentSetNodeToIComponentSet = (
  node: ComponentSetNode
): IComponentSet => ({
  id: node.id,
  name: node.name,
  nodeId: node.id,
  page: getNodePage(node),
  remote: node.remote,
  properties: undefined, // todo
});
