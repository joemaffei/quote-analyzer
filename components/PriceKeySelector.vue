<template>
  <select
    class="px-3 py-1"
    @input="$emit('input', $event.target.value)"
  >
    <option value="FinalPrice">Final Price</option>
    <option value="PackagingFee">Packaging Fee</option>
    <option value="FreightFee">Freight Fee</option>
  </select>
</template>

<script>
export default {
  name: "PriceKeySelector",
  props: {
    value: String
  }
}
</script>
