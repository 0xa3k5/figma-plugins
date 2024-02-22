import { h } from 'preact';
import { PropsWithChildren } from 'preact/compat';

export default function Layout({ children }: PropsWithChildren): h.JSX.Element {
  return <div className="mb-12 mt-4 flex size-full">{children}</div>;
}
