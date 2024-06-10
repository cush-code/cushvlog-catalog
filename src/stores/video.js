import { ref } from 'vue'
import { defineStore } from 'pinia'
import videosJSON from '@/assets/videos.json'

export const useVideoStore = defineStore('video', () => {
  const videoIds = videosJSON.map((video) => video.id)
  const transcripts = []
  const summaries = []
  const isLoading = ref(false)

  const getVideoById = function (id) {
    return videosJSON.find((video) => video.id === id)
  }

  const loadTranscript = async function (id) {
    const rawTranscript = import(`@/assets/transcripts/${id}.md?raw`)
    const transcript = await rawTranscript.then((res) => res.default)
    return {
      id,
      transcript
    }
  }

  const loadTranscripts = async function (videoIdsToLoad) {
    const transcriptPromises = videoIdsToLoad.map((id) => loadTranscript(id))
    const loadedTranscripts = await Promise.all(transcriptPromises)
    transcripts.push(...loadedTranscripts)
  }

  const loadSummary = async function (id) {
    const rawSummary = import(`@/assets/summaries/${id}.md?raw`)
    const summary = await rawSummary.then((res) => res.default)
    return summary
  }

  const getSummaryById = function (id) {
    return summaries.find((summary) => summary.id === id).summary
  }

  const getTranscriptById = function (id) {
    return transcripts.find((transcript) => transcript.id === id).transcript
  }

  const loadContent = async function (videoIdsToLoad) {
    isLoading.value = true
    await loadTranscripts(videoIdsToLoad)
    isLoading.value = false
  }

  const getTitleDisplay = function (videoId) {
    const title = getVideoById(videoId).snippet.title
    let titleDisplay = title.replace(' | Chapo Trap House', '')
    return titleDisplay
  }

  return {
    videoIds,
    getVideoById,
    getSummaryById,
    getTranscriptById,
    isLoading,
    getTitleDisplay,
    loadContent
  }
})
