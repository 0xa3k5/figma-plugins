import { ILocalInstance } from '../types';

export default function groupByPage(
  components: Record<string, ILocalInstance[]>
): Record<string, Record<string, ILocalInstance[]>> {
  const grouped: Record<string, Record<string, ILocalInstance[]>> = {};

  Object.keys(components).forEach((mainCompName) => {
    const groupedByPageName = components[mainCompName].reduce(
      (acc, componentInstance) => {
        const pageName = componentInstance.page.name;
        acc[pageName] = acc[pageName] || [];
        acc[pageName].push(componentInstance);
        return acc;
      },
      {} as Record<string, ILocalInstance[]>
    );
    grouped[mainCompName] = groupedByPageName;
  });

  return grouped;
}
