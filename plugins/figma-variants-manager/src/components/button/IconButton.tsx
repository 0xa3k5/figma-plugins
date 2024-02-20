import { h, JSX } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props {
  onClick: () => void;
  className?: string;
}

export default function IconButton({
  children,
  className,
  onClick,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <button
      type="button"
      className={`${className} flex size-8 shrink-0 items-center justify-center overflow-clip rounded-sm text-text duration-150 hover:bg-bg-hover`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
