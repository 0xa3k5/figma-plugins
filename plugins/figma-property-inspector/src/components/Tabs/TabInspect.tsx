import { Button } from '@create-figma-plugin/ui';
import { h } from 'preact';

import { IVariable, IVariableCollection, PropertyTypeValues } from '../../types';
import { handleInspectPage } from '../../utils/event-handlers';
import BarChart from '../BarChart';
import ValueDisplay from '../ValueDisplay';

interface Props {
  pageData: PropertyTypeValues | null;
  keyUsageCounts: { [key: string]: number };
  variables: IVariable[];
  variableCollections: IVariableCollection[];
}

export default function TabInspect({
  pageData,
  keyUsageCounts,
  variables,
  variableCollections,
}: Props): h.JSX.Element {
  const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  if (!pageData || isObjectEmpty(pageData)) {
    return (
      <div className="flex size-full items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-blue-500 bg-opacity-20">
            <span className="text-3xl">👀</span>
          </div>
          <h3 className="text-center text-lg">
            Select something to inspect <br /> or inspect the full page
          </h3>
          <Button
            onClick={() => {
              handleInspectPage();
            }}
          >
            Inspect Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BarChart pageData={pageData} rawData={keyUsageCounts} title="" />
      {Object.entries(pageData).map(([key, value]) => {
        return (
          <div key={key}>
            <ValueDisplay
              propertyKey={key}
              totalCount={keyUsageCounts[key]}
              value={value}
              variables={variables}
              collections={variableCollections}
            />
          </div>
        );
      })}
    </div>
  );
}
