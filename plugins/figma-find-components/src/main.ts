import { emit, on, showUI } from '@create-figma-plugin/utilities';
import gdsJson from './gds.json';
import GDSKEYS from './gds-keys.json';
import {
  deleteInstance,
  focusOnNodes,
  getNodePage,
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
  GetNodeByID,
  GetRemoteMissing,
  GetThisInstance,
  ReplaceInstances,
  ResizeWindowHandler,
  ScanLibrary,
  SelectNodes,
  TLibrary,
  UpdateInstances,
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

const getMainsInPage = async () => {
  const mains = await getNodesByType({
    types: ['COMPONENT'],
    context: { page: figma.currentPage },
  });

  console.log('mains', mains);
};

const getThisInstance = () => {
  const nodes: BaseNode[] = [];
  const mainKeys: string[] = [];
  figma.currentPage.selection.map(async (node) => {
    const baseNode = await figma.getNodeByIdAsync(node.id);
    if (baseNode) {
      nodes.push(baseNode);
    }
  });

  nodes.forEach(async (node) => {
    if (node.type !== 'INSTANCE') {
      figma.notify('Select an instance');
      return;
    }

    const main = await node.getMainComponentAsync();
    if (!main) {
      return;
    }

    if (main.type === 'COMPONENT') {
      mainKeys.push(main.key);
    }
  });

  console.log('mainKeys', mainKeys);
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
    await figma.loadAllPagesAsync();

    const components: string[] = [];

    try {
      const cmp = await getNodesByType({
        types: ['COMPONENT'],
        context: { root: true },
      });

      cmp.forEach((c) => {
        if (c.key) {
          components.push(c.key);
        }
      });
    } catch (err) {
      console.log('err', err);
    }

    console.log('lib', components);
  });

  const findAllInstances = async () => {
    // await figma.loadAllPagesAsync();
    const instances = await getNodesByType({
      types: ['INSTANCE'],
      context: { page: figma.currentPage },
      // context: { root: true },
    });

    const notInGDS: IInstance[] = [];

    instances.forEach((instance) => {
      // ignore hidden instances
      if (instance.mainComponent) {
        if (instance.mainComponent.remote) {
          const InGDS = (GDSKEYS as string[]).find(
            (key) => key === instance.mainComponent?.key
          );
          if (!InGDS) {
            console.log('not in GDS', instance);
            notInGDS.push(instance);
          }
        }
      }
    });

    emit<UpdateInstances>('UPDATE_INSTANCES', notInGDS);
    console.log('notInGDS', notInGDS);
  };

  on<GetThisInstance>('GET_THIS_INSTANCE', getMainsInPage);

  on<GetNodeByID>('GET_NODE_BY_ID', async () => {
    const node = await figma.getNodeByIdAsync('36148:91067');

    if (!node || node.type === 'PAGE' || node.type === 'DOCUMENT') {
      figma.notify('nope');
      return;
    }
    figma.currentPage.selection = [node];
    console.log('node', node);
  });

  on<FindAllInstances>('FIND_ALL_INSTANCES', findAllInstances);

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
