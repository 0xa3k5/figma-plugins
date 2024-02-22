import sharedConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './src/**/*.{tsx,jsx}',
    '../../packages/ui/components/**/*.{tsx,jsx}',
  ],
  presets: [sharedConfig],
};

export default config;
