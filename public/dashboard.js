import Chart from 'chart.js';

async function loadDashboard() {
  const response = await fetch('/api/userStats');
  const stats = await response.json();

  new Chart(document.getElementById('movesChart'), {
    type: 'line',
    data: {
      labels: stats.months,
      datasets: [{
        label: 'Total Moves',
        data: stats.totalMoves,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      }],
    },
  });
}

loadDashboard();