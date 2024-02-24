import { IComponent, IComponentSet, IInstance } from './types';
import { getNodePage } from './utils';

export const mapComponentNodeToIComponent = (
  node: ComponentNode
): IComponent => ({
  id: node.id,
  name: node.name,
  node: node,
  parent: node.parent
    ? { id: node.parent.id, name: node.parent.name }
    : undefined,
  remote: node.remote,
  page: getNodePage(node),
  properties: node.name.split(', '),
});

export const mapInstanceNodeToIInstance = (node: InstanceNode): IInstance => ({
  id: node.id,
  name: node.name,
  node: node,
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
  node: node,
  page: getNodePage(node),
  remote: node.remote,
  properties: node.name.split(', '),
});
