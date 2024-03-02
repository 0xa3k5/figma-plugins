import { ChoiceChip } from '@repo/ui';
import { h } from 'preact';

import { IScope } from '../../types';

interface Props {
  label: string;
  currentScope: IScope;
  onChange: (opt: IScope) => void;
}

const scope: IScope[] = ['page', 'all pages'];

export default function ScopeSelector({
  label,
  currentScope,
  onChange,
}: Props): h.JSX.Element {
  return (
    <div className="flex w-fit items-center gap-1">
      <span className="text-text-secondary mr-2">{label}</span>
      {scope.map((opt) => (
        <ChoiceChip
          id={opt}
          key={opt}
          value={opt}
          checked={currentScope === opt}
          onChange={() => onChange(opt)}
        />
      ))}
    </div>
  );
}
