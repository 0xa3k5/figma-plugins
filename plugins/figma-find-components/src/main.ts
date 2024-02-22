import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  GetLocalMissing,
  IComponent,
  ILocalInstance,
  TLibrary,
  ResizeWindowHandler,
  SelectNodes,
  UpdateLocalMissing,
  UpdateUserLibraries,
  GetLibraries,
  UpdateRemoteComponents,
  DetachInstances,
  DeleteInstances,
  ReplaceInstances,
  GetRemoteMissing,
  ScanLibrary,
  ClearLibraries,
} from './types';
import { compareWithLibrary } from './utils';

const getPage = (node: BaseNode): PageNode | null => {
  if (node.type === 'PAGE') {
    return node;
  }
  if (node.parent) {
    return getPage(node.parent);
  }
  return null;
};

const nodeDelete = (node: InstanceNode) => {
  try {
    node.remove();
  } catch (err) {
    const detachedFrame = node.detachInstance();
    detachedFrame.remove();
  }
};

let localMissingData: {
  missingInstances: ILocalInstance[];
  components: IComponent[];
} = { missingInstances: [], components: [] };

const updateLocalMissingData = (updatedInstances: ILocalInstance[]) => {
  localMissingData.missingInstances = localMissingData.missingInstances.filter(
    (instance) =>
      !updatedInstances.some(
        (updatedInstance) => updatedInstance.id === instance.id
      )
  );
};

const getUserLibraries = async (): Promise<TLibrary[]> => {
  const userLibraries =
    (await figma.clientStorage.getAsync('userLibraries')) || {};
  console.log(userLibraries);
  const asdad: TLibrary[] = Object.keys(userLibraries).map(
    (libName) => userLibraries[libName]
  );
  return asdad;
};

const getNodesByType = (types: NodeType[]): SceneNode[] => {
  figma.skipInvisibleInstanceChildren = true;
  const nodes = figma.root.findAllWithCriteria({ types });
  return nodes.filter((node): node is SceneNode => node.type !== 'PAGE');
};

const getInstances = (): InstanceNode[] => {
  const instances = getNodesByType(['INSTANCE']);
  return instances.filter(
    (node): node is InstanceNode => node.type === 'INSTANCE'
  );
};

const getComponentSets = (): IComponent[] => {
  const componentSetNodes = getNodesByType(['COMPONENT_SET']);
  return componentSetNodes.map((componentSetNode) => ({
    id: componentSetNode.id,
    name: componentSetNode.name,
  }));
};

const getComponents = (): IComponent[] => {
  const componentNodes = getNodesByType(['COMPONENT']);

  return componentNodes.map((componentNode) => {
    const parentName =
      componentNode.parent?.type === 'COMPONENT_SET'
        ? componentNode.parent.name
        : null;

    return {
      id: componentNode.id,
      name: parentName || componentNode.name,
    };
  });
};

const figmaSelectNodes = (nodes: (BaseNode | null)[]) => {
  const sceneNodes = nodes
    .flatMap((node) => node || [])
    .flatMap((node) =>
      node.type !== 'DOCUMENT' && node.type !== 'PAGE' ? node : []
    );

  if (sceneNodes.length === 0) {
    figma.notify('This instance was deleted');
  } else {
    const page = getPage(sceneNodes[0]);
    if (page !== null) {
      figma.currentPage = page;
      figma.currentPage.selection = sceneNodes;
      figma.viewport.scrollAndZoomIntoView(sceneNodes);
    }
  }
};

export default function () {
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    (windowSize: { width: number; height: number }): void => {
      const { width, height } = windowSize;
      figma.ui.resize(width, height);
    }
  );

  on<SelectNodes>('SELECT_NODES', (component: ILocalInstance[]): void => {
    const nodesArr = component.map((c) => figma.getNodeById(c.id) as SceneNode);

    figmaSelectNodes(nodesArr);
  });

  on<GetLocalMissing>('GET_LOCAL_MISSING', () => {
    const components = [...getComponents(), ...getComponentSets()];
    const instances = getInstances();
    const missingArr: ILocalInstance[] = [];

    instances.forEach((instance: InstanceNode) => {
      const mainComp = components.find(
        (c) => c.id === instance.mainComponent?.id
      );
      if (!mainComp) {
        if (instance.mainComponent && !instance.mainComponent.remote) {
          const page = getPage(instance);
          if (page) {
            missingArr.push({
              id: instance.id,
              name: instance.name,
              mainComponent: {
                id: instance.mainComponent?.id,
                name: instance.mainComponent?.name,
              },
              page: {
                id: page.id,
                name: page.name,
              },
            });
          }
        }
      }
    });

    figma.notify(`Found: ${missingArr.length} missing components`);
    localMissingData = {
      missingInstances: missingArr,
      components,
    };

    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  on<ClearLibraries>('CLEAR_LIBRARIES', async () => {
    await figma.clientStorage.deleteAsync('userLibraries');
  });

  on<GetRemoteMissing>('GET_REMOTE_MISSING', async () => {
    const instances = getInstances();
    const userLibraries = await getUserLibraries();

    const remoteInstances: ILocalInstance[] = [];

    instances.forEach((instance) => {
      if (instance.mainComponent && instance.mainComponent.remote) {
        const page = getPage(instance);
        remoteInstances.push({
          id: instance.id,
          name: instance.name,
          page: {
            id: page?.id ?? 'unknown',
            name: page?.name ?? 'unknown',
          },
          mainComponent: {
            id: instance.mainComponent.id,
            name: instance.mainComponent.name,
          },
        });
      }
    });

    console.log('remote_INSTANCES', remoteInstances);
    const remoteMissing = compareWithLibrary(userLibraries, remoteInstances);

    // const grouped = groupByMain(remoteInstances);
    console.log('remoteMissing', remoteMissing);

    emit<UpdateRemoteComponents>('UPDATE_REMOTE_COMPONENTS', remoteMissing);
  });

  on<GetLibraries>('GET_LIBRARIES', async () => {
    const userLibraries = await getUserLibraries();
    emit<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', userLibraries);
  });

  on<ScanLibrary>('SCAN_LIBRARY', async () => {
    const componentData = new Set<IComponent>();

    const componentSets = getComponentSets();

    componentSets.forEach((compSet) => {
      const isExisting = [...componentData].some((c) => c.id === compSet.id);
      if (!isExisting) {
        componentData.add({
          id: compSet.id,
          name: compSet.name,
        });
      }
    });

    const components = getComponents();

    if (components) {
      components.forEach((component) => {
        const isExisting = [...componentData].some(
          (c) => c.id === component.id
        );
        // if (component.parent) {
        // if (component.parent.type === 'COMPONENT_SET' || component.parent.type === 'COMPONENT') {
        if (!isExisting) {
          componentData.add({
            id: component.id,
            name: component.name,
          });
          // }
          // }
        }
      });
    }

    const libraryName = figma.root.name;
    const userLibraries =
      (await figma.clientStorage.getAsync('userLibraries')) || {};

    userLibraries[libraryName] = {
      name: libraryName,
      components: [...componentData],
    };

    figma.clientStorage
      .setAsync('userLibraries', userLibraries)
      .then(() => {
        figma.notify(
          `${libraryName} is saved with ${componentData.size} components`
        );
        emit<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', userLibraries);
      })
      .catch((error) => {
        console.error('Error saving component data:', error);
      });
  });

  // on<FindRemoteMissingInstances>('FIND_REMOTE_MISSING', async () => {
  //   const userLibraries = await getUserLibraries();
  //   const instances = getInstances();

  //   const remoteMissingInstances = compareWithLibrary(userLibraries, instances);
  // });

  on<DetachInstances>('DETACH_INSTANCES', (instances: ILocalInstance[]) => {
    const instanceNodes = instances.map(
      (instance) => figma.getNodeById(instance.id) as SceneNode
    );
    const detachedFrames: FrameNode[] = [];
    instanceNodes.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        detachedFrames.push(node.detachInstance());
      }
    });
    figma.notify(`🔗 Detached: ${instanceNodes.length} instances`);
    figmaSelectNodes(detachedFrames);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  on<DeleteInstances>('DELETE_INSTANCES', (instances: ILocalInstance[]) => {
    const instanceNodes = instances.map((instance) =>
      figma.getNodeById(instance.id)
    );

    instanceNodes.forEach((node) => {
      if (node && node.type === 'INSTANCE') {
        nodeDelete(node);
      }
    });
    figma.notify(`🗑️ Deleted: ${instanceNodes.length} instances`);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  on<ReplaceInstances>('REPLACE_INSTANCES', ({ instances, replaceWith }) => {
    const instanceNodes = instances.map((instance) =>
      figma.getNodeById(instance.id)
    );
    const componentNode = figma.getNodeById(replaceWith.id);

    if (componentNode && componentNode.type === 'COMPONENT') {
      instanceNodes.forEach((instanceNode) => {
        if (instanceNode && instanceNode.type === 'INSTANCE') {
          // eslint-disable-next-line no-param-reassign
          instanceNode.mainComponent = componentNode;
        }
      });
    }

    figma.notify(
      `Replaced: ${instanceNodes.length} instances with ${componentNode?.name}`
    );
    figmaSelectNodes(instanceNodes);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  showUI({
    height: 512,
    width: 512,
  });
}
