<template>
  <button
      :aria-disabled="!showPrice"
      class="px-3 py-1 space-x-2"
      :class="{
        'bg-gray-200': !isHighest && !isLowest && showPrice,
        'bg-gray-300': !showPrice,
        'bg-red-100': isHighest,
        'bg-green-100': isLowest,
        'opacity-40': fade,
      }"
      @click="$emit('price-button-click')"
  >
    <span :class="{ 'font-bold': checked }">
      {{ formattedPrice }}
    </span>
    <font-awesome-icon
      aria-label="lowest price"
      class="text-green-600"
      icon="thumbs-up"
      v-if="isLowest"
    />
    <font-awesome-icon
      aria-label="highest price"
      class="text-red-600"
      icon="thumbs-down"
      v-if="isHighest"
    />
  </button>
</template>

<script>
import { formatCurrency } from "~/shared/formatting";

export default {
  name: "PriceButton",
  computed: {
    isHighest() {
      return this.adornment === 'highest'
    },
    isLowest() {
      return this.adornment === 'lowest'
    },
    showPrice() {
      return this.price !== null && this.price !== undefined
    },
    formattedPrice() {
      if (!this.showPrice) return '---'
      return formatCurrency(this.price);
    }
  },
  props: {
    adornment: String,
    checked: Boolean,
    fade: Boolean,
    price: Number,
  }
}
</script>
