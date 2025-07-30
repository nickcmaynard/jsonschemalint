import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutContent from '../AboutContent.vue'

describe('AboutContent.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(AboutContent)
    expect(wrapper.exists()).toBe(true)
  })

  it('links to ajv', () => {
    const wrapper = mount(AboutContent)
    expect(wrapper.text()).toContain('Ajv')
  })
})
