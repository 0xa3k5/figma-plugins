import { h } from 'preact';

interface Props {
  text: string;
  position: 'left' | 'right';
}

export default function Tooltip({ text, position }: Props): h.JSX.Element {
  return (
    <div
      className={`absolute ${position}-0 z-50 mt-4 max-w-sm whitespace-nowrap rounded-sm bg-black p-2 text-white`}
    >
      {text}
    </div>
  );
}
