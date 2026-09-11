<script setup>
import { ref } from 'vue'

import IconSliders from '~icons/bi/sliders'

import { getOptionFlag, validatorOptions } from '@/config/options'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const activeTooltip = ref()

const toggleTooltip = (option) => {
  activeTooltip.value = activeTooltip.value === option ? undefined : option
}
const optionFlagValue = (option) => getOptionFlag(configStore.currentOptionFlags, option.name) ?? option.values[0].value
const optionFlagLabel = (option) => {
  const selectedValue = optionFlagValue(option)
  return option.values.find((value) => value.value === selectedValue)
}
const setOptionFlag = (option, value) => {
  const flags = (configStore.currentOptionFlags ?? '').padEnd(validatorOptions.length, '_').split('')
  flags[option.position] = value
  configStore.currentOptionFlags = flags.join('')
}
const resetOptions = () => {
  configStore.currentOptionFlags = undefined
}
</script>

<template>
  <div class="btn-group" role="group" aria-label="Validator options">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="optionsDropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
      <icon-sliders />
      &nbsp;{{ $t('OPTIONS') }}
    </button>
    <ul class="dropdown-menu dropdown-menu-end validator-options-menu">
      <li>
        <h6 class="dropdown-header">{{ $t('OPTIONS') }}</h6>
      </li>
      <li v-for="option in validatorOptions" :key="option.name" class="mb-2">
        <div class="px-3 d-flex align-items-center justify-content-between gap-3">
          <button type="button" class="btn btn-link p-0 option-label" :aria-expanded="activeTooltip === option.name" @click="toggleTooltip(option.name)">
            <span>{{ $t(option.label) }}</span>
          </button>
          <div class="btn-group">
            <button :id="`${option.name}Dropdown`" class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ $t(optionFlagLabel(option).label, optionFlagLabel(option).labelParams && { ...optionFlagLabel(option).labelParams, defaultBehaviour: $t(optionFlagLabel(option).labelParams.defaultBehaviour) }) }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-for="value in option.values" :key="value.value">
                <a class="dropdown-item" @click="setOptionFlag(option, value.value)">{{ $t(value.label, value.labelParams && { ...value.labelParams, defaultBehaviour: $t(value.labelParams.defaultBehaviour) }) }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="activeTooltip === option.name" class="option-tooltip" role="tooltip">{{ $t(option.help) }}</div>
      </li>
      <li class="px-3 mb-2">
        <button type="button" class="btn btn-outline-secondary w-100" @click="resetOptions">{{ $t('RESET_OPTIONS') }}</button>
      </li>
    </ul>
  </div>
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
