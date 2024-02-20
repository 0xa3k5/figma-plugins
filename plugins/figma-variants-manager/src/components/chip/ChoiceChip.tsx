import { h } from 'preact';

interface Props {
  value: string;
  checked: boolean;
  onChange: (opt: string) => void;
}

export default function ChoiceChip({ value, checked, onChange }: Props) {
  return (
    <label
      htmlFor={value.replace(/[^a-zA-Z0-9-_]/g, '')}
      className="group relative inline-flex items-center duration-200"
    >
      <input
        id={value.replace(/[^a-zA-Z0-9-_]/g, '')}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span
        className={`flex flex-grow-0 items-center gap-1 rounded-md border border-border px-2 py-1 duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
          checked ? 'bg-bg-inverse text-text-oninverse' : 'text-text'
        }`}
      >
        {value}
      </span>
    </label>
  );
}
