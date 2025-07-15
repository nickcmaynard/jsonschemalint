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

import App from '../App.vue'

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.exists()).toBe(true)
  })
})
