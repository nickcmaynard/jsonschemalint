<script setup>
import ValidatorCard from '@/components/ValidatorCard.vue'

import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { pickBy } from 'lodash-es'
import { storeToRefs } from 'pinia'

import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
const { currentMarkup, currentSpec } = storeToRefs(configStore)

const route = useRoute()
const router = useRouter()

import { useEventListener } from 'mitt-vue'

const schemaModel = ref()
const documentModel = ref()

// React to store changes
watch(currentMarkup, (markup) => {
  console.debug(`LintView: watch(currentMarkup) fired`, markup)
  router.push({ path: `/version/${configStore.currentSpec}/markup/${markup}` })
})
watch(currentSpec, (spec) => {
  console.debug(`LintView: watch(currentSpec) fired`, spec)
  router.push({ path: `/version/${spec}/markup/${configStore.currentMarkup}` })
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
    .then((res) => res.json())
    .then((data) => (schemaModel.value = data))
    .catch((err) => {
      console.error(err)
    })
  fetch('/samples/' + sample.ref + '.document.json')
    .then((res) => res.json())
    .then((data) => (documentModel.value = data))
    .catch((err) => {
      console.error(err)
    })
})

console.log('LintView', route.params.markupLanguage, route.params.version)

// React to $schema stuff
watch(schemaModel, (newSchema) => {
  console.info('Schema model updated:', newSchema)
  if (newSchema && newSchema.$schema) {
    console.info('Schema model has $schema:', newSchema.$schema)
    const newSpec = Object.keys(pickBy(configStore.specs, (spec) => spec.schema === newSchema.$schema))[0]
    if (newSpec) {
      console.info('Setting current spec to:', newSpec)
      configStore.currentSpec = newSpec
    } else {
      console.warn('No matching spec found for schema:', newSchema.$schema)
    }
  } else {
    console.info('Schema model does not have $schema:', newSchema)
  }
})
</script>

<template>
  <div class="row g-3">
    <div class="col-xs-12 col-md-6">
      <ValidatorCard v-model:document="schemaModel" :mode="'schema'" />
    </div>
    <div class="col-xs-12 col-md-6">
      <ValidatorCard v-model:document="documentModel" v-model:schema="schemaModel" :mode="'document'" />
    </div>
  </div>
</template>

<style scoped></style>
