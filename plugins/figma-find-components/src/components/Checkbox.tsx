import { h, JSX } from 'preact';

interface Props {
  value: boolean;
  onChange: h.JSX.GenericEventHandler<HTMLInputElement>;
  className?: string;
}

export default function Checkbox({
  value,
  onChange,
  className,
}: Props): JSX.Element {
  return (
    <input
      type="checkbox"
      className={`${className} inline-flex h-4 w-4 flex-shrink-0 rounded-md bg-opacity-40 duration-150 checked:border-transparent checked:bg-blue-500 checked:bg-opacity-100 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-40`}
      checked={value}
      onChange={onChange}
      style={{
        border: '1px solid rgb(59,130,246)',
      }}
    />
  );
}
