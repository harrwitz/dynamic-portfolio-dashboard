function toYahooSymbol(exchange) {
  const isBseCode = /^\d+$/.test(exchange);
  return isBseCode ? `${exchange}.BO` : `${exchange}.NS`;
}

console.log(toYahooSymbol('HDFCBANK'));
console.log(toYahooSymbol('532174'));     
console.log(toYahooSymbol('BAJFINANCE'));
console.log(toYahooSymbol('544252'));     