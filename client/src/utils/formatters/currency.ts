import { isNull } from 'util';

export default function currencyFormatter(
  number: number,
  excludeDollarSign?: true
) {
  if (isNull(number)) {
    return '';
  }
  var val = number;
  if (typeof val == 'string') {
    val = parseFloat(val);
  }
  return (
    (!excludeDollarSign ? '$' : '') +
    val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}
