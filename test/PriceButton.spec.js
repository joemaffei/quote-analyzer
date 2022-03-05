import { mount } from '@vue/test-utils'
import PriceButton from '@/components/PriceButton.vue'

describe('PriceButton', () => {
  test('displays an empty state when price is null or undefined', () => {
    const wrapper = mount(PriceButton)
  })

  test('formats the price as currency', () => {
    const wrapper = mount(PriceButton)
  })

  test('displays lowest price adornment based on prop', () => {
    const wrapper = mount(PriceButton)
  })

  test('displays highest price adornment based on prop', () => {
    const wrapper = mount(PriceButton)
  })

  test('displays checked icon based on prop', () => {
    const wrapper = mount(PriceButton)
  })
})
