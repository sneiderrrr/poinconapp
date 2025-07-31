// src/components/Statistics/FournisseurStats.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FournisseurStats = () => {
  const [fournisseursParPays, setFournisseursParPays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchFournisseursParPays = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fournisseurs-par-pays", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFournisseursParPays(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des fournisseurs par pays.");
    } finally {
      setLoading(false);
    }
  };
  fetchFournisseursParPays();
}, []);


  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  // Préparer les données pour le graphique
  const chartData = {
    labels: fournisseursParPays.map(item => item._id),  // Pays
    datasets: [
      {
        label: 'Fournisseurs par pays',
        data: fournisseursParPays.map(item => item.count),  // Nombre de fournisseurs
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Couleur des barres
      },
    ],
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Statistiques des Fournisseurs par Pays
      </Text>
      <Bar data={chartData} options={{ responsive: true }} />
    </Box>
  );
};

export default FournisseurStats;
