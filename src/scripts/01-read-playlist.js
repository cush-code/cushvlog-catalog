/**
 * Read a YouTube playlist and save the playlist items to a JSON file.
 * The file will be named 'playlist-items.json' and it will be saved
 * in this folder.
 */
import fs from 'fs'
import { config } from 'dotenv'

const PLAYLIST_ID = config().parsed.PLAYLIST_ID
const YOUTUBE_API_KEY = config().parsed.YOUTUBE_API_KEY
const OUTPUT_FILE = config().parsed.PLAYLIST_FILE

const MAX_RESULTS = 50 // Max allowed by YouTube API

// Function to recursively fetch all playlist items
async function fetchPlaylistItems(playlistId, nextPageToken = '', playlistItems = []) {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&maxResults=${MAX_RESULTS}`

  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`
  }

  const response = await fetch(url)
  const data = await response.json()

  playlistItems.push(...data.items)

  if (data.nextPageToken) {
    await fetchPlaylistItems(playlistId, data.nextPageToken, playlistItems)
  }

  return playlistItems
}

const videos = await fetchPlaylistItems(PLAYLIST_ID)
  .then((items) => {
    console.log(`Fetched ${items.length} items from the playlist.`)
    return items
  })
  .catch((error) => {
    console.error('Error fetching playlist items:', error)
  })

// Save playlist items to a JSON file
const videosString = JSON.stringify(videos, null, 2)
fs.writeFileSync(OUTPUT_FILE, videosString)
console.log(`Saved ${OUTPUT_FILE}`)
