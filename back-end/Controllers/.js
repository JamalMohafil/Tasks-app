const expressAsyncHandler = require("express-async-handler");
const { Message, Chat } = require("../models/Messages");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");
const { notifyUser, notifyMessage, wss } = require("../index");
const imageUpload = require("../multer.config");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
exports.sendMessage = expressAsyncHandler(async (req, res) => {
  const { senderId, reciverId, content } = req.body; // معلومات الرسالة المرسلة
  const session = await Message.startSession();
  session.startTransaction();

  try {
    const chat = await Chat.findById(req.params.chatId);
    const ReciverUser = await User.findById(reciverId);

    if (!chat || !ReciverUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Chat or Receiver not found" });
    }

    let seen = false;
    if (
      ReciverUser.isInChat &&
      ReciverUser.isInChat.chatId &&
      ReciverUser.isInChat.chatId.toString() === req.params.chatId
    ) {
      await Message.updateMany(
        { chatId: req.params.chatId, "seen.user": { $ne: reciverId } },
        { $push: { seen: { user: reciverId, res: true } } },
        { session }
      );
      await Message.updateMany(
        { chatId: req.params.chatId, "seen.user": { $ne: senderId } },
        { $push: { seen: { user: senderId, res: true } } },
        { session }
      );

      seen = true;

      if (
        chat.unseenMessages &&
        chat.unseenMessages.user &&
        chat.unseenMessages.user === reciverId
      ) {
        chat.unseenMessages.count = 0;
      } else {
        chat.unseenMessages = { user: reciverId, count: 0 };
      }

      await chat.save({ session });
    } else {
      seen = false;

      const notification = new Notification({
        receiver: reciverId,
        link: "/chats/" + req.params.chatId,
        title: "Message Chats!",
        content: `${req.user.name} sent you a message`,
        seen: false,
        createdAt: new Date(),
      });
      await notification.save({ session });

      if (
        chat.unseenMessages &&
        chat.unseenMessages.user &&
        chat.unseenMessages.user === reciverId
      ) {
        chat.unseenMessages.count += 1;
      } else {
        chat.unseenMessages = {
          user: reciverId,
          count: chat.unseenMessages ? chat.unseenMessages.count + 1 : 1,
        };
      }

      await chat.save({ session });
    }

    let imagePath;
    if (req.file) {
      const { path: tempPath, filename } = req.file;
      const resizedImagePath = `uploads/resized-${filename}`;
      await sharp(tempPath).toFile(resizedImagePath);

      fs.unlink(tempPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting temp image:", err);
        }
      });

      imagePath = resizedImagePath;
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: reciverId,
      content: content,
      imageUrl: imagePath ? imagePath : "", // تعيين مسار الصورة إذا كانت موجودة
      chatId: req.params.chatId,
      seen: [{ user: senderId, res: true }],
    });

    if (seen) {
      newMessage.seen.push({ user: reciverId, res: true });
    }

    const blocked = ReciverUser.blockList.includes(senderId);
    const blocked2 = req.user.blockList.includes(reciverId);
    if (blocked || blocked2) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: blocked
          ? "You are blocked by this user"
          : "You blocked this user",
      });
    }

    const savedMessage = await newMessage.save({ session });
    chat.messages.push(savedMessage);
    await chat.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedMessage);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

exports.createChat = expressAsyncHandler(async (req, res) => {
  const { participants } = req.body;
  try {
    const existingChat = await Chat.findOne({
      participants: { $all: participants },
    });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        message: "Chat already exists between these users",
        chatId: existingChat._id,
      });
    }
    const chat = new Chat({
      participants: participants,
      messages: [],
    });
    const RevciverUser = await User.findById(participants[1].toString());

    const blocked = RevciverUser.blockList.includes(participants[0].toString());
    if (blocked) {
      return res.status(403).json({
        success: false,
        message: "You are blocked by this user",
      });
    }
    const savedChat = await chat.save();
    res
      .status(201)
      .json({ chat: savedChat, success: true, chatId: savedChat._id });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat", success: false });
  }
});
exports.deleteMessage = expressAsyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id; // افترض أن هذا هو معرف المستخدم

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized to delete this message",
        });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete message", error });
  }
});
exports.getUserChats = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userIdJwt = req.user._id;
  const limit = parseInt(req.query.limit) || 10;
  const userChat = await User.findById(userId);

  if (userId.toString() !== userIdJwt.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized to access this chat" });
  }

  try {
    const chats = await Chat.find({
      participants: { $in: [userId.toString()] },
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate("participants", "name image");

    const chatData = await Promise.all(
      chats.map(async (chat) => {
        // التحقق من وجود participants وأنها تحتوي على بيانات صحيحة
        if (!chat.participants || chat.participants.length === 0) {
          return null;
        }

        let friend = chat.participants.find(
          (participant) => participant._id.toString() !== userId
        );

        // التحقق من وجود friend وأنه يحتوي على حقل _id
        if (!friend || !friend._id) {
          return null;
        }

        // حفظ التعديلات على الدردشة
        await chat.save();

        const lastMessage =
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null;

        const lasMsg = lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
            }
          : null;

        const participants = chat.participants.map((participant) => ({
          id: participant._id,
          name: participant.name,
          image: participant.image,
        }));

        return {
          participants,
          lasMsg,
          unseenMessages: chat.unseenMessages,
          chatId: chat._id,
        };
      })
    );

    // تصفية القيم null من النتيجة النهائية
    const filteredChatData = chatData.filter((chat) => chat !== null);

    return res.status(200).json({ success: true, chats: filteredChatData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

exports.getMessages = expressAsyncHandler(async (req, res) => {
  const messages = await Message.find();

  return res.status(200).json({ success: true, messages });
});

exports.getChatsOne = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;
  const limit = req.query.limit || 10;

  // التحقق من أن chatId صالحة
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid chatId",
    });
  }

  try {
    // البحث عن الشات باستخدام chatId والتأكد من أن المستخدم جزء من المشاركين
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    }).populate("participants", "_id name email image blockList");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or user not authorized",
      });
    }

    const secondUser = chat.participants.find(
      (participant) => participant._id.toString() !== userId.toString()
    );
    const totalMessages = await Message.countDocuments({ chatId: chatId });

    const messagesFromChat = await Chat.findById(chatId);
    //  console.log(messagesFromChat)
    if (!messagesFromChat)
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    const messages = messagesFromChat.messages
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    // ترتيب الرسائل بترتيب زمني تصاعدي بعد جلبها
    messages.reverse();
    console.log(totalMessages);
    // التحقق من أن المستخدمين في نفس الشات باستخدام isInChat
    if (
      req.user.isInChat &&
      req.user.isInChat.chatId &&
      req.user.isInChat.chatId.toString() === chatId &&
      secondUser.isInChat &&
      secondUser.isInChat.chatId &&
      secondUser.isInChat.chatId.toString() === chatId
    ) {
      // جلب الرسائل المرتبطة بالشات بترتيب زمني تنازلي وتحديد العدد بواسطة limit

      // جمع معرفات الرسائل التي تحتاج إلى تحديث
      const messageIdsToUpdate = messages.map((message) => message._id);

      // بناء مصفوفة المشاركين ليتم إضافتها إلى حقل seen في كل رسالة
      const participantsToAdd = chat.participants.map((participant) => ({
        user: participant._id,
        res: true,
      }));

      // تحديث جميع الرسائل دفعة واحدة باستخدام عملية تحديث جماعية
      await Message.updateMany(
        { _id: { $in: messageIdsToUpdate }, "seen.user": { $ne: userId } }, // التأكد من أن المستخدم لم يتم إضافته مسبقًا
        { $addToSet: { seen: { $each: participantsToAdd } } }
      );

      return res
        .status(200)
        .json({ success: true, chat, messages, totalMessages: totalMessages });
    } else {
      return res.status(200).json({
        success: true,
        messages,
        chat,
        totalMessages: totalMessages,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

exports.deleteChat = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  try {
    // البحث عن الشات باستخدام chatId والتأكد من أن المستخدم جزء من المشاركين
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or user not authorized",
      });
    }

    // حذف الشات
    await Chat.findByIdAndDelete(chat._id);
    return res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});
exports.makeSeen = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user._id;

  // التحقق من أن chatId صالحة
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid chatId",
    });
  }

  try {
    // البحث عن الشات باستخدام chatId والتأكد من أن المستخدم جزء من المشاركين
    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or user not authorized",
      });
    }

    // تحديث الرسائل غير المقروءة وإضافة المستخدم إلى مصفوفة seen
    const messages = await Message.find({
      chatId: chatId,
      receiver: userId,
      "seen.user": { $ne: userId }, // لا يوجد مستخدم في مصفوفة seen
    });

    const updatePromises = messages.map((message) => {
      message.seen.push({ user: userId.toString(), res: true });
      return message.save();
    });

    await Promise.all(updatePromises);

    // تصفير عدد الرسائل غير المقروءة لهذا المستخدم
    if (
      chat.unseenMessages &&
      chat.unseenMessages.user &&
      chat.unseenMessages.user.toString() === userId.toString()
    ) {
      chat.unseenMessages.count = 0;
    }

    await chat.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.deleteAllMessagesFromDatabase = expressAsyncHandler(
  async (req, res) => {
    try {
      await Message.deleteMany();
      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  }
);
