/**
 * This script fetches AI-generated summaries or transcripts for all videos in the catalog.
 * The content is fetched from the Eightify API and saved to JSON files.
 *
 * To run this script, call it with either `summary` or `transcript` as an argument.
 *
 * The files will be saved in the `scripts/output/summaries-json`
 * or `scripts/output/transcripts-json` folder.
 */
import fs from 'fs'
import dotenv from 'dotenv'

const EIGHTIFY_API_KEY = dotenv.config().parsed.EIGHTIFY_API_KEY
const VIDEOS_FILE = dotenv.config().parsed.VIDEOS_FILE

const content = {
  summary: {
    path: 'src/scripts/output/summaries-json'
  },
  transcript: {
    path: 'src/scripts/output/transcripts-json'
  }
}

// Type can be either 'summary' or 'transcript'
const type = process.argv[2]
if (type !== 'summary' && type !== 'transcript') {
  console.error(`Pass either 'summary' or 'transcript' to run`)
  process.exit(1)
}

async function getAIContent(videoId) {
  const url = `https://backend.eightify.app/key-ideas?video_id=${videoId}&language=EN&auto_summary=false&type=${type}&source=side-block-button`
  return await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer ${EIGHTIFY_API_KEY}`,
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'ui-variant': 'default'
    },
    referrer: 'https://frontend.eightify.app/', // YEP trust me
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
    .then((resp) => {
      return resp.json()
    })
    .catch((error) => console.error(`Error reading summary of ${videoId}: ${error.message}`))
}

const videosFile = fs.readFileSync(VIDEOS_FILE)
const videos = JSON.parse(videosFile)
const videoIds = videos.map((video) => video.id)

async function getVideoSummaries(videoIds) {
  for (const videoId of videoIds) {
    // Print progress
    console.log(`Video ${videoIds.indexOf(videoId)} of ${videoIds.length}`)
    // If that video content already exists, skip
    const contentFileName = `${content[type].path}/${type}-${videoId}.json`
    const fileExists = fs.existsSync(contentFileName)
    if (fileExists) {
      console.log(`${type} for ${videoId} already exists, skipping`)
      continue
    }

    console.log(`Fetching ${type} for video ${videoId}...`)
    const aiContent = await getAIContent(videoId)
    if (!aiContent) {
      continue
    }
    const aiContentJSON = JSON.stringify(aiContent, null, 2)
    fs.writeFile(contentFileName, aiContentJSON, (result) => {
      if (result === null) {
        console.log(`${type} ${videoId} saved`)
      } else {
        console.log(`Something different:`, result)
      }
    })
    await delay()
  }
}

async function delay() {
  // This long delay is needed because the API has a rate limit
  const ms = Math.random() * 10_000 + 20_000
  console.log(`Waiting ${Math.floor(ms / 1000)}s...`)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

getVideoSummaries(videoIds)
