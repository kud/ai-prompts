import fs from "fs/promises"
import path from "path"
import yaml from "js-yaml"

const convertYAMLtoJSON = async (yamlFilePath) => {
  try {
    const fileContent = await fs.readFile(yamlFilePath, "utf-8")
    const jsonData = yaml.load(fileContent)
    return jsonData
  } catch (error) {
    console.error(`Error reading/parsing file ${yamlFilePath}:`, error)
  }
}

const main = async () => {
  try {
    const sourceDir = path.resolve("src/data/raycast")
    const outputDir = path.resolve("dist/raycast")

    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true })

    const files = await fs.readdir(sourceDir)

    for (const file of files) {
      if (path.extname(file) === ".yml") {
        const yamlFilePath = path.join(sourceDir, file)
        const jsonData = await convertYAMLtoJSON(yamlFilePath)

        if (jsonData) {
          const jsonFilePath = path.join(
            outputDir,
            path.basename(file, ".yml") + ".json",
          )
          await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2))
          console.log(`Converted ${file} to ${path.basename(jsonFilePath)}`)
        }
      }
    }
  } catch (error) {
    console.error("Error in main function:", error)
  }
}

main()
