<template>
  <div class="mt-6">
    <div class="w-full flex justify-center">
      <dl class="flex space-x-8">
        <TopPanel
          label="Total Pounds"
          :value="formatNumberShort(totalWeight)"
        />
        <TopPanel
          label="Invoice"
          :value="formatCurrency(invoiceTotal)"
        />
        <TopPanel
          label="Avg $/CWT"
          :value="formatCurrency(averagePrice)"
        />
      </dl>
    </div>
    <div class="my-2 flex justify-end">
      <select
        class="px-3 py-1"
        v-model="priceKey"
      >
        <option value="FinalPrice">Final Price</option>
        <option value="PackagingFee">Packaging Fee</option>
        <option value="FreightFee">Freight Fee</option>
      </select>
    </div>
    <QuoteTable
      :priceKey="priceKey"
      :rows="rows"
      :selected="selected"
      @price-button-click="handleClick"
    />
  </div>
</template>

<script>
import { formatCurrency, formatNumberShort } from "~/shared/formatting";

export default {
  name: "QuoteAnalyzer",
  computed: {
    averagePrice() {
      // prevent division by zero
      if (this.totalWeight === 0) return 0;
      return this.invoiceTotal / this.totalWeight * 100;
    },
    invoiceTotal() {
      return this.selected.reduce((totalPrice, { rowIndex, columnIndex }) => {
        const weight = this.rows[rowIndex].Weight;
        const price = this.rows[rowIndex].Quotes[columnIndex].FinalPrice;
        return totalPrice + (weight / 100 * price);
      }, 0);
    },
    totalWeight() {
      return this.selected.reduce((total, { rowIndex }) => {
        return total + this.rows[rowIndex].Weight;
      }, 0);
    }
  },
  data() {
    return {
      priceKey: 'FinalPrice',
      selected: [],
    }
  },
  methods: {
    formatCurrency,
    formatNumberShort,
    handleClick(rowIndex, columnIndex) {
      const rowInSelected = this.selected.find(row => row.rowIndex === rowIndex);

      if (rowInSelected) {
          this.selected = this.selected.filter(row => row !== rowInSelected);
        if (rowInSelected.columnIndex !== columnIndex) {
          this.selected.push({ rowIndex, columnIndex });
        }
      } else {
        this.selected.push({ rowIndex, columnIndex });
      }
    },
  },
  props: {
    rows: Array
  }
}
</script>
