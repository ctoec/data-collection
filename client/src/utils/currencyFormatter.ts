import { isNull } from 'util';

export default function currencyFormatter(
  number?: number | null,
  excludeDollarSign?: true
) {
  if (isNull(number)) {
    return '';
  }

  return (
    (!excludeDollarSign ? '$' : '') +
    number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}
