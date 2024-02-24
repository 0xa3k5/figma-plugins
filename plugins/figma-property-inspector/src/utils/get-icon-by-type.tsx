import { IconGap, IconPadding, IconRadius, IconStroke } from '@repo/ui';
import { h } from 'preact';

import { PropertyType } from '../types';

export const getIcon = (type: PropertyType, direction: string) => {
  if (type === 'padding') {
    <IconPadding
      direction={direction as 'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal'}
    />;
  }
  if (type === 'gap') {
    return <IconGap direction={direction as 'vertical' | 'horizontal'} />;
  }
  if (type === 'stroke') {
    return <IconStroke direction={direction as 'left' | 'right' | 'top' | 'bottom'} />;
  }
  if (type === 'radius') {
    <IconRadius
      direction={direction as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all'}
    />;
  }
};
