/**
 * This script builds a search index for the videos and transcripts.
 *
 * The search index is built using the `lunr` library. The index is saved as a JSON file.
 */
import fs from 'fs'
import lunr from 'lunr'

// Load videos.json
const videosJSON = JSON.parse(fs.readFileSync('src/scripts/output/videos.json', 'utf-8'))
const videoIds = videosJSON.map((video) => video.id)
console.log(`Found ${videoIds.length} videos.`)

// Load transcripts
function loadTranscript(id) {
  try {
    const rawTranscript = fs.readFileSync(`src/scripts/output/transcripts-md/${id}.md`, 'utf-8')
    return rawTranscript
  } catch (e) {
    console.log('Transcript not found for video:', id)
  }
}

function getVideoById(id) {
  return videosJSON.find((video) => video.id === id)
}

let idx

const buildSearchIndex = async function () {
  console.log('Building search index...')
  let completion = 0

  // Build search index
  idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('transcript')
    for (let i = 0; i < videoIds.length; i++) {
      const id = videoIds[i]
      const title = getVideoById(id).snippet.title
      const transcript = loadTranscript(id)
      this.add({
        id,
        title,
        transcript
      })
      completion++
    }
  })

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (completion === videoIds.length) {
        clearInterval(interval)
        resolve('Search index built successfully.')
      }
    }, 50)
  })
}

await buildSearchIndex()

console.log('exporting search index...')
fs.writeFileSync('src/scripts/output/search-index.json', JSON.stringify(idx))
console.log('Done creating search index.')
