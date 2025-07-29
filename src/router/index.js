import { createRouter, createWebHashHistory } from 'vue-router'
import LintView from '@/views/LintView.vue'
import InvalidVersionView from '@/views/InvalidVersionView.vue'

const router = createRouter({
  history: createWebHashHistory('#!/'), // Match the old scheme from Angular days
  routes: [
    {
      // TODO: Generate from configstore info
      // Catch bad/retired specs
      path: '/version/:version(draft-0[1-3]|v5-unofficial|experimental)/:discard(.*)',
      component: InvalidVersionView,
    },
    {
      // Standard behaviour
      path: '/version/:version/markup/:markupLanguage',
      component: LintView,
    },
    {
      // catchall - redirect to the latest and greatest
      path: '/:unmatched(.*)',
      redirect: '/version/2020-12/markup/json',
    },
  ],
})

export default router
