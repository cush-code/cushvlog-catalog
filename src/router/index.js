import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/transcript/:id?',
      name: 'transcript',
      component: () => import('../views/TranscriptView.vue')
    },
  ]
})

export default router
