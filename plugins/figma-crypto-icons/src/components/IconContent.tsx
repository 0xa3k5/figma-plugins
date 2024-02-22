import { h } from 'preact';
import { VerticalSpace } from '@create-figma-plugin/ui';
import styles from '../css/input.css';
import { ICryptoIcon } from '../types';
import CryptoIconCard from './CryptoIconCard';
import { StateUpdater } from 'preact/hooks';

interface IconContentProps {
  shownIcons: ICryptoIcon[];
  variant: 'black' | 'color' | 'icon' | 'white';
  selectedIcon: ICryptoIcon;
  setSelectedIcon: StateUpdater<ICryptoIcon>;
}

export default function IconContent({
  shownIcons,
  variant,
  selectedIcon,
  setSelectedIcon,
}: IconContentProps) {
  return (
    <div>
      <VerticalSpace space="large" />
      <div class={styles['icon-card-wrapper']}>
        {shownIcons.map((i: ICryptoIcon) => {
          return (
            <CryptoIconCard
              icon={i}
              variant={variant}
              isSelected={selectedIcon === i}
              setSelectedIcon={setSelectedIcon}
            />
          );
        })}
      </div>
    </div>
  );
}
