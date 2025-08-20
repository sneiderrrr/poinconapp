const express = require('express');
const http = require("http");
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { Server } = require("socket.io");
const path = require('path');  // <-- Ajoute cette ligne

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'app
const app = express();
const server = http.createServer(app); // 👈 important pour socket.io

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Routes de l'API REST
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const fournisseurRoutes = require('./routes/fournisseurRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes');
const messageRoutes = require('./routes/messageRoutes');
const poinconRoutes = require('./routes/poinconRoutes');
const marqueRoutes = require('./routes/marqueRoutes');
const formeRoutes = require('./routes/formeRoutes');
const produitRoutes = require('./routes/produitRoutes');
const etatPoinconRoutes = require('./routes/etatPoinconRoutes');
const auditTrailRoutes = require('./routes/auditTrailRoutes'); 
const compromeuseRoutes = require('./routes/compromeuseRoutes'); 
const entretienRoutes = require('./routes/entretienRoutes'); 
const utilisationRoutes = require('./routes/utilisationRoutes');
const detailPoinconRoutes = require("./routes/detailPoinconRoutes");

// Enregistrer toutes les routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/poincons', poinconRoutes);
app.use('/api/marques', marqueRoutes);
app.use('/api/formes', formeRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/etatPoincons', etatPoinconRoutes);
app.use('/api/audit-trail', auditTrailRoutes); 
app.use('/api/compromeuses', compromeuseRoutes); 
app.use('/api/entretiens', entretienRoutes); 
app.use('/api/utilisations', utilisationRoutes);
app.use("/api/detailPoincon", detailPoinconRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 💬 Socket.IO
io.on("connection", (socket) => {
  console.log("🔌 Utilisateur connecté:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`➡️ Socket ${socket.id} a rejoint la room: ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    const { roomId, content, from, to, timestamp } = data;
    // Diffuse le message à tous les autres dans la room
    socket.to(roomId).emit("receiveMessage", {
      roomId,
      content,
      from,
      to,
      timestamp
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Utilisateur déconnecté:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🟢 Serveur démarré sur http://localhost:${PORT}`);
});
