const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function test(symbol) {
  console.log(`\n--- ${symbol} ---`);
  try {
    const result = await yahooFinance.quote(symbol);
    console.log(JSON.stringify(result, null, 2).slice(0, 500));
  } catch (error) {
    console.log('ERROR:', error.message);
  }
}

async function run() {
  await test('532174.BO');   // ICICI Bank
  await test('541557.BO');   // Fine Organic
  await test('544252.BO');   // Bajaj Housing
}

run();