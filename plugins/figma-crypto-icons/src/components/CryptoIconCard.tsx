import { h } from 'preact';
import { ICryptoIcon, IPaths } from '../types';
import { StateUpdater } from 'preact/hooks';
import styles from '../css/input.css';

interface CryptoIconCardProps {
  icon: ICryptoIcon;
  setSelectedIcon: StateUpdater<ICryptoIcon>;
  isSelected: boolean;
  variant: 'black' | 'color' | 'icon' | 'white';
}

export default function CryptoIconCard({
  icon,
  setSelectedIcon,
  isSelected,
  variant,
}: CryptoIconCardProps): h.JSX.Element {
  return (
    <div
      class={`${styles['icon-card']} ${isSelected && styles.selected}`}
      onClick={() => setSelectedIcon(icon)}
      tabIndex={0}
      key={icon.symbol}
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(
          icon.path[`${variant}`]
        )}`}
        alt={icon.name}
      />
    </div>
  );
}
