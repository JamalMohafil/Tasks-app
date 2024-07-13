const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WQTIyI3gDR7pusOaPAIGJKzMZ9aUxcfsJQ&s",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    default: "offline",
  },
  lastFriendRequestSentAt: {
    type: Date,
    default: null,
  },
  isInChat: {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    res: { type: Boolean, default: false },
  },
  friendsRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "pending" },
    },
  ],
  workspacesRequests:[
    {
      workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, default: "pending" },
    }
  ],
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
  description:{
    type: String,
    default: "No description"
  },  
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // قائمة الحظر
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

userSchema.pre("save",async function (next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    next();
})

userSchema.methods.isBlocked = function (userId) {
  return this.blockList.includes(userId);
};

module.exports = mongoose.model("User", userSchema);
