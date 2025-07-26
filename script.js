// ... (rest of the code remains the same)

function displayFinancialData(symbol, overviewData, financialMetrics) {
    document.getElementById('company-name').textContent = overviewData.Name || symbol;

    const tableHeader = document.getElementById('financial-table').querySelector('thead tr');
    const tableBody = document.getElementById('financial-table-body');

    // Create header row with metric names
    tableHeader.innerHTML = `
        <th>Year</th>
        ${financialMetrics.map(metric => `<th>${metric.year}</th>`).join('')}
    `;

    // Create rows for financial metrics
    const metrics = [
        { name: 'Revenue', values: financialMetrics.map(m => formatCurrency(m.revenue, true)) },
        { name: 'Net Income', values: financialMetrics.map(m => formatCurrency(m.netIncome, true)) },
        { name: 'Shares Outstanding', values: financialMetrics.map(m => formatNumber(m.sharesOutstanding)) },
        { name: 'Return on Equity', values: financialMetrics.map(m => m.roe.toFixed(2) + '%') },
        { name: 'Return on Capital', values: financialMetrics.map(m => m.roc.toFixed(2) + '%') },
        { name: 'Current Ratio', values: financialMetrics.map(m => m.currentRatio.toFixed(2)) },
        { name: 'Debt to Equity', values: financialMetrics.map(m => m.debtToEquity.toFixed(2)) }
    ];

    tableBody.innerHTML = '';
    metrics.forEach(metric => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric.name}</td>
            ${metric.values.map(value => `<td>${value}</td>`).join('')}
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('financial-data').style.display = 'block';
}

// ... (rest of the code remains the same)
