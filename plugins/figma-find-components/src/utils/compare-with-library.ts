import { TLibrary, ILocalInstance, IComponent } from '../types';

export default function compareWithLibrary(
  libraries: TLibrary[],
  instances: ILocalInstance[]
): ILocalInstance[] {
  const libraryComponentIds = new Set<string>();
  const libComps: IComponent[] = [];

  // console.log('libraries', libraries);

  libraries.forEach((library) => {
    console.log('mylib', library);
    Object.keys(library).forEach((key) => {
      if (key === 'components') {
        library[key].components.map((comp) => libComps.push(comp));
      }
    });

    // library.components.components.map((comp) => libComps.push(comp));
  });
  console.log('libComps', libComps);

  // libraries.forEach((library) => {
  //   Object.values(library).forEach((lib) => {
  //     console.log(library);
  //     lib.components.forEach((component) => {
  //       libraryComponentIds.add(component.id);
  //     });
  //   });
  // });

  // Filter instances that are not found in any library
  const missingInstances = instances.filter(
    (instance) => !libraryComponentIds.has(instance.id)
  );

  return missingInstances;
}
