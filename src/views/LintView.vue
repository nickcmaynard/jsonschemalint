<script setup>
import ValidatorCard from '@/components/ValidatorCard.vue'

import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useConfigStore } from '@/stores/config'
import { GistFormatError, retrieveGist, savePublicGist } from '@/utilities/Gist'
const configStore = useConfigStore()
const { currentMarkup, currentSpec } = storeToRefs(configStore)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

import { useEventListener } from 'mitt-vue'
import { trackUmamiEvent } from '@jaseeey/vue-umami-plugin'

const GIST_QUERY_PARAM = 'gist'
const GIST_TOKEN_STORAGE_KEY = 'jsonschemalint.github.gist.token'
const GIST_TOKEN_SETUP_URL = 'https://github.com/settings/tokens/new?description=jsonschemalint.com&scopes=gist'

const schemaModel = ref()
const documentModel = ref()
const gistSnapshot = ref()
const gistAlert = ref()

console.debug('LintView setup()', route.params)

// React to store changes
watch(currentMarkup, (markup) => {
  console.debug(`LintView: watch(currentMarkup) fired`, markup)
  router.push({ path: `/version/${configStore.currentSpec}/markup/${markup}` })
})
watch(currentSpec, (spec) => {
  console.debug(`LintView: watch(currentSpec) fired`, spec)
  router.push({ path: `/version/${spec}/markup/${configStore.currentMarkup}` })
})

// Synchronize localStorage with the models
const updateGistQueryParam = (gistId) => {
  const url = new URL(window.location.href)
  if (gistId) {
    url.searchParams.set(GIST_QUERY_PARAM, gistId)
  } else {
    url.searchParams.delete(GIST_QUERY_PARAM)
  }
  window.history.replaceState(window.history.state, '', url.toString())
}

const clearGistSnapshot = () => {
  if (!gistSnapshot.value) {
    return
  }
  gistSnapshot.value = undefined
  updateGistQueryParam(undefined)
}

const clearGistSnapshotIfDirty = () => {
  if (
    gistSnapshot.value &&
    (schemaModel.value !== gistSnapshot.value.schema || documentModel.value !== gistSnapshot.value.document)
  ) {
    clearGistSnapshot()
  }
}

watch(schemaModel, (newSchema) => {
  console.debug('LintView: schemaModel changed')
  if (newSchema) {
    localStorage.setItem('schema', newSchema)
  } else {
    localStorage.removeItem('schema')
  }
  clearGistSnapshotIfDirty()
})
watch(documentModel, (newDocument) => {
  console.debug('LintView: documentModel changed')
  if (newDocument) {
    localStorage.setItem('document', newDocument)
  } else {
    localStorage.removeItem('document')
  }
  clearGistSnapshotIfDirty()
})

// Initialize the models from localStorage if available
onMounted(() => {
  console.debug('LintView: onMounted')

  // Set the initial values from localStorage if available
  localStorage.getItem('document') && (documentModel.value = localStorage.getItem('document'))
  localStorage.getItem('schema') && (schemaModel.value = localStorage.getItem('schema'))

  const gistId = new URL(window.location.href).searchParams.get(GIST_QUERY_PARAM)
  gistId && loadGist(gistId)
})

// React to route changes
watch(
  () => route.params.markupLanguage,
  (markup) => {
    console.debug('LintView: Setting markup language to:', markup)
    configStore.currentMarkup = markup
  },
  { immediate: true },
)
watch(
  () => route.params.version,
  (spec) => {
    console.debug('LintView: Setting spec to:', spec)
    configStore.currentSpec = spec
  },
  { immediate: true },
)

// React to app-level events
useEventListener('reset', () => {
  console.debug('LintView: Reset')
  schemaModel.value = undefined
  documentModel.value = undefined
})
useEventListener('load-sample', async (sample) => {
  console.debug('LintView: Loading sample:', sample)

  schemaModel.value = undefined
  documentModel.value = undefined
  fetch('/samples/' + sample.ref + '.schema.json')
    // parse as JSON then pretty print to the current markup
    .then((res) => res.json())
    .then((obj) => configStore.markups[configStore.currentMarkup].service.prettyPrint(obj))
    // use this as the schema
    .then((data) => (schemaModel.value = data))
    .catch((err) => {
      console.error(err)
    })
  fetch('/samples/' + sample.ref + '.document.json')
    // parse as JSON then pretty print to the current markup
    .then((res) => res.json())
    .then((obj) => configStore.markups[configStore.currentMarkup].service.prettyPrint(obj))
    // use this as the document
    .then((data) => (documentModel.value = data))
    .catch((err) => {
      console.error(err)
    })
})

const getStoredGistToken = () => localStorage.getItem(GIST_TOKEN_STORAGE_KEY)?.trim()

const fetchGistToken = async () => {
  const existing = getStoredGistToken()
  if (existing) {
    return existing
  }

  window.open(GIST_TOKEN_SETUP_URL, '_blank', 'noopener,noreferrer')
  const submittedToken = window.prompt(
    'Paste a GitHub Personal Access Token (classic) with gist scope to save as your own public gist.',
    '',
  )

  if (!submittedToken?.trim()) {
    throw new Error('GitHub authentication is required to save a gist.')
  }

  localStorage.setItem(GIST_TOKEN_STORAGE_KEY, submittedToken.trim())
  return submittedToken.trim()
}

const buildErrorMessage = (error, fallbackTid) => {
  if (error instanceof GistFormatError) {
    return t('ERROR_GIST_FORMAT')
  }
  return error?.message || t(fallbackTid)
}

const loadGist = async (gistId) => {
  try {
    const gist = await retrieveGist(gistId)
    schemaModel.value = gist.schema
    documentModel.value = gist.document
    gistSnapshot.value = { id: gistId, ...gist }
    updateGistQueryParam(gistId)
    gistAlert.value = undefined
    trackUmamiEvent('loadGist', { gistId })
  } catch (error) {
    console.error(error)
    gistAlert.value = {
      className: 'alert-danger',
      title: t('ERROR_GIST_LOADING'),
      message: buildErrorMessage(error, 'ERROR_GIST_LOADING'),
    }
  }
}

const saveGist = async () => {
  if (!schemaModel.value || !documentModel.value) {
    return
  }

  try {
    const token = await fetchGistToken()
    const gistId = await savePublicGist({ schema: schemaModel.value, document: documentModel.value, token })

    updateGistQueryParam(gistId)
    gistSnapshot.value = {
      id: gistId,
      schema: schemaModel.value,
      document: documentModel.value,
    }
    gistAlert.value = {
      className: 'alert-success',
      title: t('GIST_SAVED'),
      message: t('GIST_VISIT'),
      href: window.location.href,
    }
    trackUmamiEvent('saveGist', { gistId })
  } catch (error) {
    console.error(error)
    const errorMessage = buildErrorMessage(error, 'ERROR_GIST_SAVING')
    if (/bad credentials|401|403/i.test(errorMessage)) {
      localStorage.removeItem(GIST_TOKEN_STORAGE_KEY)
    }
    gistAlert.value = {
      className: 'alert-danger',
      title: t('ERROR_GIST_SAVING'),
      message: errorMessage,
    }
  }
}

useEventListener('save-gist', saveGist)
</script>

<template>
  <div v-if="gistAlert" class="row g-3">
    <div class="col-12">
      <div class="alert mb-0" :class="gistAlert.className">
        <strong>{{ gistAlert.title }}</strong>
        <span v-if="gistAlert.message">: {{ gistAlert.message }} </span>
        <a v-if="gistAlert.href" :href="gistAlert.href" target="_blank" rel="noreferrer">{{ gistAlert.href }}</a>
      </div>
    </div>
  </div>

  <div class="row g-3 mt-1">
    <div class="col-xs-12 col-md-6">
      <ValidatorCard v-model:document="schemaModel" :mode="'schema'" identifier="schema" />
    </div>
    <div class="col-xs-12 col-md-6">
      <ValidatorCard v-model:document="documentModel" v-model:schema="schemaModel" :mode="'document'" identifier="document" />
    </div>
  </div>
</template>

<style scoped></style>
