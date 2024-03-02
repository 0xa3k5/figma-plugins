import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { IconSettings } from '@repo/ui';
import { IComponent, IComponentSet } from '@repo/utils';
import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';

import {
  FindLintErrors,
  FixLintErrors,
  ILintError,
  ILintSettings,
  IScope,
  LintSettingsChange,
  LintType,
} from '../../../types';
import { ButtonDock, IconButton } from '../../button';
import { Layout } from '../../Layout';
import ScopeSelector from '../../scope-selector/ScopeSelector';
import LintErrorGroupCard from './LintErrorGroupCard';
import LintSettingsDrawer from './LintSettingsDrawer';

const categories: LintType[] = ['componentName', 'propName', 'propValue'];

export default function Lint(): h.JSX.Element {
  const [lintSettings, setLintSettings] = useState<ILintSettings>({
    conventions: {
      componentName: 'camelCase',
      propName: 'kebab-case',
      propValue: 'kebab-case',
    },
    toggles: {
      componentName: true,
      propName: true,
      propValue: true,
    },
    applyScope: 'page',
  });
  const [lintErrors, setLintErrors] = useState<Record<string, ILintError[]>>(
    {}
  );

  const [selectedErrors, setSelectedErrors] = useState<ILintError[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleFixSelected = () => {
    emit<FixLintErrors>('FIX_LINT_ERRORS', selectedErrors);
  };

  const handleScopeChange = (opt: IScope) => {
    setLintSettings({
      ...lintSettings,
      applyScope: opt,
    });
  };

  return (
    <Fragment>
      <Layout>
        <div className="flex size-full flex-col">
          <div className="flex w-full justify-between py-4">
            <ScopeSelector
              label="Lint in"
              currentScope={lintSettings.applyScope}
              onChange={handleScopeChange}
            />
            <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              <IconSettings />
            </IconButton>
          </div>
          <div className="-mx-4 flex h-full flex-col">
            {Object.entries(lintErrors).map((lintErr) => {
              return (
                <LintErrorGroupCard
                  className="last-of-type:border-y"
                  key={lintErr[0]}
                  errorGroup={lintErr}
                  selectedErrors={selectedErrors}
                  setSelectedErrors={setSelectedErrors}
                />
              );
            })}
          </div>
          <LintSettingsDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            lintSettings={lintSettings}
            setLintSettings={setLintSettings}
            lintCategories={categories}
            handleToggleChange={handleToggleChange}
          />
        </div>
      </Layout>
      <ButtonDock className="">
        <Button
          onClick={handleFixSelected}
          disabled={selectedErrors.length === 0}
        >
          Fix Selected
        </Button>
        <Button
          onClick={() =>
            emit<FixLintErrors>(
              'FIX_LINT_ERRORS',
              Object.values(selectedErrors).flat()
            )
          }
          disabled={Object.values(lintErrors).flat().length === 0}
        >
          {`Fix All ${Object.values(lintErrors).flat().length}`}
        </Button>
      </ButtonDock>
    </Fragment>
  );
}
