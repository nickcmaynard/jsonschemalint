<script setup>
import ValidatorCard from '@/components/ValidatorCard.vue'
import DeviceAuthContent from '@/components/DeviceAuthContent.vue'

import { Modal } from 'bootstrap'

import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useConfigStore } from '@/stores/config'
import { DeviceFlowError, GistFormatError, retrieveGist, saveGistWithAuth } from '@/utilities/Gist'
const configStore = useConfigStore()
const { currentMarkup, currentSpec } = storeToRefs(configStore)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

import { useEventListener } from 'mitt-vue'
import { trackUmamiEvent } from '@jaseeey/vue-umami-plugin'

const GIST_QUERY_PARAM = 'gist'

const schemaModel = ref()
const documentModel = ref()
const gistSnapshot = ref()
const gistAlert = ref()
const deviceAuth = ref()
const deviceAuthModalEl = ref(null)

let cancelGistTokenFetch = () => {}
let deviceAuthModal

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

// Synchronize the route query with the models
const updateGistQueryParam = (gistId) => {
  return router.replace({ query: { ...route.query, [GIST_QUERY_PARAM]: gistId || undefined } })
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

  route.query[GIST_QUERY_PARAM] && loadGist(route.query[GIST_QUERY_PARAM])

  deviceAuthModal = Modal.getOrCreateInstance(deviceAuthModalEl.value)
  // Any dismissal (backdrop click, ESC, or the Cancel button) should stop the pending auth
  deviceAuthModalEl.value.addEventListener('hide.bs.modal', cancelGistAuth)
})

// Show/hide the auth modal as the device flow starts and finishes
watch(deviceAuth, (value) => {
  if (value) {
    deviceAuthModal?.show()
  } else {
    deviceAuthModal?.hide()
  }
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

const cancelGistAuth = () => {
  cancelGistTokenFetch()
}

const buildErrorMessage = (error, fallbackTid) => {
  if (error instanceof GistFormatError) {
    return t('ERROR_GIST_FORMAT')
  }
  if (error instanceof DeviceFlowError) {
    return error.message
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
    const { promise, cancel } = saveGistWithAuth({
      schema: schemaModel.value,
      document: documentModel.value,
      onDeviceCode: (auth) => (deviceAuth.value = auth),
    })
    cancelGistTokenFetch = cancel
    const gistId = await promise.finally(() => {
      deviceAuth.value = undefined
    })

    await updateGistQueryParam(gistId)
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
    gistAlert.value = {
      className: 'alert-danger',
      title: t('ERROR_GIST_SAVING'),
      message: buildErrorMessage(error, 'ERROR_GIST_SAVING'),
    }
  }
}

useEventListener('save-gist', saveGist)
</script>

<template>
  <div class="modal" ref="deviceAuthModalEl" tabindex="-1" aria-labelledby="deviceAuthModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deviceAuthModalLabel">{{ $t('GIST_AUTH_TITLE') }}</h5>
        </div>
        <div class="modal-body" v-if="deviceAuth">
          <DeviceAuthContent :device-auth="deviceAuth" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">{{ $t('GIST_AUTH_CANCEL') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="gistAlert" class="row g-3">
    <div class="col-12">
      <div class="alert mb-0" :class="gistAlert.className">
        <strong>{{ gistAlert.title }}</strong>
        <span v-if="gistAlert.message">: {{ gistAlert.message }} </span>
        <a v-if="gistAlert.href" :href="gistAlert.href" target="_blank" rel="noreferrer">&nbsp;{{ gistAlert.href }}</a>
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
