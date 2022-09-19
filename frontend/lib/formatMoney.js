export default function FormatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  };

  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-gb', options);

  return formatter.format(amount / 100);
}
