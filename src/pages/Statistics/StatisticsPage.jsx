import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Button, Text, Spinner, VStack, SimpleGrid, Card, CardBody, Icon
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { MdInventory, MdBusiness, MdPeople, MdSettings } from "react-icons/md";
import FournisseurStats from "./FournisseurStats";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatisticsPage = () => {
  const [stats, setStats] = useState({});
  const [produitsParMois, setProduitsParMois] = useState([]); // ✅ ligne manquante
  const [poinconsParForme, setPoinconsParForme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDonut, setShowDonut] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const [loginsByDayAndType, setLoginsByDayAndType] = useState([]);

  useEffect(() => {
    const fetchUserLogins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user-logins", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLoginsByDayAndType(res.data);
      } catch (err) {
        console.error("Erreur récupération des connexions utilisateurs", err);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/statistics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des statistiques.");
      }
    };

    const fetchFournisseurs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/fournisseurs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFournisseurs(response.data);
      } catch (err) {
        console.error("Erreur récupération fournisseurs", err);
      }
    };

    const fetchProduitsParMois = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/produits-par-mois", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduitsParMois(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des produits par mois.");
      }
    };

    const fetchPoinconsParForme = async (fournisseurId = "") => {
      try {
        const url = `http://localhost:5000/api/poincons-par-forme${fournisseurId ? `?fournisseur=${fournisseurId}` : ""}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPoinconsParForme(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des poinçons par forme.");
      }
    };

    fetchStats();
    fetchFournisseurs();
    fetchProduitsParMois();
    fetchPoinconsParForme();
    fetchUserLogins();
    setLoading(false);
  }, []);

  const handleFournisseurChange = (e) => {
    const selectedId = e.target.value;
    setSelectedFournisseur(selectedId);
    fetchPoinconsParForme(selectedId);
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  const produitsParMoisData = {
    labels: produitsParMois.map(item => `Mois ${item.month}`),
    datasets: [
      {
        label: 'Produits ajoutés',
        data: produitsParMois.map(item => item.count),
        backgroundColor: '#4F46E5',
      },
    ],
  };

  const otherStatsData = {
    labels: ['Produits', 'Fournisseurs', 'Poinçons', 'Utilisateurs'],
    datasets: [
      {
        label: 'Total',
        data: [
          stats.totalProduits,
          stats.totalFournisseurs,
          stats.totalPoincons,
          stats.totalUtilisateurs,
        ],
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Actifs',
        data: [
          stats.produitsActifs,
          stats.fournisseursActifs,
          stats.poinconsActifs,
          stats.utilisateursActifs,
        ],
        backgroundColor: '#22C55E',
      },
    ],
  };

  const poinconsFormeData = {
    labels: poinconsParForme.map(item => item.forme),
    datasets: [
      {
        label: "Nombre de poinçons",
        data: poinconsParForme.map(item => item.count),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#27AE60", "#E67E22", "#3498DB"
        ]
      }
    ]
  };

  const poinconsDonutData = {
    labels: poinconsParForme.map(item => item.forme || "Inconnu"),
    datasets: [
      {
        label: "Nombre de poinçons",
        data: poinconsParForme.map(item => item.count || 0),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#27AE60", "#E67E22", "#3498DB", "#95A5A6"
        ],
        borderWidth: 1
      }
    ]
  };

  const grouped = {};
  const datesSet = new Set();

 loginsByDayAndType.forEach(item => {
  const date = item._id.date;
  const type = item._id.type || "Autre"; // <--- fallback ici

  datesSet.add(date);
  if (!grouped[type]) grouped[type] = {};
  grouped[type][date] = item.count;
});


  const dates = [...datesSet].sort();
  const userTypes = Object.keys(grouped);

  const chartData = {
    labels: dates,
    datasets: userTypes.map((type, i) => ({
      label: type,
      data: dates.map(date => grouped[type][date] || 0),
      backgroundColor: ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"][i % 4],
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Connexions par jour et par type d’utilisateur" },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box p={6} maxW="1200px" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Statistiques Globales</Text>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
          <Card><CardBody><Icon as={MdInventory} boxSize={8} color="blue.500" /><Text fontWeight="bold">Produits</Text><Text>Total: {stats.totalProduits}</Text><Text>Actifs: {stats.produitsActifs}</Text></CardBody></Card>
          <Card><CardBody><Icon as={MdBusiness} boxSize={8} color="green.500" /><Text fontWeight="bold">Fournisseurs</Text><Text>Total: {stats.totalFournisseurs}</Text><Text>Actifs: {stats.fournisseursActifs}</Text></CardBody></Card>
          <Card><CardBody><Icon as={MdSettings} boxSize={8} color="orange.500" /><Text fontWeight="bold">Poinçons</Text><Text>Total: {stats.totalPoincons}</Text><Text>Actifs: {stats.poinconsActifs}</Text></CardBody></Card>
          <Card><CardBody><Icon as={MdPeople} boxSize={8} color="purple.500" /><Text fontWeight="bold">Utilisateurs</Text><Text>Total: {stats.totalUtilisateurs}</Text><Text>Actifs: {stats.utilisateursActifs}</Text></CardBody></Card>
        </SimpleGrid>

        <Box mt={6}><Text fontSize="xl" fontWeight="bold">📦 Produits ajoutés par mois</Text><Bar data={produitsParMoisData} /></Box>

        <Box mt={6}><Text fontSize="xl" fontWeight="bold">📊 Statistiques des Composants</Text><Bar data={otherStatsData} /></Box>

        <Box mb={4}>
          <Text fontSize="md" fontWeight="bold" mb={2}>Filtrer par fournisseur</Text>
          <select value={selectedFournisseur} onChange={handleFournisseurChange}>
            <option value="">Tous les fournisseurs</option>
            {fournisseurs.map(f => <option key={f._id} value={f._id}>{f.nom}</option>)}
          </select>
        </Box>

       <Box mt={6}>
  <Text fontSize="xl" fontWeight="bold">🔩 Répartition des poinçons par forme</Text>
  <Button size="sm" colorScheme="blue" onClick={() => setShowDonut(!showDonut)} mb={4}>
    {showDonut ? "Afficher en barres" : "Afficher en camembert"}
  </Button>

  {showDonut ? (
    <Box maxW="400px" mx="auto"> {/* ✅ Taille du donut réduite et centrée */}
      <Doughnut data={poinconsDonutData} />
    </Box>
  ) : (
    <Bar data={poinconsFormeData} />
  )}
</Box>


        <Box mt={6}><FournisseurStats /></Box>

        <Box mt={10}>
          <Text fontSize="xl" fontWeight="bold">📈 Connexions des utilisateurs par jour</Text>
          <Text fontSize="sm" color="gray.500" mb={4}>Nombre de connexions groupées par type d'utilisateur</Text>
          <Bar data={chartData} options={chartOptions} />
        </Box>

        <Button colorScheme="teal" mt={4} onClick={() => window.location.reload()}>
          Actualiser les statistiques
        </Button>
      </Box>
    </motion.div>
  );
};

export default StatisticsPage;
