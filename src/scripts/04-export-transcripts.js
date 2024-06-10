/**
 * This script reads the JSON transcripts of each video and parses them into makrdown files.
 *
 * The files will be saved in the `scripts/output/transcripts-md` folder.
 */
import fs from 'fs'

function getPhrases(paragraph) {
  let text = ``
  for (const phrase of paragraph) {
    text += `${phrase}\n\n`
  }
  return `${text}`
}

function getParagraph(part) {
  const paragraph = getPhrases(part)
  return `${paragraph}\n`
}

function formatTranscript(transcriptFile) {
  console.log('formatting transcript', transcriptFile)
  const transcriptRaw = fs.readFileSync(`src/scripts/output/transcripts-json/${transcriptFile}`)
  const { transcript } = JSON.parse(transcriptRaw)

  if (!transcript) {
    return `No transcript for this one`
  }

  const timings = transcript.paragraph_timings
  const parts = transcript.transcript_parts

  let allParagraphs = ``
  for (let i = 0; i < timings.length; i++) {
    allParagraphs += getParagraph(parts[i], timings[i])
  }

  const content = `${allParagraphs}`
  return content
}

async function epxortMd(videoId, content) {
  fs.writeFile(`src/scripts/output/transcripts-md/${videoId}.md`, content, (err) => {
    if (err) {
      console.error('Error saving file', err)
    } else {
      console.log('File saved')
    }
  })
}

const transcriptFiles = fs.readdirSync('src/scripts/output/transcripts-json')
// Skip the first file as it's '.gitkeep'
transcriptFiles.shift()
const videoIds = transcriptFiles.map((file) => file.split('transcript-')[1].split('.json')[0])

for (let i = 0; i < videoIds.length; i++) {
  const content = formatTranscript(transcriptFiles[i])
  epxortMd(videoIds[i], content)
}
