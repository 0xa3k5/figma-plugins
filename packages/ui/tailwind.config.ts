import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';

const config: Pick<Config, 'content' | 'presets'> = {
  content: ['./components/**/*.{tsx,jsx}'],
  presets: [sharedConfig],
};

export default config;
