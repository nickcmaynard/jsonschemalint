import { describe, it, expect } from 'vitest'
import { shallowMount, config } from '@vue/test-utils'

import ValidationMessages from '../ValidationMessages.vue'

config.global.mocks = {
  $t: (msg) => msg, // Mock the translation function
}

describe('ValidationMessages.vue', () => {
  it('renders without crashing', () => {
    const wrapper = shallowMount(ValidationMessages)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the component with a top-level table', () => {
    const messages = [{ message: 'test' }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })

    expect(wrapper.element.tagName).toBe('TABLE')
  })

  it('renders no messages when empty', () => {
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages: [] },
    })
    expect(wrapper.text()).toBe('')
  })

  it('renders a single simple message', () => {
    const messages = [{ message: 'Field is required.' }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })
    expect(wrapper.text()).toContain('Field is required.')
  })

  it('renders multiple simple messages', () => {
    const messages = [{ message: 'Field is required.' }, { message: 'Must be a number.' }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })
    expect(wrapper.text()).toContain('Field is required.')
    expect(wrapper.text()).toContain('Must be a number.')
  })

  it('renders multiple error messages', () => {
    const messages = [{ message: 'Bad property', instancePath: '/flibble', data: { data: 'data' } }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })
    expect(wrapper.text()).toContain('Bad property')
    expect(wrapper.text()).toContain('/flibble')
    expect(wrapper.text()).toContain('data')
  })

  it('renders the error table header when only error messages are present', () => {
    const messages = [{ message: 'Bad property', instancePath: '/flibble', data: { data: 'data' } }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })
    expect(wrapper.find('thead').text()).toContain('FIELD') // No translation in tests
    expect(wrapper.find('thead').text()).not.toContain('MESSAGE')
  })

  it('renders the simple table header when only error messages are present', () => {
    const messages = [{ message: 'Field is required.' }]
    const wrapper = shallowMount(ValidationMessages, {
      propsData: { messages },
    })
    expect(wrapper.find('thead').text()).not.toContain('FIELD') // No translation in tests
    expect(wrapper.find('thead').text()).toContain('MESSAGE')
  })
})
