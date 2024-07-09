import { IComponent, IComponentSet, IInstance } from './types';
import { getNodePage } from './utils';

export const mapComponentNodeToIComponent = (
  node: ComponentNode
): IComponent | null => {
  if (node === null) {
    console.log({ node });
    return null;
  }
  return {
    id: node.id,
    name: node.name,
    key: node.key,
    parent:
      node.parent !== null && node.parent.type === 'COMPONENT_SET'
        ? mapComponentSetNodeToIComponentSet(node.parent) ?? undefined
        : undefined,
    remote: node.remote,
    page: getNodePage(node),
    // properties:
    //   node.parent !== null && node.parent.type === 'COMPONENT_SET'
    //     ? null
    //     : node.componentPropertyDefinitions,
  };
};

export const mapInstanceNodeToIInstance = async (
  node: InstanceNode
): Promise<IInstance> => {
  return {
    id: node.id,
    name: node.name,
    visible: node.visible,
    mainComponent:
      mapComponentNodeToIComponent(
        (await node.getMainComponentAsync()) as ComponentNode
      ) ?? undefined, // instances must have a main component
    page: getNodePage(node),
  };
};

export const mapComponentSetNodeToIComponentSet = (
  node: ComponentSetNode
): IComponentSet | null => {
  if (node === null) {
    console.log({ node });
    return null;
  }

  return {
    id: node.id,
    name: node.name,
    page: getNodePage(node),
    remote: node.remote,
    // properties: node.componentPropertyDefinitions,
  };
};
