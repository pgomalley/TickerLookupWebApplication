document.querySelector('#back-button').style.display = 'none';

function shiftTimestamp(timestamp) {
    let date = new Date(timestamp);
    date.setHours(date.getHours() - 1);
    return date;
}

const tickerInput = document.querySelector('#ticker-input');
tickerInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
    this.value = this.value.replace(/[^A-Z]/g, '');
    if (this.value.length > 4) {
        this.value = this.value.substr(0, 4);
    }
});

tickerInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
        fetchData();
    }
});

async function fetchData() {
    try {
        displaySpinner(true);
        const tickerInput = document.querySelector('#ticker-input');
        const ticker = tickerInput.value;
        const response = await fetch(`http://localhost:5500/get_data?ticker=${ticker}`);
        if (!response.ok) { 
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const hourlyData = data.hourlyData;

        const totalHigh = Math.max(...data.dailyData.map(item => item.high));
        const totalLow = Math.min(...data.dailyData.map(item => item.low));
        const averagePrice = (data.dailyData.reduce((acc, item) => acc + item.close, 0) / data.dailyData.length).toFixed(2);
        const totalVolume = data.dailyData.reduce((acc, item) => acc + item.volume, 0);

        document.querySelector("#about").style.display = "none";
        document.querySelector("#data-overview").style.display = "none";
        document.querySelector("#data-source").style.display = "none";
        document.querySelector('#back-button').style.display = 'block';

        document.querySelector("#total-data-date").textContent = `Total Data from ${new Date(data.dailyData[0].date).toLocaleDateString()} to ${new Date(data.dailyData[data.dailyData.length - 1].date).toLocaleDateString()}`;
        document.querySelector("#total-data-values").innerHTML = `
            <p>High: ${totalHigh}</p>
            <p>Low: ${totalLow}</p>
            <p>Average: ${averagePrice}</p>
            <p>Volume: ${totalVolume}</p>
        `;

        const ctxTotal = document.querySelector('#total-data-chart').getContext('2d');
        new Chart(ctxTotal, {
            type: 'line',
            data: {
                labels: data.dailyData.map(item => new Date(item.date).toLocaleDateString()),
                datasets: [{
                    label: ticker,
                    data: data.dailyData.map(item => parseFloat(item.close)),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },

            options: {
                responsive: true,
                title: {
                    display: true,
                    text: `Total Stock Prices for ${ticker}`
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        const container = document.querySelector('#data-and-charts-container');
        const groupedHourlyData = groupBy(hourlyData, 'date');

        Object.entries(groupedHourlyData).forEach(([date, dayData], index) => {
            const dayContainer = document.createElement('div');
            dayContainer.className = 'day-container';
            dayContainer.innerHTML = generateDataHTML(dayData[0]); 
        
            const canvas = document.createElement('canvas');
            canvas.id = `chart-${index}`;
            dayContainer.appendChild(canvas);
        
            container.appendChild(dayContainer);
        
            try {
                const timestamps = dayData.map(item => {
                    const timestampDate = new Date(item.timestamp);
                    if (isNaN(timestampDate.getTime())) {
                        throw new Error(`Invalid timestamp: ${item.timestamp}`);
                    }
                    return timestampDate.toLocaleTimeString();
                }).reverse(); 
            
                const closePrices = dayData.map(item => {
                    if (isNaN(item.close)) {
                        throw new Error(`Invalid close price: ${item.close}`);
                    }
                    return parseFloat(item.close);
                }).reverse(); 
            
                const ctx = document.querySelector(`#chart-${index}`).getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timestamps,
                        datasets: [{
                            label: ticker,
                            data: closePrices,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    

                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: `Hourly Stock Prices for ${ticker} on ${date}`
                        },
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    },
                    
                });

            } catch (error) {
                console.error("Error creating chart:", error);
            }
            
        });    

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        displaySpinner(false);
    }
}

function groupBy(array, key) {
    return array.reduce((result, currentItem) => {
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        return result;
    }, {});
}

function displaySpinner(show) {
    const spinner = document.querySelector('#spinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function generateDataHTML(dayData) {
    return `
        <h2 class="finance-date">${new Date(dayData.date).toLocaleDateString()}</h2>
        <div class="finance-data">
            <p>Open: ${dayData.open}</p>
            <p>High: ${dayData.high}</p>
            <p>Low: ${dayData.low}</p>
            <p>Close: ${dayData.close}</p>
            <p>Volume: ${dayData.volume}</p>
        </div>
    `;
}

document.querySelector('#back-button').addEventListener('click', function() {
    document.querySelector("#about").style.display = "block";
    document.querySelector("#data-overview").style.display = "block";
    document.querySelector("#data-source").style.display = "block";
    this.style.display = 'none';

    document.querySelector('#ticker-input').value = '';

    let totalDataContainer = document.querySelector('.total-data-container');
    totalDataContainer.innerHTML = '<h2 class="finance-date" id="total-data-date"></h2><div class="finance-data" id="total-data-values"></div><canvas id="total-data-chart"></canvas>';

    document.querySelector('#data-and-charts-container').innerHTML = '';

    this.style.display = 'none';
});

function showContent() {
    document.querySelector('#content').style.display = 'block';
    document.querySelector('#spinner').style.display = 'none';
}

function hideContent() {
    document.querySelector('#content').style.display = 'none';
    document.querySelector('#spinner').style.display = 'flex';
}
