import { describe, it, expect, vi } from 'vitest'
import { shallowMount, config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useConfigStore } from '@/stores/config'
config.global.plugins = [
  createTestingPinia({
    createSpy: vi.fn,
    initialState: {
      config: {
        currentMarkup: 'json',
        currentSpec: 'draft-07',
      },
    },
  }),
]
config.global.mocks = {
  $t: (msg) => msg, // Mock the translation function
}

import Validator from '../ValidatorCard.vue'

describe('Validator.vue', () => {
  it('renders without crashing', () => {
    const wrapper = shallowMount(Validator)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the component with a top-level div', () => {
    const wrapper = shallowMount(Validator)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it.each([
    ['error', 'info'],
    ['invalid', 'danger'],
    ['valid', 'success'],
  ])('uses the %s color state for the title panel', async (state, color) => {
    const wrapper = shallowMount(Validator)

    wrapper.vm.validationState = state
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.validator-card').classes()).toContain(`border-${color}`)
    expect(wrapper.find('.card-header').classes()).toContain(`bg-${color}`)
  })

  it('uses the error state when JSON parsing fails', async () => {
    const configStore = useConfigStore()
    configStore.currentMarkup = 'json'
    configStore.currentSpec = 'draft-07'
    const wrapper = shallowMount(Validator, {
      props: {
        mode: 'schema',
        document: '{',
      },
    })

    await wrapper.vm.computeMessages()

    expect(wrapper.find('.validator-card').classes()).toContain('border-info')
    expect(wrapper.find('.card-header').classes()).toContain('bg-info')
  })
})
