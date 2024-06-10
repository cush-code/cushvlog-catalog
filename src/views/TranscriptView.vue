<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { useVideoStore } from '@/stores/video'

const isLoading = ref(true)
const transcriptContent = ref('')
const summaryContent = ref('')
const error = ref('')
const videoStore = useVideoStore()

const route = useRoute()
const id = route.params.id
const sanitizedId = sanitizeFileName(id)

function sanitizeFileName(fileName) {
  const sanitized = fileName.replace(/[^\w\s.-]/g, '')
  return sanitized
}

async function fetchTranscript() {
  try {
    const transcriptResponse = await import(`@/assets/transcripts/${sanitizedId}.md?raw`)
    transcriptContent.value = transcriptResponse.default

    const summaryResponse = await import(`@/assets/summaries/${sanitizedId}.md?raw`)
    summaryContent.value = summaryResponse.default

    console.log('loaded', transcriptContent.value)
  } catch (e) {
    console.error(e)
    isLoading.value = false
    error.value = 'Failed to load transcript.'
  }
}

onMounted(() => {
  fetchTranscript()
})

function renderMarkdown(content) {
  const md = new MarkdownIt()
  return md.render(content)
}
</script>

<template>
  <div>
    <p><a href="/">Back</a></p>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <h1>{{ videoStore.getTitleDisplay(sanitizedId) }}</h1>
      <p>
        <a :href="`https://youtube.com/watch?v=${sanitizedId}`" target="_blank">Watch on YouTube</a>
      </p>
      <h2>Summary (AI generated)</h2>
      <p class="summary-content" v-html="renderMarkdown(summaryContent ?? '')"></p>
      <h2>Transcript</h2>
      <p class="transcript-content" v-html="renderMarkdown(transcriptContent ?? '')"></p>
    </div>
  </div>
</template>

<style scoped>
.transcript-content,
.summary-content {
  font-size: 20px;
  line-height: 1.75;
}
</style>
