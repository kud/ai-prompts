import { describe, it, expect, beforeEach } from "vitest"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"
import Ajv from "ajv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe("YAML Schema Validation", () => {
  let schema
  let ajv
  let validate

  beforeEach(async () => {
    const schemaPath = path.join(__dirname, "..", "src", "schema.json")
    const schemaContent = await fs.readFile(schemaPath, "utf-8")
    schema = JSON.parse(schemaContent)
    ajv = new Ajv({ allErrors: true })
    validate = ajv.compile(schema)
  })

  it("should have a valid JSON schema", () => {
    expect(schema).toBeDefined()
    expect(schema.$schema).toBe("http://json-schema.org/draft-07/schema#")
    expect(schema.type).toBe("object")
  })

  it("should require all necessary fields", () => {
    expect(schema.required).toEqual(["title", "prompt", "creativity", "icon", "model"])
  })

  it("should validate a correct prompt", () => {
    const validPrompt = {
      title: "Test Prompt",
      prompt: "This is a test prompt",
      creativity: "medium",
      icon: "stars",
      model: "raycast-auto",
    }

    const valid = validate(validPrompt)
    expect(valid).toBe(true)
  })

  it("should reject prompt without title", () => {
    const invalidPrompt = {
      prompt: "This is a test prompt",
      creativity: "medium",
      icon: "stars",
      model: "raycast-auto",
    }

    const valid = validate(invalidPrompt)
    expect(valid).toBe(false)
    expect(validate.errors).toBeDefined()
    expect(validate.errors[0].params.missingProperty).toBe("title")
  })

  it("should reject prompt with invalid creativity level", () => {
    const invalidPrompt = {
      title: "Test Prompt",
      prompt: "This is a test prompt",
      creativity: "invalid",
      icon: "stars",
      model: "raycast-auto",
    }

    const valid = validate(invalidPrompt)
    expect(valid).toBe(false)
    expect(validate.errors[0].message).toContain("must be equal to one of")
  })

  it("should accept optional highlightEdits field", () => {
    const validPrompt = {
      title: "Test Prompt",
      prompt: "This is a test prompt",
      creativity: "low",
      icon: "stars",
      model: "raycast-auto",
      highlightEdits: true,
    }

    const valid = validate(validPrompt)
    expect(valid).toBe(true)
  })

  it("should reject prompts with additional properties", () => {
    const invalidPrompt = {
      title: "Test Prompt",
      prompt: "This is a test prompt",
      creativity: "medium",
      icon: "stars",
      model: "raycast-auto",
      extraField: "not allowed",
    }

    const valid = validate(invalidPrompt)
    expect(valid).toBe(false)
    expect(validate.errors[0].message).toContain("must NOT have additional")
  })

  it("should validate all existing prompt files", async () => {
    const dataDir = path.join(__dirname, "..", "prompts")
    const files = await fs.readdir(dataDir)
    const yamlFiles = files.filter((f) => f.endsWith(".yml"))

    expect(yamlFiles.length).toBeGreaterThan(0)

    for (const file of yamlFiles) {
      const filePath = path.join(dataDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      const data = yaml.load(content)

      const valid = validate(data)
      if (!valid) {
        console.error(`Validation failed for ${file}:`, validate.errors)
      }
      expect(valid).toBe(true)
    }
  })

  it("should enforce creativity enum values", () => {
    expect(schema.properties.creativity.enum).toEqual(["low", "medium", "high"])
  })

  it("should have proper string constraints", () => {
    expect(schema.properties.title.minLength).toBe(1)
    expect(schema.properties.title.maxLength).toBe(100)
    expect(schema.properties.prompt.minLength).toBe(1)
  })
})
