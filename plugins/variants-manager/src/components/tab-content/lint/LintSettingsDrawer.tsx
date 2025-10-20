import { emit } from '@create-figma-plugin/utilities';
import { ChoiceChip, Drawer, Toggle } from '@repo/ui';
import { convertString, NamingConvention } from '@repo/utils';
import { h } from 'preact';

import { ILintSettings, LintSettingsChange, LintType } from '../../../types';

interface Props {
  isDrawerOpen: boolean;
  lintSettings: ILintSettings;
  lintCategories: LintType[];
  // eslint-disable-next-line no-unused-vars
  setIsDrawerOpen: (value: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setLintSettings: (value: ILintSettings) => void;
  // eslint-disable-next-line no-unused-vars
  handleToggleChange: (category: LintType) => void;
}

const conventions: NamingConvention[] = [
  'camelCase',
  'PascalCase',
  'Title Case',
  'kebab-case',
  'snake_case',
];

export default function LintSettingsDrawer(props: Props): h.JSX.Element {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    lintSettings,
    lintCategories,
    handleToggleChange,
    setLintSettings,
  } = props;

  const handleConventionChange = (
    category: LintType,
    value: NamingConvention | null
  ) => {
    const updatedSettings = {
      ...lintSettings,
      conventions: {
        ...lintSettings.conventions,
        [category]: value,
      },
    };

    setLintSettings(updatedSettings);
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', updatedSettings);
    return updatedSettings;
  };

  return (
    <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
      <div className="border-border flex w-full border-b py-4 font-semibold">
        <div className="flex w-full px-4">
          <span className="text-sm">Lint Settings</span>
        </div>
      </div>
      {/* <LiveView
        conventions={lintSettings['conventions']}
        selectedComponents={selectedComponents}
        categoryToggle={lintSettings['toggles']}
      /> */}
      <div className="mb-24 flex h-full flex-col">
        {lintCategories.map((category) => {
          return (
            <div
              key={category}
              className="border-border flex flex-col gap-4 border-b p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${lintSettings['toggles'][category] ? 'text-text font-semibold' : 'text-text-secondary'}`}
                >
                  {convertString({
                    str: category,
                    convention: 'Title Case',
                  })}
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
              isOn={lintSettings['ignoreLocalComponents']}
              onToggle={() => {
                setLintSettings({
                  ...lintSettings,
                  ignoreLocalComponents: !lintSettings.ignoreLocalComponents,
                });
              }}
            />
          </div>
          {lintSettings['ignoreLocalComponents'] && (
            <span className="text-text-secondary">
              Components that start with underscore (_) or dot (.) are ignored.
            </span>
          )}
        </div>
      </div>
    </Drawer>
  );
}
