import { h, JSX } from 'preact';
import { ReactNode, PropsWithChildren } from 'preact/compat';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

export default function TextInput({
  label,
  placeholder,
  icon,
  value,
  onInput,
  children,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <div className="relative flex items-center gap-2 rounded-md border border-border px-2 focus-within:border-border-brand-strong">
      {icon && <span className="p-2">{icon}</span>}
      <input
        label={label}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
        className="h-8 w-full rounded-sm border bg-bg text-text placeholder:text-text-tertiary"
      />
      {children}
    </div>
  );
}
