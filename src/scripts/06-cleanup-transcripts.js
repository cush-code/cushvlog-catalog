/**
 * Cleanup the transcripts, removing words such as "uh" and "um", extra spaces
 * and line breaks.
 */
import fs from 'fs'

function cleanupTranscript(transcriptFile) {
  console.log('formatting transcript', transcriptFile)
  const transcriptRaw = fs
    .readFileSync(`src/scripts/output/transcripts-md/${transcriptFile}`)
    .toString()

  // Remove "uh"s
  const transcriptClean = transcriptRaw
    // Remove "uh"s
    .replace(/ uh /g, ' ')
    .replace(/ Uh /g, ' ')
    .replace(/ uh\./g, ' ')
    .replace(/ Uh\./g, ' ')
    .replace(/uh/g, ' ')
    .replace(/Uh/g, ' ')
    .replace(/ UH /g, ' ')
    .replace(/UH\./g, ' ')
    // Replace multiple spaces with a single space
    .replace(/ +/g, ' ')
    // Replace multiple line breaks with two line breaks
    .replace(/\n\n+/g, '\n\n')
    // Replace lower case letters with uppercase after a period and a space
    .replace(/\. [a-z]/g, (match) => match.toUpperCase())
  return transcriptClean
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

const transcriptFiles = fs.readdirSync('src/scripts/output/transcripts-md')
// Remove '.gitkeep. from the list of files
const index = transcriptFiles.indexOf('.gitkeep')
if (index > -1) {
  transcriptFiles.splice(index, 1)
}
const videoIds = transcriptFiles.map((file) => file.split('.md')[0])

for (let i = 0; i < videoIds.length; i++) {
  const content = cleanupTranscript(transcriptFiles[i])
  epxortMd(videoIds[i], content)
}
