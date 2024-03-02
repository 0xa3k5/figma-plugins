import { h } from 'preact';
interface Props {
  id: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function ChoiceChip({
  id,
  value,
  checked,
  onChange,
  className,
}: Props): h.JSX.Element {
  return (
    <label
      htmlFor={id}
      className={`border-border group relative flex flex-grow flex-nowrap items-center 
        gap-1 whitespace-nowrap rounded-full border px-3 py-1 duration-200 active:scale-95
        ${checked ? 'bg-bg-inverse text-text-oninverse border-transparent' : 'text-text-secondary'}
        ${className} `}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={() => onChange()}
      />
      {value}
    </label>
  );
}
