import { ref } from 'vue'
import { defineStore } from 'pinia'
import lunr from 'lunr'
import { useVideoStore } from '@/stores/video'

const SEARCH_PREVIEW_LENGTH = 120

export const useSearchStore = defineStore('search', () => {
  let idx
  let isLoadingSearchIndex = ref(false)

  const loadSearchIndex = async function () {
    isLoadingSearchIndex.value = true
    const searchIndex = await import('@/assets/search-index.json').then((res) => res.default)
    idx = lunr.Index.load(searchIndex)
    isLoadingSearchIndex.value = false
  }

  let searchResults = ref([])
  let visibleSearchResults = ref([])

  const search = function (query) {
    if (!idx) {
      console.warn('Search index not built yet. Please try again.')
      return
    }
    visibleSearchResults.value = []
    searchResults.value = idx.search(query)
  }

  const getVisibleSearchResults = function (query) {
    searchResults.value.forEach((result) => {
      const videoId = result.ref
      const fragment = getResultFragment(videoId, query)
      if (fragment) {
        result.description = fragment
        visibleSearchResults.value.push(result)
      }
    })
  }

  const getResultFragment = function (videoId, query) {
    const videoStore = useVideoStore()
    const transcript = videoStore.getTranscriptById(videoId)
    const cleanTranscript = transcript.replace(/\[.*\]\(.*\)/g, '')
    const lowerCaseTranscript = cleanTranscript.toLowerCase()
    // Remove links from the markdown before searching the string
    let indexFound = lowerCaseTranscript.indexOf(query.toLowerCase())
    if (indexFound === -1) {
      return null
    }
    const startingEllipsis = indexFound > SEARCH_PREVIEW_LENGTH ? `...` : ''
    const endingEllipsis = indexFound < cleanTranscript.length - SEARCH_PREVIEW_LENGTH ? `...` : ''
    return `${startingEllipsis}${cleanTranscript.substring(indexFound - SEARCH_PREVIEW_LENGTH, indexFound + SEARCH_PREVIEW_LENGTH)}${endingEllipsis}`
  }

  return {
    search,
    searchResults,
    visibleSearchResults,
    getVisibleSearchResults,
    loadSearchIndex,
    isLoadingSearchIndex
  }
})
