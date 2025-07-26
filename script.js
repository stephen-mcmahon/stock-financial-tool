const API_KEY = 'BH5QY6K3JQKBEMT7';
const PROXY_URL = 'https://corsproxy.io/?';
const BASE_URL = 'https://www.alphavantage.co/query';

document.getElementById('stock-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('stock-symbol').value.trim().toUpperCase();
    if (symbol) {
        await fetchFinancialData(symbol);
    }
});

async function fetchFinancialData(symbol) {
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        document.getElementById('financial-data').style.display = 'none';

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const incomeResponse = await fetch(`${PROXY_URL}${encodeURIComponent(`${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`)}`);
        const incomeData = await incomeResponse.json();

        await delay(13000);

        const balanceResponse = await fetch(`${PROXY_URL}${encodeURIComponent(`${BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`)}`);
        const balanceData = await balanceResponse.json();

        await delay(13000);

        const overviewResponse = await fetch(`${PROXY_URL}${encodeURIComponent(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`)}`);
        const overviewData = await overviewResponse.json();

        processFinancialData(symbol, incomeData, balanceData, overviewData);
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('error').style.display = 'block';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function processFinancialData(symbol, incomeData, balanceData, overviewData) {
    const annualReports = incomeData.annualReports || [];
    const balanceReports = balanceData.annualReports || [];

    if (annualReports.length === 0) {
        document.getElementById('error').textContent = 'No financial data available for this symbol.';
        document.getElementById('error').style.display = 'block';
        return;
    }

    const financialMetrics = [];
    const maxYears = Math.min(20, annualReports.length);

    for (let i = 0; i < maxYears; i++) {
        const incomeReport = annualReports[i];
        const balanceReport = balanceReports.find(b => b.fiscalDateEnding === incomeReport.fiscalDateEnding) || {};

        const revenue = parseFloat(incomeReport.totalRevenue) || 0;
        const netIncome = parseFloat(incomeReport.netIncome) || 0;
        const sharesOutstanding = parseFloat(incomeReport.commonStockSharesOutstanding) || parseFloat(balanceReport.commonStockSharesOutstanding) || 0;

        const totalEquity = parseFloat(balanceReport.totalShareholderEquity) || 0;
        const totalAssets = parseFloat(balanceReport.totalAssets) || 0;
        const totalLiabilities = parseFloat(balanceReport.totalLiabilities) || 0;
        const currentAssets = parseFloat(balanceReport.totalCurrentAssets) || 0;
        const currentLiabilities = parseFloat(balanceReport.totalCurrentLiabilities) || 0;

        const roe = totalEquity > 0 ? (netIncome / totalEquity * 100) : 0;
        const roc = totalAssets > 0 ? (netIncome / totalAssets * 100) : 0;
        const currentRatio = currentLiabilities > 0 ? (currentAssets / currentLiabilities) : 0;
        const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity) : 0;

        financialMetrics.push({
            year: incomeReport.fiscalDateEnding.substring(0, 4),
            revenue,
            netIncome,
            sharesOutstanding,
            roe,
            roc,
            currentRatio,
            debtToEquity
        });
    }

    displayFinancialData(symbol, overviewData, financialMetrics);
}

function displayFinancialData(symbol, overviewData, financialMetrics) {
    document.getElementById('company-name').textContent = overviewData.Name || symbol;

    const tableBody = document.getElementById('financial-table-body');
    tableBody.innerHTML = '';

    financialMetrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.year}</td>
            <td>${metric.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>${metric.netIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>${metric.sharesOutstanding.toLocaleString()}</td>
            <td>${metric.roe.toFixed(2)}%</td>
            <td>${metric.roc.toFixed(2)}%</td>
            <td>${metric.currentRatio.toFixed(2)}</td>
            <td>${metric.debtToEquity.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('financial-data').style.display = 'block';
}
