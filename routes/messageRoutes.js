const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByRoomId,
} = require("../controllers/messageController");

// POST: envoyer un message
router.post("/", sendMessage);

// GET: récupérer les messages d'une room
router.get("/room/:roomId", getMessagesByRoomId);

module.exports = router;
