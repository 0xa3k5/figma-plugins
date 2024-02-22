import { Button, IconButton, IconTarget16 } from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { VariableIcon } from '../../icons';
import {
  GetSingleVariableHandler,
  InspectPageHandler,
  IVariable,
  PropertyType,
  PropertyTypeValues,
} from '../../types';
import { getIcon } from '../../utils';
import { handleAssignVariable, handleValueSelect } from '../../utils/event-handlers';

interface AutoFixTabProps {
  pageData: PropertyTypeValues | null;
  variables: IVariable[];
}

interface IMatchingVariable {
  propertyKey: string;
  variable: IVariable;
  propertyType: PropertyType;
  direction: string;
}

function findAllowedProperties(variable: IVariable): string[] {
  const allowedPropertyTypes: PropertyType[] = [];
  const hasVariableScopes = variable.scopes.length > 0;
  // console.log('variable', variable);
  // console.log('hasVariableScopes', hasVariableScopes);

  if (hasVariableScopes) {
    // console.log('has');
    // all
    if (variable.scopes.includes('ALL_SCOPES')) {
      // console.log('all');
      Object.values(PropertyType).map((type) => allowedPropertyTypes.push(type));
    }
    // can assign to radius
    if (variable.scopes.includes('CORNER_RADIUS')) {
      // console.log('radius');
      allowedPropertyTypes.push(PropertyType.RADIUS);
    }
    // can assign padding & gap
    if (variable.scopes.includes('GAP')) {
      // console.log('gap');
      allowedPropertyTypes.push(PropertyType.GAP);
      allowedPropertyTypes.push(PropertyType.PADDING);
    }
  }

  return allowedPropertyTypes;
}

export default function TabAutoFix({ pageData, variables }: AutoFixTabProps): h.JSX.Element {
  const [matchingVariables, setMatchingVariables] = useState<IMatchingVariable[]>([]);

  // Type guard to ensure that a string is a key of PropertyType
  function isPropertyType(key: string): key is keyof typeof PropertyType {
    return Object.values(PropertyType).includes(key as PropertyType);
  }

  const getAssignableVariables = (pageData: PropertyTypeValues, variables: IVariable[]) => {
    const assignableVariables: {
      propertyKey: string;
      propertyType: PropertyType;
      variable: IVariable;
      direction: string;
    }[] = [];

    function processVariable(variable: IVariable, numberValue: string) {
      if (pageData[numberValue]) {
        Object.keys(pageData[numberValue])
          .filter((pType) => findAllowedProperties(variable).includes(pType))
          .filter(isPropertyType)
          .forEach((pType) => {
            const directions = Object.keys(pageData[numberValue][pType as PropertyType]);

            directions.forEach((direction) => {
              assignableVariables.push({
                propertyKey: numberValue,
                propertyType: pType as PropertyType,
                variable,
                direction,
              });
            });
          });
      }
    }

    variables.forEach((variable) => {
      Object.values(variable.valuesByMode).forEach((value: VariableValue) => {
        if (typeof value === 'number') {
          const numberValue = value.toString();

          processVariable(variable, numberValue);
        }
        if (Object.values(value).find((v) => v === 'VARIABLE_ALIAS')) {
          const variable = value as VariableAlias;
          const asasda = emit<GetSingleVariableHandler>('GET_SINGLE_VARIABLE', variable.id);
          // processVariable(variable);
        }
      });
    });

    return assignableVariables;
  };

  useEffect(() => {
    if (pageData && variables) {
      const assignableVars = getAssignableVariables(pageData, variables);

      setMatchingVariables(assignableVars);
    }
  }, [pageData, variables]);

  // useEffect(() => {
  //   if (pageData && variables) {
  //     const assignableVariables: {
  //       propertyKey: string;
  //       propertyType: PropertyType;
  //       variable: IVariable;
  //       direction: string;
  //     }[] = [];

  //     variables.map((variable): any => {
  //       const valuesByMode = Object.values(variable.valuesByMode);

  //       valuesByMode.map((value) => {
  //         if (typeof value === 'number') {
  //           const numberValue = value.toString();
  //           if (pageData[numberValue]) {
  //             const propertyTypesOfData = Object.keys(pageData[numberValue]);

  //             propertyTypesOfData.map((pType) => {
  //               const allowedPropertyTypes = findAllowedProperties(variable);
  //               if (allowedPropertyTypes.includes(pType)) {
  //                 if (isPropertyType(pType)) {
  //                   console.log(pType);
  //                   const directions = Object.keys(pageData[numberValue][pType as PropertyType]);

  //                   if (directions.length > 0) {
  //                     directions.map((direction) => {
  //                       assignableVariables.push({
  //                         propertyKey: numberValue,
  //                         variable,
  //                         propertyType: pType as PropertyType,
  //                         direction,
  //                       });
  //                     });
  //                   }
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       });
  //     });
  //     setMatchingVariables(assignableVariables);
  //   }
  // }, [pageData, variables]);

  const groupedByVariables: { [key: string]: IMatchingVariable[] } = {};

  matchingVariables.forEach((variable) => {
    const { propertyKey } = variable;

    if (!groupedByVariables[propertyKey]) {
      groupedByVariables[propertyKey] = [];
    }
    groupedByVariables[propertyKey].push(variable);
  });

  // no local variables
  if (variables.length === 0) {
    return (
      <div className="flex size-full items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-yellow-500 bg-opacity-20">
            <span className="text-3xl">😢</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-lg">no local variables found on this file</h3>
            <p className="opacity-60">add a new # number variable to start</p>
          </div>
          <Button
            onClick={() => {
              emit<InspectPageHandler>('INSPECT_PAGE');
            }}
          >
            Scan the file
          </Button>
        </div>
      </div>
    );
  }

  // no appliable fixes
  if (Object.entries(groupedByVariables).length === 0) {
    return (
      <div className="flex size-full items-center justify-center pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-yellow-500 bg-opacity-20">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-lg">you fixed them all</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(groupedByVariables).map(([propertyKey, cardVariables]) => {
        return <AutofixCard propertyKey={propertyKey} cardVariables={cardVariables} />;
      })}
    </div>
  );
}

interface ChildProps {
  propertyKey: string;
  cardVariables: IMatchingVariable[];
}

function AutofixCard({ propertyKey, cardVariables }: ChildProps): h.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      key={propertyKey}
      className="flex w-full flex-col justify-between rounded-xl p-4"
      style={{
        border: '1px solid var(--figma-color-border)',
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500 bg-opacity-60 p-2">
            <span className="text-lg">{propertyKey}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">
              {Array.from(new Set(cardVariables.map((variable) => variable.variable.name))).join(
                ', '
              )}
            </span>
            <button
              className="w-fit text-xs opacity-60 hover:opacity-100"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {cardVariables.map((variable) => variable.propertyType).length} Properties
            </button>
          </div>
        </div>
        <Button
          onClick={() => {
            cardVariables.map(({ propertyType, propertyKey, variable }) =>
              handleAssignVariable(propertyKey, propertyType, variable)
            );
          }}
          secondary
        >
          Fix
        </Button>
      </div>
      {isExpanded && (
        <div className="flex w-full flex-col pl-11 pt-2">
          {cardVariables.map(({ propertyType, direction, propertyKey, variable }) => (
            <div
              key={`${propertyKey}_${propertyType}_${direction}`}
              className="group flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-xs opacity-60 duration-200 group-hover:opacity-100">
                <span>{getIcon(propertyType, direction.toLowerCase())}</span>
                <span>{`${propertyType}-${direction.toLowerCase()}`}</span>
              </div>
              <div className="flex gap-2">
                <span className="flex opacity-0 duration-100 group-hover:opacity-100">
                  <IconButton
                    onClick={() => handleValueSelect(propertyKey, propertyType, direction)}
                  >
                    <IconTarget16 />
                  </IconButton>
                </span>
                <span className="flex opacity-0 duration-100 group-hover:opacity-100">
                  <IconButton
                    onClick={() => {
                      handleAssignVariable(propertyKey, propertyType, variable, direction);
                    }}
                  >
                    <VariableIcon />
                  </IconButton>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
