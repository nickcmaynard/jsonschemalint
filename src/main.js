import './assets/main.css'

// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS - needed for the interface!
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

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

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
