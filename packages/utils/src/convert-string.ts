import { NamingConvention } from './types';
/**
 * @param str The string to split.
 * @returns An array of words.
 */
function splitIntoWords(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
    .split(' ');
}

/**
 * Converts a string to camelCase.
 * @param str The string to convert.
 * @returns The camelCase string.
 */
function toCamelCase(str: string): string {
  const words = splitIntoWords(str);

  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

/**
 * Converts a string to PascalCase.
 * @param str The string to convert.
 * @returns The PascalCase string.
 */
function toPascalCase(str: string): string {
  const words = splitIntoWords(str);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts a string to kebab-case.
 * @param str The string to convert.
 * @returns The kebab-case string.
 */
function toKebabCase(str: string): string {
  return splitIntoWords(str).join('-');
}

/**
 * Converts a string to snake_case.
 * @param str The string to convert.
 * @returns The snake_case string.
 */
function toSnakeCase(str: string): string {
  return splitIntoWords(str).join('_');
}

/**
 * Converts a string to Title Case.
 * @param str The string to convert.
 * @returns The Title Case string.
 */
function toTitleCase(str: string): string {
  const words = splitIntoWords(str);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Converts a string to a specified naming convention.
 * @param str The string to convert.
 * @param convention The naming convention to apply.
 * @returns The converted string.
 */
export function convertString({
  str,
  convention,
}: {
  str: string;
  convention: NamingConvention;
}): string {
  switch (convention) {
    case 'camelCase':
      return toCamelCase(str);
    case 'PascalCase':
      return toPascalCase(str);
    case 'kebab-case':
      return toKebabCase(str);
    case 'snake_case':
      return toSnakeCase(str);
    case 'Title Case':
      return toTitleCase(str);
    default:
      return str;
  }
}
