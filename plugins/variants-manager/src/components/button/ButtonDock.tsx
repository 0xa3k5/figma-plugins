import { h } from 'preact';
import { PropsWithChildren } from 'preact/compat';

interface ButtonDockProps {
  className?: string;
}

export default function ButtonDock({
  className,
  children,
}: PropsWithChildren<ButtonDockProps>): h.JSX.Element {
  return (
    <div
      className={`${className} border-border bg-bg fixed bottom-0 flex w-full items-center gap-2 border-t p-3`}
    >
      {children}
    </div>
  );
}
