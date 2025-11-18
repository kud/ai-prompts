import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"
import { titleCase } from "title-case"
import Ajv from "ajv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Icons
const icons = {
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
const validate = ajv.compile(schema)

/**
 * Validates a prompt object against the schema
 * @param {object} data - The prompt data to validate
 * @param {string} filePath - Path to the file being validated (for error messages)
 * @returns {boolean} True if valid, throws error if invalid
 */
const validatePrompt = (data, filePath) => {
  const valid = validate(data)
  if (!valid) {
    const errors = validate.errors
      .map((err) => {
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
 * @param {string} yamlFilePath - Path to the YAML file to convert
 * @returns {Promise<object|null>} Parsed JSON data or null if error occurs
 */
const convertYAMLtoJSON = async (yamlFilePath) => {
  try {
    const fileContent = await fs.readFile(yamlFilePath, "utf-8")
    const jsonData = yaml.load(fileContent)

    if (!jsonData || typeof jsonData !== "object") {
      throw new Error(`Invalid YAML structure in ${yamlFilePath}`)
    }

    // Validate against schema
    validatePrompt(jsonData, yamlFilePath)

    // Remove trailing newline from prompt for Raycast compatibility
    // Raycast doesn't handle trailing newlines well in prompt text
    if (jsonData.prompt && typeof jsonData.prompt === "string") {
      jsonData.prompt = jsonData.prompt.slice(0, -1)
    }

    return jsonData
  } catch (error) {
    console.error(`  ${icons.error} ${path.basename(yamlFilePath)}: ${error.message}`)
    return null
  }
}

/**
 * Main function to convert YAML prompts to Raycast JSON and Espanso YAML formats
 * @returns {Promise<void>}
 */
const main = async () => {
  try {
    console.log(`\n${icons.rocket} ${icons.sparkles} AI Prompts Builder ${icons.sparkles}\n`)

    const sourceDir = path.resolve("src/data")
    const outputRaycastDir = path.resolve("dist/raycast")
    const outputEspansoDir = path.resolve("dist/espanso")

    console.log(`${icons.folder} Creating output directories...`)
    await fs.mkdir(outputRaycastDir, { recursive: true })
    await fs.mkdir(outputEspansoDir, { recursive: true })
    console.log(`${icons.check} Directories created\n`)

    console.log(`${icons.yaml} Reading YAML files from src/data/...`)
    const files = await fs.readdir(sourceDir)

    const allData = []
    const espansoMatches = []
    let convertedCount = 0
    let errorCount = 0

    for (const file of files) {
      if (path.extname(file) === ".yml") {
        const yamlFilePath = path.join(sourceDir, file)
        const jsonData = await convertYAMLtoJSON(yamlFilePath)

        if (jsonData) {
          const jsonFilePath = path.join(outputRaycastDir, `${path.basename(file, ".yml")}.json`)
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
    console.error("Error in main function:", error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
