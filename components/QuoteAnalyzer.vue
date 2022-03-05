<template>
  <div class="mt-6">
    <div class="w-full flex justify-center">
      <dl class="flex space-x-8">
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Total Pounds</dt>
          <dd class="text-2xl">
            {{ formatNumberShort(totalWeight) }}{{ totalWeight.unit }}
          </dd>
        </div>
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Invoice</dt>
          <dd class="text-2xl">
            {{ formatCurrency(invoiceTotal) }}
          </dd>
        </div>
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Avg $/CWT</dt>
          <dd class="text-2xl">
            {{ formatCurrency(averagePrice) }}
          </dd>
        </div>
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
  </div>
</template>

<script>
import { formatCurrency, formatNumber, formatNumberShort } from "~/shared/formatting";

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
    },
    columns() {
      return [
        { label: 'Location', property: 'Location' },
        { label: 'Part #', property: 'PartNo' },
        { label: 'Steel Product', property: 'Product' },
        { label: 'Weight', property: 'Weight' },
        { label: 'Big Creek Steel', property: null },
        { label: 'Steel Core', property: null },
        { label: 'AC Steel', property: null },
        { label: 'RBI', property: null },
      ];
    },
  },
  data() {
    return {
      selected: [],
      priceKey: 'FinalPrice'
    }
  },
  methods: {
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
    formatCurrency,
    formatNumber,
    formatNumberShort
  },
  props: {
    rows: Array
  }
}
</script>
