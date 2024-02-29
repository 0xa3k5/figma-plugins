import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { ChoiceChip, IconComponent, IconSettings, IconTarget } from '@repo/ui';
import {
  ComponentFocusHandler,
  convertString,
  IComponent,
  IComponentSet,
} from '@repo/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';

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
import LintDisplay from './LintDisplay';
import LintSettingsDrawer from './LintSettingsDrawer';

const categories: LintType[] = ['componentName', 'propName', 'propValue'];

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

  const handleToggleChange = (category: LintType) => {
    setLintSettings((prev) => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [category]: !prev.toggles[category],
      },
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', lintSettings);
  };

  on<FindLintErrors>('FIND_LINT_ERRORS', (lintErrors) => {
    setLintErrors(lintErrors);
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
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
                key={`${category}_${'ak'}`}
                id={`${category}_${'ak'}`}
                value={convertString({
                  str: category,
                  convention: 'Title Case',
                })}
                checked={lintSettings['toggles'][category]}
                onChange={() => handleToggleChange(category)}
              />
            ))}
          </div>
          <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <IconSettings />
          </IconButton>
        </div>
        <ul className="flex h-full flex-col py-4">
          {Object.entries(lintErrors).map(([parentId, errors]) => (
            <li
              key={parentId}
              className="border-border group flex w-full flex-col gap-2 border-b pb-4"
            >
              <span className="flex w-full justify-between">
                <span className="text-text-component flex items-center gap-1">
                  <IconComponent />
                  <span className={`text-xs font-semibold capitalize`}>
                    {errors[0]?.parent?.name ?? errors[0]?.name}
                  </span>
                </span>
                <IconButton
                  onClick={() => handleFocusComponents(parentId)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <IconTarget />
                </IconButton>
              </span>
              <span className="flex flex-col gap-2 pl-7">
                {['componentName', 'propName', 'propValue'].map((errorType) => (
                  <div key={errorType}>
                    <span className="text-text-danger font-semibold">
                      {convertString({
                        str: errorType,
                        convention: 'Title Case',
                      })}
                    </span>
                    {errors
                      .filter((error) =>
                        error.errors.some((e) => e.type === errorType)
                      )
                      .map((error, index) => {
                        return (
                          <LintDisplay
                            key={`${errorType}-${index}`}
                            error={error}
                            lintSettings={lintSettings}
                          />
                        );
                      })}
                  </div>
                ))}
              </span>
            </li>
          ))}
        </ul>
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
