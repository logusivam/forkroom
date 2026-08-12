import { SUPPORTED_LANGUAGES } from '../constants/languages'

export function getLanguageDisplayName(languageId: string): string {
  const found = SUPPORTED_LANGUAGES.find((lang) => lang.id === languageId)
  return found ? found.name : languageId
}
