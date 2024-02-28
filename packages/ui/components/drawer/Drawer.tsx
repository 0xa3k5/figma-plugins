import { h } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { StateUpdater, useEffect, useRef } from 'preact/hooks';

interface DrawerProps {
  isOpen: boolean;
  setIsOpen: StateUpdater<boolean>;
}

const Drawer = ({
  isOpen,
  setIsOpen,
  children,
}: PropsWithChildren<DrawerProps>): h.JSX.Element => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle click outside the drawer
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Handle the escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // Disable background scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);

      document.body.style.overflow = '';
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 w-full ${isOpen ? 'block' : 'hidden'}`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black opacity-60" />
      <div
        ref={drawerRef}
        className={`bg-bg fixed right-0 top-0 h-full w-64 overflow-auto shadow-md transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
