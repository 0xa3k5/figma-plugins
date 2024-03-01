import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { ChoiceChip, IconSettings } from '@repo/ui';
import { convertString, IComponent, IComponentSet } from '@repo/utils';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import {
  FindLintErrors,
  FixLintErrors,
  HandleSelectionChange,
  ILintError,
  ILintSettings,
  LintSettingsChange,
  LintType,
} from '../../../types';
import { ButtonDock, IconButton } from '../../button';
import LintComponentHeader from './LintComponentHeader';
import LintDisplay from './LintDisplay';
import LintSettingsDrawer from './LintSettingsDrawer';

const categories: LintType[] = ['componentName', 'propName', 'propValue'];

const getUniqueErrorsByType = (
  errors: ILintError[],
  type: LintType
): ILintError[] => {
  const uniqueErrors = new Map<string, ILintError>();

  errors.forEach((error) => {
    error.errors
      .filter((err) => err.type === type)
      .forEach((err) => {
        const key = `${type}-${err.value}`;

        if (!uniqueErrors.has(key)) {
          uniqueErrors.set(key, { ...error, errors: [err] });
        }
      });
  });

  return Array.from(uniqueErrors.values());
};

export default function Lint(): h.JSX.Element {
  const [lintSettings, setLintSettings] = useState<ILintSettings>({
    conventions: {
      componentName: 'camelCase',
      propName: 'camelCase',
      propValue: 'kebab-case',
    },
    toggles: {
      componentName: true,
      propName: false,
      propValue: false,
    },
    applyScope: 'page',
  });
  const [lintErrors, setLintErrors] = useState<Record<string, ILintError[]>>(
    {}
  );
  const [selectedComponents, setSelectedComponents] = useState<
    (IComponent | IComponentSet)[]
  >([]);
  const [selectedErrors, setSelectedErrors] = useState<ILintError[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  const handleToggleChange = (category: LintType) => {
    const newSettings = {
      ...lintSettings,
      toggles: {
        ...lintSettings.toggles,
        [category]: !lintSettings.toggles[category],
      },
    };

    setLintSettings(newSettings);
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', newSettings);
  };

  on<FindLintErrors>('FIND_LINT_ERRORS', (lintErrors) => {
    setLintErrors(lintErrors);
  });

  useEffect(() => {
    const newIsExpanded = Object.keys(lintErrors).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setIsExpanded(newIsExpanded);
  }, [lintErrors]);

  const handleSelectError = (error: ILintError, isSelected: boolean) => {
    if (isSelected) {
      setSelectedErrors((prev) => [...prev, error]);
    } else {
      setSelectedErrors((prev) => prev.filter((e) => e.id !== error.id));
    }
  };

  const handleExpandToggle = (parentId: string) => {
    setIsExpanded((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleFixSelected = () => {
    emit<FixLintErrors>('FIX_LINT_ERRORS', selectedErrors);
  };

  on<HandleSelectionChange>('HANDLE_SELECTION_CHANGE', (components) => {
    setSelectedComponents(components);
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col p-4">
        <div className="flex w-full justify-between">
          <div className="flex w-fit gap-1">
            {categories.map((category) => (
              <ChoiceChip
                key={`${category}`}
                id={`${category}`}
                value={convertString({
                  str: category,
                  convention: 'Title Case',
                })}
                checked={lintSettings.toggles[category]}
                onChange={() => handleToggleChange(category)}
              />
            ))}
          </div>
          <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <IconSettings />
          </IconButton>
        </div>
        <div className="flex h-full flex-col">
          {Object.entries(lintErrors).map(([parentId, errors]) => {
            return (
              <div
                key={parentId}
                className="border-border group flex w-full flex-col gap-2 border-b py-4"
              >
                <LintComponentHeader
                  errors={errors}
                  parentId={parentId}
                  isExpanded={isExpanded[parentId]}
                  setIsExpanded={handleExpandToggle}
                />
                {isExpanded[parentId] && (
                  <div className="no-scrollbar ml-6 flex w-full flex-col overflow-x-scroll">
                    {categories.map((category) => {
                      const uniqueErrors = getUniqueErrorsByType(
                        Object.values(lintErrors).flat(),
                        category
                      );

                      return uniqueErrors.length > 0 ? (
                        <div
                          key={category}
                          className="flex w-full flex-col gap-2 pb-4"
                        >
                          <span className="text-text-danger font-semibold">
                            {convertString({
                              str: category,
                              convention: 'Title Case',
                            })}
                          </span>
                          {uniqueErrors.map((error, index) => (
                            <LintDisplay
                              key={`${category}-${error.nodeId}-${index}`}
                              error={error}
                              isSelected={selectedErrors.includes(error)}
                              onToggleErrorSelection={handleSelectError}
                            />
                          ))}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <LintSettingsDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        lintSettings={lintSettings}
        setLintSettings={setLintSettings}
        lintCategories={categories}
        selectedComponents={selectedComponents}
        handleToggleChange={handleToggleChange}
      />
      <ButtonDock className="">
        <Button onClick={handleFixSelected}>
          {`Fix Selected (${selectedErrors.length})`}
        </Button>
        <Button
          onClick={() =>
            emit<FixLintErrors>(
              'FIX_LINT_ERRORS',
              Object.values(lintErrors).flat()
            )
          }
        >
          {`Fix All ${Object.values(lintErrors).flat().length}`}
        </Button>
      </ButtonDock>
    </div>
  );
}
