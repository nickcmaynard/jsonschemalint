import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import DeviceAuthContent from '../DeviceAuthContent.vue'

config.global.mocks = {
  $t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key),
}

describe('DeviceAuthContent.vue', () => {
  const deviceAuth = { userCode: 'ABCD-1234', verificationUri: 'https://github.com/login/device' }

  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })

  it('renders properly', () => {
    const wrapper = mount(DeviceAuthContent, { props: { deviceAuth } })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the user code', () => {
    const wrapper = mount(DeviceAuthContent, { props: { deviceAuth } })
    expect(wrapper.text()).toContain('ABCD-1234')
  })

  it('copies the user code to the clipboard when clicked', async () => {
    const wrapper = mount(DeviceAuthContent, { props: { deviceAuth } })
    await wrapper.find('button').trigger('click')
    await vi.waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABCD-1234'))
  })
})
