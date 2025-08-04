<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { pickBy } from 'lodash-es'

import { Dropdown } from 'bootstrap'

import IconJournals from '~icons/bi/journals'
import IconTrash from '~icons/bi/trash'
import IconPencilFill from '~icons/bi/pencil-fill'
import IconSignpostFill from '~icons/bi/signpost-fill'

import { useEventEmit } from 'mitt-vue'

import AboutContent from '@/components/AboutContent.vue'

import { useConfigStore } from '@/stores/config'
const configStore = useConfigStore()

const samples = {
  'draft-04': [
    {
      i18n_title: 'SAMPLE_TITLES.VALID',
      i18n_params: { version: 'draft-04' },
      ref: 'draft-04/valid',
    },
    {
      i18n_title: 'SAMPLE_TITLES.INVALID',
      i18n_params: { version: 'draft-04' },
      ref: 'draft-04/invalid',
    },
  ],
  'draft-06': [
    {
      i18n_title: 'SAMPLE_TITLES.VALID',
      i18n_params: { version: 'draft-06' },
      ref: 'draft-06/valid',
    },
    {
      i18n_title: 'SAMPLE_TITLES.INVALID',
      i18n_params: { version: 'draft-06' },
      ref: 'draft-06/invalid',
    },
  ],
  'draft-07': [
    {
      i18n_title: 'SAMPLE_TITLES.VALID',
      i18n_params: { version: 'draft-07' },
      ref: 'draft-07/valid',
    },
    {
      i18n_title: 'SAMPLE_TITLES.INVALID',
      i18n_params: { version: 'draft-07' },
      ref: 'draft-07/invalid',
    },
  ],
}

const displayedSpecs = (specs) => pickBy(specs, (spec) => !spec.hidden)

const setMarkup = (markup) => {
  console.debug('App.setMarkup(): Setting markup language to:', markup)
  configStore.currentMarkup = markup
}
const setSpec = (spec) => {
  console.debug('App.setSpec(): Setting spec to:', spec)
  configStore.currentSpec = spec
}
const loadSample = async (sample) => {
  console.debug('App.loadSample(): Loading sample:', sample)
  useEventEmit('load-sample', { ref: sample.ref })
}
const reset = () => {
  console.debug('App.reset(): Reset')
  useEventEmit('reset')
}
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
              <icon-journals />
              &nbsp;{{ $t('SAMPLES') }}
            </button>
            <ul class="dropdown-menu">
              <div v-for="(spec, specKey, index) in samples" :key="specKey">
                <li>
                  <h6 class="dropdown-header">{{ specKey }}</h6>
                </li>
                <li v-for="sample in spec" :key="sample">
                  <a class="dropdown-item" @click="loadSample(sample)" v-html="$t(sample.i18n_title, sample.i18n_params)"></a>
                </li>
                <li v-if="index < Object.keys(samples).length - 1"><hr class="dropdown-divider" /></li>
              </div>
            </ul>
          </li>

          <!-- Reset button-->
          <div class="btn-group navbar-btn me-2" role="group" aria-label="Actions">
            <button class="btn btn-default btn-danger" @click="reset()">
              <icon-trash />
              &nbsp;{{ $t('RESET') }}
            </button>
          </div>
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <div class="btn-group" role="group" aria-label="Mode selection">
            <div class="btn-group" role="group" aria-label="Markup selection">
              <!-- Markup language dropdown -->
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="markupDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <icon-pencil-fill />
                &nbsp;{{ configStore.markups[configStore.currentMarkup]?.title ?? $t('ERROR_INVALID_MARKUP_BUTTON') }}
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

            <div class="btn-group" role="group" aria-label="Spec version selection">
              <!-- Specification version dropdown -->
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="specDropdown" data-bs-toggle="dropdown" aria-expanded="false" v-bind:disabled="configStore.specDefinesSchema">
                <icon-signpost-fill />
                &nbsp;{{ configStore.specs[configStore.currentSpec]?.name ?? $t('ERROR_INVALID_VERSION_BUTTON') }}
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
    <RouterView />
  </main>
</template>

<style scoped></style>
