<template>
  <table>
    <thead>
      <tr class="bg-gray-200">
        <th v-for="column in columns" class="px-3 py-1 text-left">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, rowIndex) in rows"
        class="odd:bg-gray-100"
        :class="{ 'font-bold': isSelected(rowIndex) }"
      >
        <td
          class="px-3 py-1 text-left"
          v-for="column in columns.filter(c => c.property)"
        >
          {{
            column.property === 'Weight'
              ? formatNumber(row[column.property])
              : row[column.property]
          }}
        </td>
        <td
          class="px-3 py-1 text-left"
          v-for="(column, columnIndex) in columns.filter(c => c.property === null)"
        >
          <PriceButton
            class="w-full text-left"
            :adornment="getRowAdornment(row, column)"
            :checked="isChecked(rowIndex, columnIndex)"
            :fade="isRowChecked(rowIndex) && !isChecked(rowIndex, columnIndex)"
            :price="getRowPrice(row, column)"
            @price-button-click="handleClick(rowIndex, columnIndex)"
          />
        </td>
      </tr>
    </tbody>
    </table>
</template>

<script>
import { formatCurrency, formatNumber, formatNumberShort } from "~/shared/formatting";

export default {
  name: "QuoteTable",
  data() {
    return {
      columns: [
        { label: 'Location', property: 'Location' },
        { label: 'Part #', property: 'PartNo' },
        { label: 'Steel Product', property: 'Product' },
        { label: 'Weight', property: 'Weight' },
        { label: 'Big Creek Steel', property: null },
        { label: 'Steel Core', property: null },
        { label: 'AC Steel', property: null },
        { label: 'RBI', property: null },
      ],
    }
  },
  methods: {
    formatCurrency,
    formatNumber,
    formatNumberShort,
    getRow(row, column) {
      return row.Quotes.find(quote => quote.Company === column.label);
    },
    getRowAdornment(row, column) {
      if (this.isHighest(row, column)) return 'highest';
      if (this.isLowest(row, column)) return 'lowest';
    },
    getRowPrice(row, column) {
      return this.getRow(row, column)[this.priceKey];
    },
    getRowQuoteValues(row) {
      return row.Quotes.map(quote => quote[this.priceKey]);
    },
    handleClick(rowIndex, columnIndex) {
      this.$emit('price-button-click', rowIndex, columnIndex);
    },
    isChecked(rowIndex, columnIndex) {
      const rowInSelected = this.selected.find(row => row.rowIndex === rowIndex);
      return rowInSelected && rowInSelected.columnIndex === columnIndex;
    },
    isHighest(row, column) {
      const current = this.getRowPrice(row, column);
      const lowest = Math.max.apply(null, this.getRowQuoteValues(row));
      return current === lowest;
    },
    isLowest(row, column) {
      const current = this.getRowPrice(row, column);
      const lowest = Math.min.apply(null, this.getRowQuoteValues(row));
      return current === lowest;
    },
    isRowChecked(rowIndex) {
      return this.selected.some(row => row.rowIndex === rowIndex);
    },
    isSelected(rowIndex) {
      return this.selected.find(row => row.rowIndex === rowIndex);
    },
  },
  props: {
    priceKey: String,
    rows: Array,
    selected: Array,
  }
}
</script>
