// Import our custom CSS
import './assets/main.css'
import './scss/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { VueUmamiPlugin } from '@jaseeey/vue-umami-plugin';

import App from './App.vue'
import router from './router'

// Import & config Vue I18n
import { createI18n } from 'vue-i18n'
import en from './i18n/locales/en.json' // <--- add this
const i18n = createI18n({
  messages: {
    en,
  },
})

// Start the app up
const app = createApp(App)

app.use(i18n)
app.use(createPinia())

app.use(VueUmamiPlugin, {
    websiteID: '0f99bd3d-f459-4e78-8b6e-6b179c5d876a',
    router,
    allowLocalhost: true,
});
app.use(router)

app.mount('#app')
// We do it this way as otherwise the route isn't ready for our non-RouterView pattern
// router.isReady().then(() => app.mount('#app'))
