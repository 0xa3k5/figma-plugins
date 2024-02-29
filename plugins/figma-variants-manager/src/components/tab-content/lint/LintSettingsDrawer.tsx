import { emit } from '@create-figma-plugin/utilities';
import { ChoiceChip, Drawer, Toggle } from '@repo/ui';
import { IComponent, IComponentSet, NamingConvention } from '@repo/utils';
import { h } from 'preact';
import { StateUpdater } from 'preact/hooks';

import {
  ILintSettings,
  IScope,
  LintSettingsChange,
  LintType,
} from '../../../types';
import LiveView from './LiveView';

interface Props {
  isDrawerOpen: boolean;
  setIsDrawerOpen: StateUpdater<boolean>;
  lintSettings: ILintSettings;
  setLintSettings: StateUpdater<ILintSettings>;
  lintCategories: LintType[];
  selectedComponents: (IComponent | IComponentSet)[];
  handleToggleChange: (category: LintType) => void;
}

const conventions: NamingConvention[] = [
  'camelCase',
  'PascalCase',
  'kebab-case',
  'snake_case',
];

const applyScope: IScope[] = ['selection', 'page', 'all pages'];

export default function LintSettingsDrawer(props: Props): h.JSX.Element {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    lintSettings,
    lintCategories,
    selectedComponents,
    handleToggleChange,
    setLintSettings,
  } = props;

  const handleConventionChange = (
    category: LintType,
    value: NamingConvention | null
  ) => {
    setLintSettings((prev) => ({
      ...prev,
      conventions: {
        ...prev.conventions,
        [category]: value,
      },
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', lintSettings);
  };
  const handleApplyScopeChange = (scope: IScope) => {
    setLintSettings((prev) => ({
      ...prev,
      applyScope: scope,
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', lintSettings);
  };

  return (
    <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
      <LiveView
        conventions={lintSettings['conventions']}
        selectedComponents={selectedComponents}
        categoryToggle={lintSettings['toggles']}
      />
      <div className="mb-24 flex h-full flex-col">
        {lintCategories.map((category) => {
          return (
            <div
              key={category}
              className="border-border flex flex-col gap-4 border-b p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs capitalize ${lintSettings['toggles'][category] ? 'text-text font-semibold' : 'text-text-secondary'}`}
                >
                  {category}
                </span>
                <Toggle
                  isOn={lintSettings['toggles'][category]}
                  onToggle={() => handleToggleChange(category)}
                />
              </div>
              {lintSettings['toggles'][category] && (
                <div className="no-scrollbar flex gap-1 overflow-x-scroll">
                  {conventions.map((convention) => {
                    return (
                      <ChoiceChip
                        id={`${convention}_${category}`}
                        checked={
                          lintSettings['conventions'][category] === convention
                        }
                        onChange={() =>
                          handleConventionChange(category, convention)
                        }
                        value={convention}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="border-border flex flex-col gap-4 border-b p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs">Ignore Local Components</span>
            <Toggle
              isOn={false}
              onToggle={() => {
                console.log('toglge'); // todo
              }}
            />
          </div>
        </div>
        <div className="border-border flex flex-col gap-4 border-b p-4">
          <span className="text-xs">Apply to</span>
          <div className="flex w-fit gap-1">
            {applyScope.map((opt) => {
              return (
                <ChoiceChip
                  id={opt}
                  key={opt}
                  value={opt}
                  checked={lintSettings['applyScope'] === opt}
                  onChange={() => handleApplyScopeChange(opt)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
