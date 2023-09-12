import fs from "fs/promises"
import path from "path"
import yaml from "js-yaml"

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
    const sourceDir = path.resolve("src/data/raycast")
    const outputDir = path.resolve("dist/raycast")

    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true })

    const files = await fs.readdir(sourceDir)

    // This array will store all the jsonData to be written to index.json
    const allData = []

    for (const file of files) {
      if (path.extname(file) === ".yml") {
        const yamlFilePath = path.join(sourceDir, file)
        const jsonData = await convertYAMLtoJSON(yamlFilePath)

        if (jsonData) {
          const jsonFilePath = path.join(
            outputDir,
            path.basename(file, ".yml") + ".json",
          )
          await fs.writeFile(jsonFilePath, JSON.stringify([jsonData], null, 2))
          console.log(`Converted ${file} to ${path.basename(jsonFilePath)}`)

          // Add the jsonData to our allData array
          allData.push(jsonData)
        }
      }
    }

    // After converting all files, write the allData to index.json
    await fs.writeFile(
      path.join(outputDir, "index.json"),
      JSON.stringify(allData, null, 2),
    )
    console.log("All data written to index.json")
  } catch (error) {
    console.error("Error in main function:", error)
  }
}

main()
