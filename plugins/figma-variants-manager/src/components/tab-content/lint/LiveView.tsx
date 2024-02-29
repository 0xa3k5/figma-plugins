import { IconComponent } from '@repo/ui';
import {
  convertString,
  IComponent,
  IComponentSet,
  NamingConvention,
} from '@repo/utils';
import { h } from 'preact';

import { LintType } from '../../../types';

interface LiveViewProps {
  conventions: Record<LintType, NamingConvention | null>;
  categoryToggle: Record<LintType, boolean>;
  selectedComponents: (IComponent | IComponentSet)[];
}

export default function LiveView({
  conventions,
  selectedComponents,
  categoryToggle,
}: LiveViewProps): h.JSX.Element {
  let comp: { name: string; properties: string[] } = {
    name: 'select a component',
    properties: ['namingConvention=camelCase', 'livePreview=true'],
  };

  if (selectedComponents.length > 0) {
    comp =
      'parent' in selectedComponents[0]
        ? {
            name: selectedComponents[0].parent?.name ?? comp.name,
            properties: selectedComponents[0].properties ?? comp.properties,
          }
        : {
            name: selectedComponents[0].name ?? 'component name',
            properties: selectedComponents[0].properties ?? comp.properties,
          };
  }

  return (
    <div className="text-text-oninverse bg-bg-inverse sticky top-0 z-50 flex h-32 w-full flex-col overflow-hidden whitespace-nowrap px-2 py-4 drop-shadow-md">
      <div className="flex h-fit w-full items-center">
        <IconComponent />
        <span className="text-sm">
          {conventions.componentName
            ? convertString({
                str: comp.name,
                convention: conventions.componentName,
              })
            : comp.name}
        </span>
      </div>
      <div className="flex flex-col gap-2 pl-6">
        {comp.properties.slice(0, 3).map((prop, index) => {
          const [key, value] = prop.split('=');

          return (
            <div key={index} className="flex items-center text-sm">
              <span
                className={`duration-150
                    ${
                      categoryToggle.propName && conventions.propName
                        ? 'opacity-100'
                        : 'text-text-oninverse opacity-60'
                    }`}
              >
                {categoryToggle.propName && conventions.propName
                  ? convertString({
                      str: key,
                      convention: conventions.propName,
                    })
                  : key}
              </span>
              <span
                className={
                  categoryToggle.propValue && conventions.propValue
                    ? 'opacity-100'
                    : 'text-text-oninverse opacity-60'
                }
              >
                =
                {categoryToggle.propValue && conventions.propValue
                  ? convertString({
                      str: value,
                      convention: conventions.propValue,
                    })
                  : value}
              </span>
            </div>
          );
        })}
        {comp.properties.length > 3 && (
          <span className="text-text-oninverse mt-1 text-xs">
            {comp.properties.length - 3} more ...
          </span>
        )}
      </div>
    </div>
  );
}
