import {
  IconPaddingHorizontal32,
  IconPaddingVertical32,
  IconSpacingHorizontal32,
  IconSpacingVertical32,
} from '@create-figma-plugin/ui';
import { h } from 'preact';

import {
  PaddingBottomIcon,
  PaddingLeftIcon,
  PaddingRightIcon,
  PaddingTopIcon,
  RadiusAllIcon,
  RadiusBottomLeftIcon,
  RadiusBottomRightIcon,
  RadiusTopLeftIcon,
  RadiusTopRightIcon,
  StrokeBottomIcon,
  StrokeLeftIcon,
  StrokeRightIcon,
  StrokeTopIcon,
} from '../icons';
import { PropertyType } from '../types';

export const getIcon = (type: PropertyType, direction: string) => {
  if (type === 'padding') {
    switch (direction) {
      case 'top':
        return <PaddingTopIcon />;
      case 'bottom':
        return <PaddingBottomIcon />;
      case 'left':
        return <PaddingLeftIcon />;
      case 'right':
        return <PaddingRightIcon />;
      case 'vertical':
        return <IconPaddingVertical32 width={24} height={24} />;
      case 'horizontal':
        return <IconPaddingHorizontal32 width={24} height={24} />;

      default:
        break;
    }
  } else if (type === 'gap') {
    switch (direction) {
      case 'vertical':
        return <IconSpacingVertical32 width={24} height={24} />;
      case 'horizontal':
        return <IconSpacingHorizontal32 width={24} height={24} />;
      default:
        break;
    }
  } else if (type === 'stroke') {
    switch (direction) {
      case 'left':
        return <StrokeLeftIcon />;
      case 'top':
        return <StrokeTopIcon />;
      case 'right':
        return <StrokeRightIcon />;
      case 'bottom':
        return <StrokeBottomIcon />;
    }
  } else if (type === 'radius') {
    switch (direction) {
      case 'top-left':
        return <RadiusTopLeftIcon />;
      case 'top-right':
        return <RadiusTopRightIcon />;
      case 'bottom-left':
        return <RadiusBottomLeftIcon />;
      case 'bottom-right':
        return <RadiusBottomRightIcon />;
      case 'all':
        return <RadiusAllIcon />;
    }
  }
};
