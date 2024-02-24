import { h } from 'preact';

interface Props {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
}

export default function Toggle({ isOn, onToggle }: Props): h.JSX.Element {
  const handleToggle = () => {
    onToggle(!isOn);
  };

  return (
    <span className="group flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-4 w-7 items-center rounded-full hover:cursor-default focus:outline-none ${
          isOn ? 'bg-bg-brand' : 'bg-bg-disabled'
        }`}
      >
        <span
          className={`duration-200 ease-in-out group-active:h-3 group-active:w-4 ${
            isOn ? 'translate-x-4 group-active:translate-x-3' : 'translate-x-0'
          } inline-block size-4 transform rounded-full bg-white shadow transition-all`}
        />
      </button>
    </span>
  );
}
