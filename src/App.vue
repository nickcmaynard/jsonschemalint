<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { pickBy } from 'lodash-es'
import { ref } from 'vue'

// eslint-disable-next-line no-unused-vars
import { Dropdown } from 'bootstrap'

import IconJournals from '~icons/bi/journals'
import IconTrash from '~icons/bi/trash'
import IconSave from '~icons/bi/floppy'
import IconPencilFill from '~icons/bi/pencil-fill'
import IconSignpostFill from '~icons/bi/signpost-fill'
import IconSliders from '~icons/bi/sliders'

import { useEventEmit } from 'mitt-vue'

import AboutContent from '@/components/AboutContent.vue'
import { validatorOptions } from '@/config/options'

import { useConfigStore } from '@/stores/config'

import { trackUmamiEvent } from '@jaseeey/vue-umami-plugin';

const configStore = useConfigStore()
const activeTooltip = ref()
const toggleTooltip = (option) => {
  activeTooltip.value = activeTooltip.value === option ? undefined : option
}
const optionFlagValue = (option) => configStore.currentOptionFlags?.[option.position] ?? option.values[0].value
const setOptionFlag = (option, value) => {
  const flags = (configStore.currentOptionFlags ?? '').padEnd(validatorOptions.length, '_').split('')
  flags[option.position] = value
  configStore.currentOptionFlags = flags.join('')
}
const resetOptions = () => {
  configStore.currentOptionFlags = undefined
}
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
  trackUmamiEvent('loadSample', { ref: sample.ref })
  useEventEmit('load-sample', { ref: sample.ref })
}
const reset = () => {
  console.debug('App.reset(): Reset')
  trackUmamiEvent('reset')
  useEventEmit('reset')
}
const saveGist = () => {
  console.debug('App.saveGist(): Save gist')
  useEventEmit('save-gist')
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
        <ul class="navbar-nav me-auto">
          <!-- About -->
          <li class="nav-item me-2">
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#aboutModel">{{ $t('ABOUT') }}</a>
          </li>

          <!-- Samples dropdown -->
          <li class="nav-item dropdown me-2 mb-2 mb-lg-0">
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
          <li class="nav-item me-0 mb-2 mb-lg-0" role="group" aria-label="Actions">
            <button class="btn btn-default btn-danger" @click="reset()">
              <icon-trash />
              &nbsp;{{ $t('RESET') }}
            </button>
            <button class="btn btn-default btn-outline-secondary ms-2" @click="saveGist()">
              <icon-save />
              &nbsp;{{ $t('SAVE_AS_GIST') }}
            </button>
          </li>
        </ul>

        <!-- Mode selectors -->
        <ul class="nav navbar-nav navbar-right mb-2 mb-lg-0">
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

            <div class="btn-group" role="group" aria-label="Validator options">
              <!-- Validator options dropdown -->
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="optionsDropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                <icon-sliders />
                &nbsp;{{ $t('OPTIONS') }}
              </button>
              <div class="dropdown-menu dropdown-menu-end p-3 validator-options-menu">
                <div v-for="option in validatorOptions" :key="option.name" class="mb-2">
                  <div class="d-flex align-items-center justify-content-between gap-3">
                    <button type="button" class="btn btn-link p-0 option-label" :aria-expanded="activeTooltip === option.name" @click="toggleTooltip(option.name)">
                      <span>{{ $t(option.label) }}</span>
                    </button>
                    <select :id="option.name" class="form-select w-auto" :value="optionFlagValue(option)" @change="setOptionFlag(option, $event.target.value)">
                      <option v-for="value in option.values" :key="value.value" :value="value.value">{{ $t(value.label, value.labelParams && { ...value.labelParams, defaultBehaviour: $t(value.labelParams.defaultBehaviour) }) }}</option>
                    </select>
                  </div>
                  <div v-if="activeTooltip === option.name" class="option-tooltip" role="tooltip">{{ $t(option.help) }}</div>
                </div>
                <button type="button" class="btn btn-outline-secondary w-100" @click="resetOptions">{{ $t('RESET_OPTIONS') }}</button>
              </div>
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

<style scoped>
.validator-options-menu {
  min-width: 24rem;
}

.option-label {
  color: var(--bs-body-color);
  text-decoration: underline dotted;
  text-underline-offset: 0.2rem;
}

.option-label:hover,
.option-label:focus {
  color: var(--bs-primary);
}

.option-tooltip {
  color: var(--bs-secondary-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
