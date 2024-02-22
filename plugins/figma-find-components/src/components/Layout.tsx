import { h, JSX } from 'preact';
import { PropsWithChildren } from 'preact/compat';

export default function Layout({ children }: PropsWithChildren): JSX.Element {
  return <div className="mb-12 mt-4 flex h-full w-full">{children}</div>;
}
