import { ILocalInstance } from '../types';

export default function groupByMain(
  instances: ILocalInstance[]
): Record<string, ILocalInstance[]> {
  return instances.reduce(
    (acc, component) => {
      const mainComponentId = component.mainComponent.id;

      if (!acc[mainComponentId]) {
        acc[mainComponentId] = [];
      }

      acc[mainComponentId].push(component);
      return acc;
    },
    {} as Record<string, ILocalInstance[]>
  );
}
