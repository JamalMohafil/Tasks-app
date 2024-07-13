const express = require("express");
const { auth, checkBlocked, isAdmin } = require("../middleware");
const {
  sendMessage,
  createChat,
  deleteMessage,
  getUserChats,
  getChatsOne,
  deleteChat,
  makeSeen,
  deleteAllMessagesFromDatabase,
  getMessages,
} = require("../Controllers/messagesController");
const imageUpload = require("../multer.config");

const router = express.Router();

// POST /chat/:id - يرسل رسالة إلى المحادثة المحددة بواسطة معرف الـ ID
router.post("/:chatId", auth,checkBlocked,imageUpload.single('imageUrl'), sendMessage);
router.post("/", auth, createChat);
router.delete("/:chatId/:messageId",auth,deleteMessage)
router.get("/chats/:userId", auth, getUserChats);
router.delete('/:chatId',auth,deleteChat)
router.get("/:chatId", auth, getChatsOne);
router.get("/", getMessages);
router.post("/makeSeen/:id",auth,makeSeen)
router.delete("/",auth,isAdmin,deleteAllMessagesFromDatabase)
module.exports = router;
