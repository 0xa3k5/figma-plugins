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
      className={`${className} group relative inline-flex flex-grow flex-nowrap items-center duration-200 active:scale-95`}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={() => onChange()}
      />
      <span
        className={`border-border flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1 duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
          checked ? 'bg-bg-inverse text-text-oninverse' : 'text-text-secondary'
        }`}
      >
        {value}
      </span>
    </label>
  );
}
