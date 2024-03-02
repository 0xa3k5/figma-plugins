import { NamingConvention } from '@repo/utils';

export const checkConventions = (
  str: string,
  convention: NamingConvention
): boolean => {
  const regexPatterns = {
    camelCase: /^[a-zA-Z]+([A-Z][a-zA-Z0-9]+)*$/,
    PascalCase: /^[A-Z][a-zA-Z0-9]+$/,
    'kebab-case': /^[a-z0-9-]+$/,
    snake_case: /^[a-z0-9_]+$/,
    'Title Case': /^[A-Z][a-zA-Z0-9]+$/,
  };

  return regexPatterns[convention].test(str);
};
