import { Button } from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import {
  ChoiceChip,
  Drawer,
  IconComponent,
  IconSettings,
  IconTarget,
  Toggle,
} from '@repo/ui';
import {
  ComponentFocusHandler,
  convertString,
  IComponent,
  IComponentSet,
  NamingConvention,
} from '@repo/utils';
import { h } from 'preact';
import { useState } from 'preact/hooks';

import {
  ApplyScope,
  FindLintErrors,
  FixLintErrors,
  HandleSelect,
  ILintError,
  ILintSettings,
  LintSettingsChange,
  LintType,
} from '../../../types';
import ButtonDock from '../../button/ButtonDock';
import IconButton from '../../button/IconButton';
import LiveView from './live-view/LiveView';

const conventions: NamingConvention[] = [
  'camelCase',
  'PascalCase',
  'kebab-case',
  'snake_case',
];

const categories: LintType[] = ['componentName', 'propName', 'propValue'];

const applyScope: ApplyScope[] = ['selection', 'page', 'all pages'];

export default function Lint(): h.JSX.Element {
  const [userSettings, setUserSettings] = useState<ILintSettings>({
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
  const [lintErrors, setLintErrors] = useState<
    Record<string, Record<LintType, ILintError[]>>
  >({});

  const [selectedErrors, setSelectedErrors] = useState<ILintError[]>([]);

  const handleConventionChange = (
    category: LintType,
    value: NamingConvention | null
  ) => {
    setUserSettings((prev) => ({
      ...prev,
      conventions: {
        ...prev.conventions,
        [category]: value,
      },
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', userSettings);
  };

  const handleToggleChange = (category: LintType) => {
    setUserSettings((prev) => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [category]: !prev.toggles[category],
      },
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', userSettings);
  };
  const handleApplyScopeChange = (scope: ApplyScope) => {
    setUserSettings((prev) => ({
      ...prev,
      applyScope: scope,
    }));
    emit<LintSettingsChange>('LINT_SETTINGS_CHANGE', userSettings);
  };

  const [selectedComponents, setSelectedComponents] = useState<
    (IComponent | IComponentSet)[]
  >([]);

  on<HandleSelect>('HANDLE_SELECT', (components) => {
    setSelectedComponents(components);
  });

  on<FindLintErrors>('FIND_LINT_ERRORS', (lintErrors) => {
    setLintErrors(lintErrors);
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const replaceLogic = ({
    userSettings,
    error,
  }: {
    userSettings: ILintSettings;
    error: {
      type: LintType;
      value: string;
    };
  }) => {
    const { conventions } = userSettings;

    if (error.type === 'componentName') {
      return convertString({
        str: error.value,
        convention: conventions.componentName!,
      });
    }

    if (error.type === 'propName') {
      return convertString({
        str: error.value,
        convention: conventions.propName!,
      });
    }
    if (error.type === 'propValue') {
      return convertString({
        str: error.value,
        convention: conventions.propValue!,
      });
    }

    return 'fuck this shit';
  };

  const handleFocusComponents = (parentId: string) => {
    emit<ComponentFocusHandler>('FOCUS_COMPONENT', parentId);
  };

  const handleSelectError = (error: ILintError) => {
    console.log(error);
    setSelectedErrors((prev) => [...prev, error]);
    console.log('selectedErr', error);
    emit<FixLintErrors>('FIX_LINT_ERRORS', selectedErrors);
  };

  return (
    <div className="flex h-full flex-col">
      <ul className="flex h-full flex-col px-2 py-4">
        {Object.entries(lintErrors).map(([parentId, errorTypes]) => (
          <span
            key={parentId}
            className="border-border group flex w-full flex-col gap-2 border-b"
          >
            <span className="flex w-full justify-between">
              <span className="text-text-component flex items-center gap-1">
                <IconComponent />
                <span className={`text-xs font-semibold capitalize`}>
                  {errorTypes.componentName[0]?.parent?.name ||
                    errorTypes.componentName[0]?.name}
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
              {Object.entries(errorTypes).map(([errorType, errors]) => (
                <span key={errorType}>
                  {userSettings['toggles'][errorType as LintType] && (
                    <span className="text-text-danger font-semibold">
                      {convertString({
                        str: errorType,
                        convention: 'Title Case',
                      })}
                    </span>
                  )}
                  {errors.map((error, index) => (
                    <LintDisplay
                      key={`${errorType}-${index}`}
                      currentName={error.errors[0]?.value}
                      correctedName={replaceLogic({
                        userSettings,
                        error: error.errors[0],
                      })}
                      onClick={() => handleSelectError(error)}
                    />
                  ))}
                </span>
              ))}
            </span>
          </span>
        ))}
      </ul>
      <div className="relative w-full">
        <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
          <LiveView
            conventions={userSettings['conventions']}
            selectedComponents={selectedComponents}
            categoryToggle={userSettings['toggles']}
          />
          <div className="mb-24 flex h-full flex-col">
            {categories.map((category) => {
              return (
                <div
                  key={category}
                  className="border-border flex flex-col gap-4 border-b p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs capitalize ${userSettings['toggles'][category] ? 'text-text font-semibold' : 'text-text-secondary'}`}
                    >
                      {category}
                    </span>
                    <Toggle
                      isOn={userSettings['toggles'][category]}
                      onToggle={() => handleToggleChange(category)}
                    />
                  </div>
                  {userSettings['toggles'][category] && (
                    <div className="no-scrollbar flex gap-1 overflow-x-scroll">
                      {conventions.map((convention) => {
                        return (
                          <ChoiceChip
                            id={`${convention}_${category}`}
                            checked={
                              userSettings['conventions'][category] ===
                              convention
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
                    console.log('toglge');
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
                      checked={userSettings['applyScope'] === opt}
                      onChange={() => handleApplyScopeChange(opt)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Drawer>
      </div>

      <ButtonDock className="">
        <Button
          onClick={() => {
            emit<FixLintErrors>('FIX_LINT_ERRORS', selectedErrors);
          }}
        >
          Fix
        </Button>
        <IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <IconSettings />
        </IconButton>
      </ButtonDock>
    </div>
  );
}

interface LintDisplayProps {
  currentName: string;
  correctedName: string;
  onClick: () => void;
}

export function LintDisplay({
  currentName,
  correctedName,
  onClick,
}: LintDisplayProps): h.JSX.Element {
  return (
    <button className="flex flex-col gap-2" onClick={onClick}>
      <div className="flex gap-1">
        <span className="text-text-secondary line-through">{currentName}</span>
        <span className="text-text">-&gt; {correctedName}</span>
      </div>
    </button>
  );
}
