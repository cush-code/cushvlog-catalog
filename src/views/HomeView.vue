<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useVideoStore } from '@/stores/video'
import { useSearchStore } from '@/stores/search'
import Mark from 'mark.js'
import MarkdownIt from 'markdown-it'

const videoStore = useVideoStore()
const searchStore = useSearchStore()
const searchQuery = ref('')
const searchInput = ref()

const isLoading = computed(() => videoStore.isLoading || searchStore.isLoadingSearchIndex)
const hasSearched = ref(false)

const highlightSearchTerms = function (searchTerm, index) {
  const context = document.querySelector(`#markdown-content-${index}`)
  const instance = new Mark(context)
  instance.mark(searchTerm)
}

const getTranscriptPreview = function (text, index) {
  const md = new MarkdownIt()
  md.render(text)

  setTimeout(() => {
    highlightSearchTerms(searchQuery.value.trim().toLowerCase(), index)
  }, 100)
}

const onSubmit = async function () {
  searchStore.search(searchQuery.value.trim())
  const videoIds = searchStore.searchResults.map((result) => result.ref)
  await videoStore.loadContent(videoIds)
  // Update visible results
  searchStore.getVisibleSearchResults(searchQuery.value.trim())
  searchStore.visibleSearchResults.forEach((result, index) => {
    getTranscriptPreview(result.description, index)
  })
  hasSearched.value = true
}

const getStatusText = function () {
  if (searchStore.visibleSearchResults.length > 0) {
    return `${searchStore.visibleSearchResults.length} results found`
  }

  if (videoStore.isLoading) {
    return 'Searching...'
  }

  if (searchStore.isLoadingSearchIndex) {
    return 'Loading search index. This can take a few seconds...'
  } else {
    if (hasSearched.value) {
      return 'No results found'
    } else {
      return 'Ready to search'
    }
  }
}

onMounted(() => {
  searchStore.loadSearchIndex()
})

watch(isLoading, (newValue) => {
  if (newValue === false) {
    searchInput.value.disabled = false
    searchInput.value.focus()
  } else {
    searchInput.value.disabled = true
  }
})
</script>

<template>
  <main>
    <h1>cushvlog-catalog</h1>
    <input
      id="search-input"
      ref="searchInput"
      v-model="searchQuery"
      @keyup.enter="onSubmit"
      type="search"
      placeholder="Search"
      autofocus
    />
    <div class="results-count">
      <p ref="statusText">{{ getStatusText() }}</p>
    </div>
    <div
      v-for="(result, index) in searchStore.visibleSearchResults"
      v-bind:key="index"
      class="results-container"
    >
      <div class="result-item">
        <h2>
          <a :href="`https://youtube.com/watch?v=${result.ref}`" target="_blank">{{
            videoStore.getTitleDisplay(result.ref)
          }}</a>
        </h2>
        <p :id="`markdown-content-${index}`" v-html="result.description"></p>
        <p><a :href="`/transcript/${result.ref}`" target="_blank">View full transcript</a></p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.results-container {
  margin-top: 20px;
}
.result-item {
  margin-bottom: 40px;
}
</style>
