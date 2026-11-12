/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, LanguageOption } from '../types';
import { en } from './locales/en';
import { ALL_LANGUAGES, findLanguage } from './languages';

export { ALL_LANGUAGES, findLanguage };

// Default English master catalog
const baseDictionary: Record<string, any> = en;

/**
 * Retrieves the base text using dot notation path (e.g., 'nav.overview')
 * All UI text returns natural clear text, and dynamic browser/DOM translation
 * automatically translates the entire application dynamically on the fly
 * without needing manual locale files for each language.
 */
export function getTranslation(
  _language: Language,
  path: string,
  params?: Record<string, string | number>
): string {
  const parts = path.split('.');

  let current: any = baseDictionary;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current !== 'string') {
    return path; // Fallback to raw key if not resolved
  }

  // Handle template variables like {name}
  if (params) {
    return Object.entries(params).reduce((acc, [key, val]) => {
      return acc.replaceAll(`{${key}}`, String(val));
    }, current);
  }

  return current;
}
