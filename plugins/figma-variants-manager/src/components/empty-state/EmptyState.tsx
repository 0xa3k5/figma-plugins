import { h } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface Props {
  className?: string;
}

export default function EmptyState({
  className,
  children,
}: PropsWithChildren<Props>): h.JSX.Element {
  return (
    <div
      className={`${className} flex size-full flex-col items-center justify-center gap-4`}
    >
      {children}
    </div>
  );
}
