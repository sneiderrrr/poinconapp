import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsChart = ({ data }) => {
  // Préparation des données pour le graphique
  const chartData = {
    labels: ['Produits', 'Fournisseurs', 'Poinçons', 'Utilisateurs'],
    datasets: [
      {
        label: 'Total',
        data: data.total,  // Total des éléments
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Actifs',
        data: data.actifs,  // Actifs
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h3>Statistiques des Composants</h3>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default StatisticsChart;
