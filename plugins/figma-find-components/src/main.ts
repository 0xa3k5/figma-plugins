import { emit, on, showUI } from '@create-figma-plugin/utilities';
import {
  deleteInstance,
  focusOnNodes,
  getNodesByType,
  IComponent,
  IComponentSet,
  IInstance,
} from '@repo/utils';

import {
  ClearLibraries,
  DeleteInstances,
  DetachInstances,
  GetLibraries,
  GetLocalMissing,
  GetRemoteMissing,
  ReplaceInstances,
  ResizeWindowHandler,
  ScanLibrary,
  SelectNodes,
  TLibrary,
  UpdateLocalMissing,
  UpdateRemoteComponents,
  UpdateUserLibraries,
} from './types';
import { compareWithLibrary } from './utils';

let localMissingData: {
  missingInstances: IInstance[];
  components: (IComponent | IComponentSet)[];
} = { missingInstances: [], components: [] };

const updateLocalMissingData = (updatedInstances: IInstance[]) => {
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

export default function () {
  on<ResizeWindowHandler>(
    'RESIZE_WINDOW',
    (windowSize: { width: number; height: number }): void => {
      const { width, height } = windowSize;

      figma.ui.resize(width, height);
    }
  );

  on<SelectNodes>('SELECT_NODES', (component: IInstance[]): void => {
    focusOnNodes({ nodeIds: component.map((comp) => comp.id) });
  });

  on<GetLocalMissing>('GET_LOCAL_MISSING', async () => {
    const components = await getNodesByType({
      types: ['COMPONENT', 'COMPONENT_SET'],
    });
    const instances = getNodesByType({ types: ['INSTANCE'] });
    const missingArr: IInstance[] = [];

    (await instances).forEach(async (instance) => {
      const mainComp = components.find(
        (c) => c.id === instance.mainComponent?.id
      );

      if (!mainComp) {
        if (instance.mainComponent && !instance.mainComponent.remote) {
          missingArr.push(instance);
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
    const instances = getNodesByType({ types: ['INSTANCE'] });
    const userLibraries = await getUserLibraries();

    const remoteInstances: IInstance[] = [];

    (await instances).forEach((instance) => {
      if (instance.mainComponent && instance.mainComponent.remote) {
        remoteInstances.push(instance);
      }
    });

    // todo
    // console.log('remote_INSTANCES', remoteInstances);
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
    const componentData = new Set<IComponent | IComponentSet>();

    const components = getNodesByType({
      types: ['COMPONENT', 'COMPONENT_SET'],
    });

    if (components) {
      (await components).forEach((component) => {
        const isExisting = [...componentData].some(
          (c) => c.id === component.id
        );

        if (!isExisting) {
          componentData.add(component);
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

  on<DetachInstances>('DETACH_INSTANCES', (instances: IInstance[]) => {
    const detachedFrames: FrameNode[] = [];

    instances.forEach(async (instance) => {
      const instanceNode = (await figma.getNodeByIdAsync(
        instance.nodeId
      )) as InstanceNode;

      detachedFrames.push(instanceNode.detachInstance());
    });

    figma.notify(`🔗 Detached: ${detachedFrames.length} instances`);
    focusOnNodes({ nodeIds: detachedFrames.map((frame) => frame.id) });
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  on<DeleteInstances>('DELETE_INSTANCES', (instances: IInstance[]) => {
    instances.forEach(async (instance) => {
      deleteInstance({
        node: (await figma.getNodeByIdAsync(instance.nodeId)) as InstanceNode,
      });
    });
    figma.notify(`🗑️ Deleted: ${instances.length} instances`);
    updateLocalMissingData(instances);
    emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
      missing: localMissingData.missingInstances,
      components: localMissingData.components,
    });
  });

  on<ReplaceInstances>(
    'REPLACE_INSTANCES',
    async ({ instances, replaceWith }) => {
      const componentNode = await figma.getNodeByIdAsync(replaceWith.id);

      if (componentNode && componentNode.type === 'COMPONENT') {
        instances.forEach(async (instance) => {
          (
            (await figma.getNodeByIdAsync(instance.nodeId)) as InstanceNode
          ).mainComponent = componentNode;
        });
      }

      figma.notify(
        `Replaced: ${instances.length} instances with ${componentNode?.name}`
      );
      focusOnNodes({ nodeIds: instances.map((instance) => instance.id) });
      updateLocalMissingData(instances);
      emit<UpdateLocalMissing>('UPDATE_LOCAL_MISSING', {
        missing: localMissingData.missingInstances,
        components: localMissingData.components,
      });
    }
  );

  showUI({
    height: 512,
    width: 512,
  });
}
