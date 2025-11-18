#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"
import Ajv, { type ErrorObject } from "ajv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ValidationError {
  file: string
  errors: string[]
}

/**
 * Validates all YAML prompt files against the schema
 */
async function validateAllPrompts(): Promise<void> {
  try {
    console.log("🔍 Validating AI prompt files...\n")

    // Load schema
    const schemaPath = path.join(__dirname, "schema.json")
    const schemaContent = await fs.readFile(schemaPath, "utf-8")
    const schema = JSON.parse(schemaContent)

    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)

    // Read all YAML files
    const dataDir = path.join(__dirname, "..", "prompts")
    const files = await fs.readdir(dataDir)
    const yamlFiles = files.filter((f) => f.endsWith(".yml"))

    let validCount = 0
    let invalidCount = 0
    const errors: ValidationError[] = []

    // Validate each file
    for (const file of yamlFiles) {
      const filePath = path.join(dataDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      const data = yaml.load(content)

      const valid = validate(data)

      if (valid) {
        console.log(`✅ ${file}`)
        validCount++
      } else {
        console.log(`❌ ${file}`)
        invalidCount++

        const errorMessages =
          validate.errors?.map((err: ErrorObject) => {
            const field = err.instancePath || err.params.missingProperty || "root"
            return `   - ${field}: ${err.message}`
          }) || []

        errors.push({
          file,
          errors: errorMessages,
        })
      }
    }

    // Summary
    console.log(`\n${"=".repeat(50)}`)
    console.log(`📊 Validation Summary:`)
    console.log(`   Total files: ${yamlFiles.length}`)
    console.log(`   ✅ Valid: ${validCount}`)
    console.log(`   ❌ Invalid: ${invalidCount}`)

    if (errors.length > 0) {
      console.log(`\n${"=".repeat(50)}`)
      console.log(`❌ Validation Errors:\n`)

      for (const { file, errors: fileErrors } of errors) {
        console.log(`${file}:`)
        for (const err of fileErrors) {
          console.log(err)
        }
        console.log()
      }

      process.exit(1)
    } else {
      console.log(`\n✨ All prompt files are valid!`)
      process.exit(0)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error(`\n💥 Validation failed with error:`, errorMessage)
    if (errorStack) {
      console.error(errorStack)
    }
    process.exit(1)
  }
}

await validateAllPrompts()
