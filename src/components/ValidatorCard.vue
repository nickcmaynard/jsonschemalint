<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ValidationMessages from '@/components/ValidationMessages.vue'

import { buildValidator } from '@/utilities/Validator'
import { debounce, isEqual } from 'lodash-es'

import IconFormat from '~icons/bi/list-nested'

import { trackUmamiEvent } from '@jaseeey/vue-umami-plugin';

// Config
import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()
const { currentMarkup, currentSpec } = storeToRefs(configStore)

// Get the current markup service
const getMarkupService = async () => {
  if (configStore.markups[configStore.currentMarkup]) {
    return configStore.markups[configStore.currentMarkup].service
  } else {
    return Promise.reject([
      {
        message_tid: 'ERROR_INVALID_MARKUP',
        message_params: { markupLanguage: configStore.currentMarkup },
      },
    ])
  }
}

// Format the document using the current markup service
function format() {
  console.debug('ValidatorCard.format()')
  trackUmamiEvent(`format${props.mode === 'schema' ? 'Schema' : 'Document'}`)
  getMarkupService()
    .then((service) =>
      service
        .parse(documentModel.value)
        .then(service.prettyPrint)
        .then((formatted) => (documentModel.value = formatted)),
    )
    .catch((errors) => {
      console.error('Error formatting document:', errors)
      messages.value = errors || []
    })
}

// reactive state
const valid = ref()
const messages = ref([])
// const localDocumentObject = ref()
// const localSchemaObject = ref()

const props = defineProps({
  mode: {
    type: String,
    default: 'document', // 'document' or 'schema'
  },
})

// Define a model to hold the parsed document
const documentModel = defineModel('document', {
  type: String,
})
const schemaModel = defineModel('schema', {
  type: String,
})

// Validation
const getValidator = async () => {
  // Create a new Validator instance with the current spec
  if (!configStore.specs[configStore.currentSpec].schema) {
    console.warn('No schema reference found for current spec:', configStore.currentSpec)
    return null
  }
  return await buildValidator(configStore.specs[configStore.currentSpec].schema)
}
const validateSchema = async function (schemaObject) {
  console.debug('Validating schema', schemaObject)
  trackUmamiEvent('validateSchema')
  return (await getValidator()).validateSchema(schemaObject)
}
const validateDocument = async function (schemaObject, documentObject) {
  console.debug('Validating document')
  trackUmamiEvent('validateDocument')
  return (await getValidator()).validate(schemaObject, documentObject)
}

// Compute messages based on the document
const computeMessages = async () => {
  console.debug(`ValidatorCard[${props.mode}]: computeMessages()`)
  return getMarkupService()
    .then((service) => {
      return Promise.all([
        //
        service.parse(documentModel.value, props.mode),
        props.mode === 'document' ? service.parse(schemaModel.value, 'schema') : undefined,
      ])
        .then((res) => {
          const documentObject = res[0],
            schemaObject = res[1]
          if (props.mode === 'schema') {
            // Set configstore from $schema if specified
            if (documentObject?.$schema) {
              console.debug(`ValidatorCard[${props.mode}]: Setting current spec from schema: ${documentObject.$schema}`)
              configStore.currentSpec = Object.keys(configStore.specs).find((spec) => configStore.specs[spec].schema === documentObject.$schema) || configStore.currentSpec // Fallback to current spec if not found
            }
            configStore.specDefinesSchema = !!documentObject?.$schema;
          }
          return props.mode === 'schema' ? validateSchema(documentObject) : validateDocument(schemaObject, documentObject)
        })
        .then((result) => {
          console.debug('Validation result:', result)
          messages.value = [
            {
              message_tid: props.mode === 'schema' ? 'SCHEMA_VALID_MESSAGE' : 'DOCUMENT_VALID_MESSAGE',
              message_params: { name: currentSpec },
            },
          ]
          valid.value = true
        })
    })
    .catch((errors) => {
      console.error('Error parsing document:', errors)
      console.info(errors.message)
      messages.value = errors || []
      valid.value = false
    })
}

// Reactions to changes
const _nextTickComputeMessages = debounce(computeMessages)
const debouncedComputeMessages = debounce(() => {
  inputReactionComputeMessages.flush()
  _nextTickComputeMessages()
}, 50)
const inputReactionComputeMessages = debounce(() => {
  debouncedComputeMessages.flush()
  _nextTickComputeMessages()
}, 250)
watch(currentMarkup, () => {
  console.debug(`ValidatorCard[${props.mode}]: watch(currentMarkup) fired`)
  debouncedComputeMessages()
})
watch(currentSpec, () => {
  console.debug(`ValidatorCard[${props.mode}]: watch(currentSpec) fired`)
  debouncedComputeMessages()
})
watch(schemaModel, () => {
  console.debug(`ValidatorCard[${props.mode}]: watch(schemaModel) fired`)
  inputReactionComputeMessages()
})
onMounted(async () => {
  console.debug(`ValidatorCard[${props.mode}]: onMounted() fired`)
  // myDoc.value = await (await getMarkupService()).prettyPrint(documentModel.value)
  computeMessages()
})
watch(documentModel, async (value, oldValue) => {
  console.debug(`ValidatorCard[${props.mode}]: watch(documentModel) fired`)
  // This check is essential to avoid infinite loops
  if (!isEqual(value, oldValue)) {
    console.debug(`ValidatorCard[${props.mode}]: watch(documentModel) fired & changed`)
    // myDoc.value = typeof value === 'undefined' ? undefined : await (await getMarkupService()).prettyPrint(value)
    inputReactionComputeMessages() // Don't do it immediately
  }
})
// watch(myDoc, (value, oldValue) => {
//   console.debug(`ValidatorCard[${props.mode}]: watch(myDoc) fired`, value, oldValue)
//   if (value !== oldValue) {
//     console.debug(`ValidatorCard[${props.mode}]: watch(myDoc) fired & changed`)
//     inputReactionComputeMessages()
//   }
// })
</script>

<template>
  <div class="card validator-card" :class="{ 'border-danger': !valid }">
    <div class="card-header d-flex justify-content-between align-items-center text-white" :class="{ 'bg-danger': !valid, 'bg-success': valid }">
      <span>
        <strong>{{ $t(mode === 'schema' ? 'SCHEMA' : 'DOCUMENT') }}</strong> :: {{ configStore.markups[currentMarkup]?.title ?? $t('ERROR_INVALID_MARKUP_BUTTON')
        }}{{ mode === 'schema' ? ', ' + (configStore.specs[currentSpec]?.name ?? $t('ERROR_INVALID_VERSION_BUTTON')) : '' }}
      </span>
      <button type="button" class="btn btn-light btn-sm" @click="format"> <icon-format />&nbsp;{{ $t('FORMAT') }} </button>
    </div>

    <div class="validator">
      <form novalidate>
        <textarea v-model="documentModel" class="form-control validator-document font-monospace" spellcheck="false"></textarea>
      </form>

      <ValidationMessages :messages="messages" :doctype="mode.toUpperCase()"></ValidationMessages>
    </div>
  </div>
</template>

<style scoped>
.card {
  min-height: calc(100vh - 5rem);
}

.validator,
.validator > form,
.validator > form > textarea {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.validator > form > textarea {
  min-height: 300px;
}
</style>
