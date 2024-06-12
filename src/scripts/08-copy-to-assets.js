/**
 * Copies videos.json, search-index.json, transcript and summary files to the assets folder.
 */
import { execSync } from 'child_process'

execSync('cp src/scripts/output/summaries-md/*.md src/assets/summaries/')
console.log('Summary files copied.')
execSync('cp src/scripts/output/transcripts-md/*.md src/assets/transcripts/')
console.log('Transcript files copied.')
execSync('cp src/scripts/output/videos.json src/assets/videos.json')
console.log('Video JSON copied.')
execSync('cp src/scripts/output/search-index.json src/assets/search-index.json')
console.log('Search index copied.')
