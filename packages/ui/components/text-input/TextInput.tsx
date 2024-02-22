import { h, JSX } from 'preact';
import { PropsWithChildren, ReactNode } from 'preact/compat';

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
    <div className="border-border focus-within:border-border-brand-strong relative flex items-center gap-2 rounded-md border px-2">
      {icon && <span className="p-2">{icon}</span>}
      <input
        label={label}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
        className="bg-bg text-text placeholder:text-text-tertiary h-8 w-full rounded-sm border"
      />
      {children}
    </div>
  );
}
