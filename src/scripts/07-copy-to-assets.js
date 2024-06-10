/**
 * Copies videos.json, transcript and summary files to the assets folder.
 */
import { execSync } from 'child_process'

execSync('cp ./scripts/output/summaries-md/*.md ../src/assets/summaries/')
console.log('Summary files copied.')
execSync('cp ./scripts/output/transcripts-md/*.md ../src/assets/transcripts/')
console.log('Transcript files copied.')
execSync('cp ./scripts/output/videos.json ../src/assets/videos.json')
console.log('Video JSON copied.')
