import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import SimpleJsonViewer from '../packages'


describe('SimpleJsonViewer.vue', () => {
  it("Test no data rendering", async ({ expect }) => {
    const wrapper = mount(SimpleJsonViewer, {
      props: {
        modelValue: null
      }
    })

    const noDataElem = wrapper.find('div.text-sm.c-gray-600')

    expect(noDataElem.exists()).toBe(true)

    expect(noDataElem.text()).toEqual(
      expect.stringContaining("No data")
    )
  })

  it("Test expanding/collapsing", async ({ expect }) => {
    const wrapper = mount(SimpleJsonViewer, {
      props: {
        modelValue: { "foo": "bar" }
      }
    })

    const ellipsisElem = wrapper.find('div > span')

    expect(ellipsisElem.exists()).toBe(true)
    expect(wrapper.text()).toEqual(
      expect.not.stringContaining('"foo":') && expect.not.stringContaining("bar")
    )
    await ellipsisElem.trigger('click')
    expect(wrapper.text()).toEqual(
      expect.stringContaining('"foo":') && expect.stringContaining("bar")
    )

    const expandBtn = wrapper.find('i')

    expect(expandBtn.classes()).toEqual(
      expect.arrayContaining(['i-mdi-chevron-down'])
    )

    await expandBtn.trigger('click')
    expect(wrapper.text()).toEqual(
      expect.not.stringContaining('"foo":') && expect.not.stringContaining("bar")
    )
  })
})