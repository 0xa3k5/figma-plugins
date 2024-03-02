import { ComponentChildren, h } from 'preact';

export const Layout = ({
  children,
}: {
  children: ComponentChildren;
}): h.JSX.Element => {
  return <div className="mb-16 flex w-full flex-col px-4">{children}</div>;
};
