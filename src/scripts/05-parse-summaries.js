/**
 * This script reads the JSON summaries of each video and parses them into makrdown files.
 *
 * The files will be saved in the `scripts/output/summaries-md` folder.
 */
import fs from 'fs'

function getTimingDisplay(time) {
  return `${time}`
}

function getKeyIdeas(keyIdeas) {
  let text = ``
  for (const keyIdea of keyIdeas) {
    text += `${keyIdea}\n\n`
  }
  return `${text}`
}

function getParagraph(summary) {
  const { emoji, keyIdeas, startTime, tldr } = summary
  const keyIdeasText = getKeyIdeas(keyIdeas)
  // return `### ${emoji} ${tldr}\n\nTimestamp: ${getTimingDisplay(startTime)}\n\n${keyIdeasText}\n\n`
  return `${emoji} ${tldr}\n\n` // simple version
}

function formatSummary(videoId, summaryFile) {
  console.log('formatting summary', summaryFile)
  const summaryRaw = fs.readFileSync(`src/scripts/output/summaries-json/${summaryFile}`)
  const { summary, title } = JSON.parse(summaryRaw)
  if (!summary) {
    console.log(summary)
    console.error('No summary!')
    return `No summary`
  }
  let allParagraphs = ``
  for (let i = 0; i < summary.length; i++) {
    allParagraphs += getParagraph(summary[i])
  }

  // const content = `# ${videoId}\n\n## ${title}\n\n${allParagraphs}`
  const content = `${allParagraphs}` // simple version
  return content
}

async function epxortMd(videoId, content) {
  fs.writeFile(`src/scripts/output/summaries-md/${videoId}.md`, content, (err) => {
    if (err) {
      console.error('Error saving file', err)
    } else {
      console.log('File saved')
    }
  })
}

const summaryFiles = fs.readdirSync('src/scripts/output/summaries-json')
// Remove '.gitkeep. from the list of files
const index = summaryFiles.indexOf('.gitkeep')
if (index > -1) {
  summaryFiles.splice(index, 1)
}
const videoIds = summaryFiles.map((file) => file.split('summary-')[1].split('.json')[0])

for (let i = 0; i < videoIds.length; i++) {
  const content = formatSummary(videoIds[i], summaryFiles[i])
  epxortMd(videoIds[i], content)
}
