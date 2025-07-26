function displayFinancialData(symbol, overviewData, financialMetrics) {
    document.getElementById('company-name').textContent = overviewData.Name || symbol;

    const table = document.getElementById('financial-table');
    const tableHead = table.querySelector('thead tr');
    const tableBody = document.getElementById('financial-table-body');

    // Create header row with years
    tableHead.innerHTML = '';
    financialMetrics.forEach(metric => {
        const th = document.createElement('th');
        th.textContent = metric.year;
        tableHead.appendChild(th);
    });

    // Create rows for financial metrics
    const metrics = ['Revenue', 'Net Income', 'Shares Outstanding', 'Return on Equity', 'Return on Capital', 'Current Ratio', 'Debt to Equity'];
    const values = [
        financialMetrics.map(m => formatCurrency(m.revenue, true)),
        financialMetrics.map(m => formatCurrency(m.netIncome, true)),
        financialMetrics.map(m => formatNumber(m.sharesOutstanding)),
        financialMetrics.map(m => m.roe.toFixed(2) + '%'),
        financialMetrics.map(m => m.roc.toFixed(2) + '%'),
        financialMetrics.map(m => m.currentRatio.toFixed(2)),
        financialMetrics.map(m => m.debtToEquity.toFixed(2))
    ];

    tableBody.innerHTML = '';
    metrics.forEach((metric, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th>${metric}</th>
            ${values[index].map(value => `<td>${value}</td>`).join('')}
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('financial-data').style.display = 'block';
}

function formatCurrency(num, short = false) {
    if (short) {
        if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
        if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
