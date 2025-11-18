export type CreativityLevel = "low" | "medium" | "high"

export interface PromptData {
  title: string
  prompt: string
  creativity: CreativityLevel
  icon: string
  model: string
  highlightEdits?: boolean
}

export interface EspansoMatch {
  trigger: string
  label: string
  replace: string
}

export interface Icons {
  rocket: string
  file: string
  check: string
  error: string
  warning: string
  folder: string
  json: string
  yaml: string
  sparkles: string
  package: string
  build: string
}
