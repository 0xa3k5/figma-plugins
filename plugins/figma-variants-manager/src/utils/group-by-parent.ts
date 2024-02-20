import { IComponent } from '../types';

export default function groupByParent(
  data: IComponent[]
): Record<string, IComponent[]> {
  return data.reduce(
    (acc, component) => {
      const parentId = component.parent?.id ?? component.id;

      if (!acc[parentId]) {
        acc[parentId] = [];
      }

      acc[parentId].push(component);
      return acc;
    },
    {} as Record<string, IComponent[]>
  );
}
