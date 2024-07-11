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
  FindAllInstances,
  GetLibraries,
  GetLocalMissing,
  GetThisInstance,
  ReplaceInstances,
  ResizeWindowHandler,
  ScanLibrary,
  SelectNodes,
  TLibrary,
  UpdateRemoteMissingInstances,
  UpdateLocalMissing,
  UpdateUserLibraries,
} from './types';

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

const getUserLibraries = async () => {
  const libKeys = await figma.clientStorage.keysAsync();
  const userLibraries: TLibrary[] = [];

  for (const key of libKeys) {
    const componentKeys = await figma.clientStorage.getAsync(key);
    userLibraries.push({ name: key, components: componentKeys });
  }

  emit<UpdateUserLibraries>('UPDATE_USER_LIBRARIES', userLibraries);
  return userLibraries;
};

const getMainsInPage = async () => {
  const mains = await getNodesByType({
    types: ['COMPONENT'],
    context: { page: figma.currentPage },
  });
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

  on<ClearLibraries>('CLEAR_LIBRARIES', async (key?: string) => {
    if (key) {
      await figma.clientStorage.deleteAsync(key);
      figma.notify(`🗑️ Deleted: ${key}`);
      await getUserLibraries();
      return;
    }
    const keys = await figma.clientStorage.keysAsync();

    keys.forEach(async (key) => {
      await figma.clientStorage.deleteAsync(key);
    });

    if (keys.length > 1) {
      figma.notify(`🗑️ Deleted: ${keys.length} libraries`);
      return;
    }

    figma.notify(`🗑️ Deleted: ${key}`);
    await getUserLibraries();
  });

  on<GetLibraries>('GET_LIBRARIES', async () => await getUserLibraries());

  on<ScanLibrary>('SCAN_LIBRARY', async () => {
    await figma.loadAllPagesAsync();

    const componentKeys: string[] = [];

    try {
      const cmp = await getNodesByType({
        types: ['COMPONENT'],
        context: { root: true },
      });

      cmp.forEach((c) => {
        if (c.key) {
          componentKeys.push(c.key);
        }
      });
    } catch (err) {
      console.log('err', err);
    }

    await figma.clientStorage.setAsync(
      figma.root.name ?? 'default',
      componentKeys
    );
    await getUserLibraries();
  });

  const findRemoteMissingInstances = async () => {
    // await figma.loadAllPagesAsync();
    const instances = await getNodesByType({
      types: ['INSTANCE'],
      context: { page: figma.currentPage },
      // context: { root: true },
    });

    const libKeys = await getUserLibraries();

    if (libKeys.length === 0) {
      figma.notify('No libraries found, scan a library to start');
      return;
    }

    const remoteMissing: IInstance[] = [];

    instances.forEach((instance) => {
      if (!instance.mainComponent) {
        return;
      }

      if (instance.mainComponent.remote) {
        const exists = libKeys.find(
          (lib) => lib.components.includes(instance.mainComponent!.key) // ! because we check it before??
        );

        if (!exists) {
          remoteMissing.push(instance);
        }
      }
    });

    figma.notify(`Found: ${remoteMissing.length} missing components`);
    emit<UpdateRemoteMissingInstances>(
      'UPDATE_REMOTE_MISSING_INSTANCES',
      remoteMissing
    );
  };

  on<GetThisInstance>('GET_THIS_INSTANCE', getMainsInPage);

  on<FindAllInstances>('FIND_ALL_INSTANCES', findRemoteMissingInstances);

  on<DetachInstances>('DETACH_INSTANCES', (instances: IInstance[]) => {
    const detachedFrames: FrameNode[] = [];

    instances.forEach(async (instance) => {
      const instanceNode = (await figma.getNodeByIdAsync(
        instance.id
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
        node: (await figma.getNodeByIdAsync(instance.id)) as InstanceNode,
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
            (await figma.getNodeByIdAsync(instance.id)) as InstanceNode
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
