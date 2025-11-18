import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"
import { titleCase } from "title-case"
import Ajv, { type ValidateFunction } from "ajv"
import type { PromptData, EspansoMatch, Icons } from "./types.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Icons
const icons: Icons = {
  rocket: "🚀",
  file: "📄",
  check: "✅",
  error: "❌",
  warning: "⚠️",
  folder: "📁",
  json: "📦",
  yaml: "📝",
  sparkles: "✨",
  package: "📦",
  build: "🔨",
}

// Load and compile schema
const schemaPath = path.join(__dirname, "schema.json")
const schemaContent = await fs.readFile(schemaPath, "utf-8")
const schema = JSON.parse(schemaContent)
const ajv = new Ajv({ allErrors: true })
const validate: ValidateFunction = ajv.compile(schema)

/**
 * Validates a prompt object against the schema
 * @param data - The prompt data to validate
 * @param filePath - Path to the file being validated (for error messages)
 * @returns True if valid, throws error if invalid
 */
const validatePrompt = (data: unknown, filePath: string): data is PromptData => {
  const valid = validate(data)
  if (!valid) {
    const errors = validate.errors
      ?.map((err) => {
        const field = err.instancePath || err.params.missingProperty || "root"
        return `  - ${field}: ${err.message}`
      })
      .join("\n")
    throw new Error(`Schema validation failed for ${path.basename(filePath)}:\n${errors}`)
  }
  return true
}

/**
 * Converts a YAML file to JSON format
 * @param yamlFilePath - Path to the YAML file to convert
 * @returns Parsed JSON data or null if error occurs
 */
const convertYAMLtoJSON = async (yamlFilePath: string): Promise<PromptData | null> => {
  try {
    const fileContent = await fs.readFile(yamlFilePath, "utf-8")
    const jsonData = yaml.load(fileContent) as unknown

    if (!jsonData || typeof jsonData !== "object") {
      throw new Error(`Invalid YAML structure in ${yamlFilePath}`)
    }

    // Validate against schema - this type guards jsonData as PromptData
    if (!validatePrompt(jsonData, yamlFilePath)) {
      return null
    }

    // Remove trailing newline from prompt for Raycast compatibility
    // Raycast doesn't handle trailing newlines well in prompt text
    if (jsonData.prompt && typeof jsonData.prompt === "string") {
      jsonData.prompt = jsonData.prompt.slice(0, -1)
    }

    return jsonData
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`  ${icons.error} ${path.basename(yamlFilePath)}: ${errorMessage}`)
    return null
  }
}

/**
 * Main function to convert YAML prompts to Raycast JSON and Espanso YAML formats
 */
const main = async (): Promise<void> => {
  try {
    console.log(`\n${icons.rocket} ${icons.sparkles} AI Prompts Builder ${icons.sparkles}\n`)

    const sourceDir = path.resolve("prompts")
    const outputRaycastDir = path.resolve("dist/raycast")
    const outputEspansoDir = path.resolve("dist/espanso")

    console.log(`${icons.folder} Creating output directories...`)
    await fs.mkdir(outputRaycastDir, { recursive: true })
    await fs.mkdir(outputEspansoDir, { recursive: true })
    console.log(`${icons.check} Directories created\n`)

    console.log(`${icons.yaml} Reading YAML files from prompts/...`)
    const files = await fs.readdir(sourceDir)

    const allData: PromptData[] = []
    const espansoMatches: EspansoMatch[] = []
    let convertedCount = 0
    let errorCount = 0

    for (const file of files) {
      if (path.extname(file) === ".yml") {
        const yamlFilePath = path.join(sourceDir, file)
        const jsonData = await convertYAMLtoJSON(yamlFilePath)

        if (jsonData) {
          const jsonFilePath = path.join(outputRaycastDir, path.basename(file, ".yml") + ".json")
          await fs.writeFile(jsonFilePath, JSON.stringify([jsonData], null, 2))
          console.log(`  ${icons.check} ${file}`)
          convertedCount++

          allData.push(jsonData)

          const fileNameWithoutExt = path.basename(file, ".yml")
          // Remove everything with "{selection}", replace {argument name=xxx default="yyy"} with yyy, and {argument name=xxx} with {xxx} for espanso output
          let content = jsonData.prompt
          if (typeof content === "string") {
            // Remove {selection}
            content = content.replaceAll("{selection}", "")
            // Replace {argument name=xxx default="yyy"} with yyy
            content = content.replaceAll(/\{argument name=([a-zA-Z0-9_-]+) default="([^"]+)"\}/g, "$2")
            // Replace {argument name=xxx} with {xxx}
            content = content.replaceAll(/\{argument name=([a-zA-Z0-9_-]+)\}/g, "{$1}")
          }
          espansoMatches.push({
            trigger: `??ai.${fileNameWithoutExt}`,
            label: titleCase(fileNameWithoutExt.replaceAll("-", " ")),
            replace: content,
          })
        } else {
          errorCount++
        }
      }
    }

    console.log(`\n${icons.build} Building output files...\n`)

    console.log(`${icons.json} Creating Raycast index.json...`)
    await fs.writeFile(path.join(outputRaycastDir, "index.json"), JSON.stringify(allData, null, 2))
    console.log(`${icons.check} Raycast: ${allData.length} prompts written to index.json`)

    console.log(`\n${icons.package} Creating Espanso index.yml...`)
    const espansoYAMLContent = yaml.dump(
      { matches: espansoMatches },
      {
        lineWidth: -1,
        styles: {
          replace: "literal",
        },
      },
    )

    await fs.writeFile(path.join(outputEspansoDir, "index.yml"), espansoYAMLContent)
    console.log(`${icons.check} Espanso: ${espansoMatches.length} prompts written to index.yml`)

    console.log(`\n${"=".repeat(50)}`)
    console.log(`${icons.sparkles} Build Summary:`)
    console.log(`   ${icons.check} Successfully converted: ${convertedCount}`)
    if (errorCount > 0) {
      console.log(`   ${icons.error} Failed: ${errorCount}`)
    }
    console.log(`   ${icons.folder} Output: dist/raycast/ & dist/espanso/`)
    console.log(`${"=".repeat(50)}\n`)
    console.log(`${icons.rocket} Build completed successfully!\n`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("Error in main function:", errorMessage)
    if (errorStack) {
      console.error(errorStack)
    }
    process.exit(1)
  }
}

main()
