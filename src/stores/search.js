import { ref } from 'vue'
import { defineStore } from 'pinia'
import lunr from 'lunr'
import { useVideoStore } from '@/stores/video'

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
    const lowerCaseTranscript = transcript.toLowerCase()
    let indexFound = lowerCaseTranscript.indexOf(query.toLowerCase())
    if (indexFound === -1) {
      return null
    }
    return `...${transcript.substring(indexFound - 100, indexFound + 100)}`
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
