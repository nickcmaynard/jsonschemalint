import { describe, it, expect, vi } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

config.global.plugins = [
  createTestingPinia({
    createSpy: vi.fn,
  }),
]
config.global.mocks = {
  $t: (msg) => msg, // Mock the translation function
  route: { params: { version: 'draft-01' } },
}

import InvalidVersionView from '../InvalidVersionView.vue'

describe('InvalidVersionView', () => {
  it('renders error message', () => {
    const wrapper = mount(InvalidVersionView)
    expect(wrapper.text()).toContain('WARNING_UNSUPPORTED_SPEC_VERSION')
  })
})
