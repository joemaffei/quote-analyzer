<template>
  <div>
    <div class="w-full flex justify-center">
      <dl class="flex space-x-8">
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Total Pounds</dt>
          <dd class="text-2xl">
            {{ totalPounds() }}
          </dd>
        </div>
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Invoice</dt>
          <dd class="text-2xl">
            {{ invoiceTotal() }}
          </dd>
        </div>
        <div class="bg-gray-300 flex flex-col items-center px-4 py-2">
          <dt>Avg $/CWT</dt>
          <dd class="text-2xl">0</dd>
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
          <th v-for="column in staticColumns" class="px-3 py-1 text-left">
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
            v-for="column in staticColumns.filter(c => c.property)"
          >
            {{
              column.property === 'Weight'
                ? row[column.property].toLocaleString('en-US')
                : row[column.property]
            }}
          </td>
          <td
            class="px-3 py-1 text-left"
            v-for="(column, columnIndex) in staticColumns.filter(c => c.property === null)"
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
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export default {
  name: "QuoteAnalyzer",
  computed: {
    staticColumns() {
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
    /**
     * Just for fun, this calculates the columns based on the data.
     * The downside of this approach is that the frontend has no control
     * over the order of the columns, can't customize table headers, etc.
     */
    dynamicColumns() {
      return this.rows.reduce((cols, row) => {
        Object.keys(row).forEach(key => {
          if (key === 'Quotes') {
            row.Quotes.forEach(quote => {
              cols.add(quote.Company);
            });
            return;
          }
          cols.add(key);
        });
        return cols;
      }, new Set())
    }
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
    invoiceTotal() {
      const total = this.selected.reduce((totalPrice, { rowIndex, columnIndex }) => {
        const weight = this.rows[rowIndex].Weight;
        const price = this.rows[rowIndex].Quotes[columnIndex].FinalPrice;
        return totalPrice + (weight / 100 * price);
      }, 0);

      return currencyFormatter.format(total);
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
    totalPounds() {
      let total = this.selected.reduce((weight, { rowIndex }) => {
        return weight + this.rows[rowIndex].Weight;
      }, 0);

      let unit = '';
      if (total > 1000) {
        total = total / 1000;
        unit = 'k';
      }
      if (total > 1000) {
        total = total / 1000;
        unit = 'M';
      }

      return total.toLocaleString('en-US') + unit;
    }
  },
  props: {
    rows: Array
  },
  watch: {
    getSelected() {
      this.selected = this.getSelected
    }
  }
}
</script>
