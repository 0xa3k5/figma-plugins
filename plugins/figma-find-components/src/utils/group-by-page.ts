import { IInstance } from '@repo/utils';
export default function groupByPage(
  components: Record<string, IInstance[]>
): Record<string, Record<string, IInstance[]>> {
  const grouped: Record<string, Record<string, IInstance[]>> = {};

  Object.keys(components).forEach((mainCompId) => {
    const groupedByPageName = components[mainCompId].reduce(
      (acc, componentInstance) => {
        const pageName = componentInstance.page?.name ?? 'root';

        acc[pageName] = acc[pageName] || [];
        acc[pageName].push(componentInstance);
        return acc;
      },
      {} as Record<string, IInstance[]>
    );

    grouped[mainCompId] = groupedByPageName;
  });

  return grouped;
}
