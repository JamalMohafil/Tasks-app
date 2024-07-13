const mongoose = require("mongoose");

// تعريف Schema للرسائل
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // معرف المستخدم المرسل
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // معرف المستخدم المستقبل
  content: { type: String, required: true }, // محتوى الرسالة
  timestamp: { type: Date, default: Date.now }, // وقت إرسال الرسالة
  imageUrl: { type: String }, // رابط الصورة إذا كانت الرسالة تحتوي على صورة
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  seen: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      res: { type: Boolean, default: false },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
});



// تعريف Schema للمحادثات (Chat) أو الغرف (Room) إذا كان يدعم الشات الجماعي
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unseenMessages: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 0 },
    },

  messages: [{ type:mongoose.Schema.Types.ObjectId, ref:"Message"}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
messageSchema.index({ chatId: 1 });
chatSchema.index({ participants: 1 });
// تصدير النماذج
const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", chatSchema);

module.exports = {  Message, Chat };
