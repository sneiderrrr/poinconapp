const Message = require("../models/Message");

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, from, to, content } = req.body;

    console.log("➡️ Message reçu :", req.body); // Debug

    if (!roomId || !from || !to || !content) {
      return res.status(400).json({ success: false, error: "Champs manquants" });
    }

    const message = new Message({
      roomId,
      from,
      to,
      content,
      timestamp: new Date(),
    });

    const saved = await message.save();

    res.status(201).json({ success: true, message: saved });
  } catch (err) {
    console.error("❌ Erreur sendMessage:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Récupérer les messages d'une room
exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error("❌ Erreur getMessagesByRoomId:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
