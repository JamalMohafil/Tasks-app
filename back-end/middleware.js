const jwt = require("jsonwebtoken");
const User = require("./models/User");
const asyncHandler = require("express-async-handler");
const { Chat } = require("./models/Messages");

const isAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Only admins can do that" });
    }
  } else {
    res.status(403).json({ message: "Only admins can do that" });
  }
};

const auth = asyncHandler(async (req, res, next) => {
  // 1- Get the token and check if exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.json({ message: "You are not logged in" }); 
    next()
  }
  // 2- Verify the token (check if the token changes the payload or the token is expired)
  // two errors maybe happens : 1- invalid token 2- expired token
  // convert a method that returns responses using a callback function to return a responses in a promise object
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3- Check the user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
      return res.status(404).json({
        message: "The user that belong to this token does no longer exist",
      });
  }
  // Grant access to the protected routes
  req.user = currentUser;
  next();
});
//Setup WebSocket server

const checkBlocked = async (req, res, next) => {
  const { chatId } = req.params;
  const userId = req.user._id;
  try {
    // العثور على الشات
    const chat = await Chat.findById(chatId).populate(
      "participants",
      "blockList"
    );

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // التحقق مما إذا كان المستخدم محظورًا من قبل أي مشارك
    const blocked = chat.participants.some((participant) =>
      participant.blockList.includes(userId)
    );

    if (blocked) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are blocked by this user",
        });
    }

    // إذا لم يكن محظورًا، تابع إلى الـ middleware أو الـ route التالي
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
module.exports = { isAdmin, auth, checkBlocked };
