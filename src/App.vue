<script setup>
import { ref, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { pickBy } from 'lodash-es'

import AboutContent from '@/components/AboutContent.vue'
import ValidatorCard from '@/components/ValidatorCard.vue'

import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()

const samples = {
  'draft-06': [
    {
      title: 'sample_titles.draft-06-valid',
      ref: 'draft6/valid',
    },
    {
      title: 'sample_titles.draft-06-invalid',
      ref: 'draft6/invalid',
    },
  ],
}

const displayedSpecs = (specs) => pickBy(specs, (spec) => !spec.hidden)

const setMarkup = (markup) => {
  console.debug('Setting markup language to:', markup)
  configStore.currentMarkup = markup
}
const setSpec = (spec) => {
  console.debug('Setting spec to:', spec)
  configStore.currentSpec = spec
}
const loadSample = async (sample) => {
  console.debug('Loading sample:', sample)
  fetch('samples/' + sample.ref + '.schema.json')
    .then((res) => res.json())
    .then((data) => (schemaModel.value = data))
    .catch((err) => {
      console.error(err)
    })
  fetch('samples/' + sample.ref + '.document.json')
    .then((res) => res.json())
    .then((data) => (documentModel.value = data))
    .catch((err) => {
      console.error(err)
    })
}
const reset = () => {
  schemaModel.value = undefined
  documentModel.value = undefined
}

const schemaModel = ref()
const documentModel = ref()
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
  <!-- Modal -->
  <div class="modal" id="aboutModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ $t('ABOUT') }}</h5>
        </div>
        <div class="modal-body"><AboutContent /></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">{{ $t('OK') }}</button>
        </div>
      </div>
    </div>
  </div>

  <nav class="navbar fixed-top navbar-expand-lg bg-light border-bottom">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">JSON Schema Lint</RouterLink>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- About -->
          <li class="nav-item me-2">
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#aboutModel">{{ $t('ABOUT') }}</a>
          </li>

          <!-- Samples dropdown -->
          <li class="nav-item dropdown me-2">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-journals"></i>
              &nbsp;{{ $t('SAMPLES') }}
            </button>
            <ul class="dropdown-menu">
              <div v-for="(spec, specKey, index) in samples" :key="specKey">
                <li>
                  <h6 class="dropdown-header">{{ specKey }}</h6>
                </li>
                <li v-for="sample in spec" :key="sample">
                  <a class="dropdown-item" @click="loadSample(sample)" v-html="$t(sample.title)"></a>
                </li>
                <li v-if="index < Object.keys(samples).length - 1"><hr class="dropdown-divider" /></li>
              </div>
            </ul>
          </li>

          <!-- Reset button-->
          <div class="btn-group navbar-btn me-2" role="group" aria-label="Actions">
            <button class="btn btn-default btn-danger" @click="reset()">
              <i class="bi bi-trash"></i>
              &nbsp;{{ $t('RESET') }}
            </button>
          </div>
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <div class="btn-group" role="group" aria-label="Mode selection">
            <div class="btn-group" role="group">
              <!-- Markup language dropdown -->
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="bi bi-pencil-fill"></span>
                &nbsp;{{ configStore.markups[configStore.currentMarkup].title || $t('ERROR_INVALID_MARKUP_BUTTON') }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 class="dropdown-header">{{ $t('MARKUP_LANGUAGE') }}</h6>
                </li>
                <li v-for="(value, key) in configStore.markups" :key="key">
                  <a class="dropdown-item" @click="setMarkup(key)">{{ value.title }}</a>
                </li>
              </ul>
            </div>

            <div class="btn-group" role="group">
              <!-- Specification version dropdown -->
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" v-bind:disabled="schemaModel && schemaModel.$schema">
                <span class="bi bi-signpost-fill"></span>
                &nbsp;{{ configStore.specs[configStore.currentSpec].name || $t('ERROR_INVALID_VERSION_BUTTON') }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 class="dropdown-header">{{ $t('OFFICIAL_SPEC_VERSION') }}</h6>
                </li>
                <li v-for="(value, key) in displayedSpecs(configStore.specs)" :key="key">
                  <a class="dropdown-item" @click="setSpec(key)">{{ value.label || value.name }}</a>
                </li>
              </ul>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container-fluid">
    <div class="row g-3">
      <div class="col-xs-12 col-md-6">
        <ValidatorCard v-model:document="schemaModel" :mode="'schema'" />
      </div>
      <div class="col-xs-12 col-md-6">
        <ValidatorCard v-model:document="documentModel" v-model:schema="schemaModel" :mode="'document'" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
