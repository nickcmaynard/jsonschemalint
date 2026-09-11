import { describe, it, expect, vi } from 'vitest'
import { shallowMount, config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
config.global.plugins = [
  createTestingPinia({
    createSpy: vi.fn,
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
    ['invalid', 'danger'],
    ['warning', 'warning'],
    ['valid', 'success'],
  ])('uses the %s color state for the title panel', async (state, color) => {
    const wrapper = shallowMount(Validator)

    wrapper.vm.validationState = state
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.validator-card').classes()).toContain(`border-${color}`)
    expect(wrapper.find('.card-header').classes()).toContain(`bg-${color}`)
  })
})
