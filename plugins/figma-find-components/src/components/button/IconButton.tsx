import { h } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props {
  className?: string;
  onClick: () => void;
}

export default function IconButton({
  className,
  children,
  onClick,
}: PropsWithChildren<Props>): h.JSX.Element {
  return (
    <button
      type="button"
      className={`${className} flex shrink-0 items-center rounded-lg p-1 text-black duration-150 hover:bg-black hover:bg-opacity-10 dark:text-white dark:hover:bg-white hover:dark:bg-opacity-20`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
