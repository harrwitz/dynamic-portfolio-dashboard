const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = xlsx.readFile(path.join(__dirname, '../data/portfolio.xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rawRows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });

const headers = rawRows[1];
const dataRows = rawRows.slice(2);

const rows = dataRows.map(rowArray => {
  const obj = {};
  headers.forEach((header, i) => {
    obj[header] = rowArray[i];
  });
  return obj;
});

const stocks = [];
let currentSector = null;
for(const row of rows) {
    const particulars = row['Particulars'];
    const qty = row['Qty'];
    const purchasePrice = row['Purchase Price'];
    const nseBse = row['NSE/BSE'];
    const soldPrice = row['Sale price'];
    if (!particulars) continue;
    const isSectorHeader = (qty === null || qty === undefined) && (purchasePrice === null || purchasePrice === undefined);
    if (isSectorHeader) {
        currentSector = particulars.trim();
        continue;
    }
    if (soldPrice != null || soldPrice != undefined) continue;
    if (!currentSector || qty === null || purchasePrice === null) continue;
    stocks.push({
        sector: currentSector.trim(),
        name: particulars.trim(),
        quantity: Number(qty),
        purchasePrice: Number(purchasePrice),
        exchange: nseBse ? String(nseBse) : null
    });
}
fs.writeFileSync(path.join(__dirname, '../data/seed.json'), JSON.stringify(stocks, null, 2));
console.log(`Wrote ${stocks.length} stocks to seed.json`);