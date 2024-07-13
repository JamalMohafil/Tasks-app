const mongoose = require('mongoose'
)

const notificationSchema = new mongoose.Schema({
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // معرف المستخدم المستقبل
    title: { type: String, required: true }, // محتوى الرسالة
    content: { type: String, required: true }, // محتوى الرسالة
    seen: { type: Boolean, default: false },
    link:{type:String,default:''},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Notification", notificationSchema)