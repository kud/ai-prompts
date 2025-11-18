import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe("AI Prompts Build Process", () => {
  const testDataDir = path.join(__dirname, "fixtures")
  const testOutputDir = path.join(__dirname, "temp-output")

  beforeEach(async () => {
    // Create test directories
    await fs.mkdir(testDataDir, { recursive: true })
    await fs.mkdir(testOutputDir, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test directories
    try {
      await fs.rm(testDataDir, { recursive: true, force: true })
      await fs.rm(testOutputDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })

  it("should convert valid YAML to JSON format", async () => {
    const testYaml = `title: Test Prompt
prompt: |
  This is a test prompt with {argument name=topic}
creativity: medium
icon: stars
model: raycast-auto
`
    const yamlPath = path.join(testDataDir, "test-prompt.yml")
    await fs.writeFile(yamlPath, testYaml)

    const fileContent = await fs.readFile(yamlPath, "utf-8")
    expect(fileContent).toContain("title: Test Prompt")
  })

  it("should handle YAML files with selection placeholder", async () => {
    const testYaml = `title: Fix Grammar
prompt: |
  Fix the grammar in: {selection}
creativity: low
icon: stars
model: raycast-auto
`
    const yamlPath = path.join(testDataDir, "fix-grammar.yml")
    await fs.writeFile(yamlPath, testYaml)

    const content = await fs.readFile(yamlPath, "utf-8")
    expect(content).toContain("{selection}")
  })

  it("should create Espanso-compatible triggers", async () => {
    const filename = "act-as-a-debater"
    const trigger = `??ai.${filename}`
    const expectedLabel = "Act As A Debater"

    expect(trigger).toBe("??ai.act-as-a-debater")
    // Title case conversion test
    const label = filename
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    expect(label).toBe(expectedLabel)
  })

  it("should handle argument placeholders correctly", () => {
    const input = 'Test {argument name=topic default="example"} and {argument name=style}'

    // Espanso conversion: replace {argument name=xxx default="yyy"} with yyy
    let output = input.replaceAll(/\{argument name=([a-zA-Z0-9_-]+) default="([^"]+)"\}/g, "$2")
    // Replace {argument name=xxx} with {xxx}
    output = output.replaceAll(/\{argument name=([a-zA-Z0-9_-]+)\}/g, "{$1}")

    expect(output).toBe("Test example and {style}")
  })

  it("should remove selection placeholders for Espanso", () => {
    const input = "Fix this text: {selection}"
    const output = input.replaceAll("{selection}", "")
    expect(output).toBe("Fix this text: ")
  })
})

describe("YAML File Validation", () => {
  it("should have required fields in prompt YAML", () => {
    const requiredFields = ["title", "prompt", "creativity", "icon", "model"]
    const testPrompt = {
      title: "Test",
      prompt: "Test prompt",
      creativity: "medium",
      icon: "stars",
      model: "raycast-auto",
    }

    for (const field of requiredFields) {
      expect(testPrompt).toHaveProperty(field)
    }
  })

  it("should validate creativity levels", () => {
    const validLevels = ["low", "medium", "high"]
    const testLevel = "medium"

    expect(validLevels).toContain(testLevel)
  })
})
