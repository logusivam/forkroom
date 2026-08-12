import { SUPPORTED_LANGUAGES, LanguageId } from '../../../constants/languages'

interface LanguageSelectorProps {
  value: string
  onChange: (value: LanguageId) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as LanguageId)}
      className="bg-surface-3 border border-border rounded px-3 py-1.5 text-xs font-semibold text-text-primary focus:outline-none hover:bg-opacity-80 transition-colors cursor-pointer"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}
