import fs from "fs/promises"
import path from "path"
import yaml from "js-yaml"
import { titleCase } from "title-case"

const convertYAMLtoJSON = async (yamlFilePath) => {
  try {
    const fileContent = await fs.readFile(yamlFilePath, "utf-8")
    const jsonData = yaml.load(fileContent)

    // @NOTE: temporary fix for raycast
    jsonData.prompt = jsonData.prompt.slice(0, -1)

    return jsonData
  } catch (error) {
    console.error(`Error reading/parsing file ${yamlFilePath}:`, error)
  }
}

const main = async () => {
  try {
    const sourceDir = path.resolve("data")
    const outputRaycastDir = path.resolve("dist/raycast")
    const outputEspansoDir = path.resolve("dist/espanso")

    await fs.mkdir(outputRaycastDir, { recursive: true })
    await fs.mkdir(outputEspansoDir, { recursive: true })

    const files = await fs.readdir(sourceDir)

    const allData = []
    const espansoMatches = []

    for (const file of files) {
      if (path.extname(file) === ".yml") {
        const yamlFilePath = path.join(sourceDir, file)
        const jsonData = await convertYAMLtoJSON(yamlFilePath)

        if (jsonData) {
          const jsonFilePath = path.join(
            outputRaycastDir,
            path.basename(file, ".yml") + ".json",
          )
          await fs.writeFile(jsonFilePath, JSON.stringify([jsonData], null, 2))
          console.log(`Converted ${file} to ${path.basename(jsonFilePath)}`)

          allData.push(jsonData)

          const fileNameWithoutExt = path.basename(file, ".yml")
          // Remove everything with "{selection}", replace {argument name=xxx default="yyy"} with yyy, and {argument name=xxx} with {xxx} for espanso output
          let content = jsonData.prompt
          if (typeof content === "string") {
            // Remove {selection}
            content = content.replace(/\{selection\}/g, "")
            // Replace {argument name=xxx default="yyy"} with yyy
            content = content.replace(
              /\{argument name=([a-zA-Z0-9_-]+) default="([^"]+)"\}/g,
              "$2",
            )
            // Replace {argument name=xxx} with {xxx}
            content = content.replace(
              /\{argument name=([a-zA-Z0-9_-]+)\}/g,
              "{$1}",
            )
          }
          espansoMatches.push({
            trigger: `??ai.${fileNameWithoutExt}`,
            label: titleCase(fileNameWithoutExt.replace(/-/g, " ")),
            replace: content,
          })
        }
      }
    }

    await fs.writeFile(
      path.join(outputRaycastDir, "index.json"),
      JSON.stringify(allData, null, 2),
    )
    console.log("\nAll data written to index.json")

    const espansoYAMLContent = yaml.dump(
      { matches: espansoMatches },
      {
        lineWidth: -1,
        styles: {
          replace: "literal",
        },
      },
    )

    await fs.writeFile(
      path.join(outputEspansoDir, "index.yml"),
      espansoYAMLContent,
    )
    console.log("All Espanso matches written to index.yml")
  } catch (error) {
    console.error("Error in main function:", error)
  }
}

main()
