const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatNumber(value) {
  return value.toLocaleString('en-US');
}

export function formatNumberShort(value) {
  let shortValue = value;
  let unit = '';
  if (shortValue > 1000) {
    shortValue /= 1000;
    unit = 'k';
  }
  if (shortValue > 1000) {
    shortValue /= 1000;
    unit = 'M'
  }

  return this.formatNumber(shortValue) + unit;
}
