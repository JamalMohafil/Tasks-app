// userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require('jsonwebtoken')
const imageUpload = require("../multer.config");
const sharp = require('sharp')
const bcrypt = require('bcrypt')
    const Notification = require("../models/Notification");
const {notifyUser} = require("../index");
const mongoose = require('mongoose')
const fs = require('fs');
const Workspace = require("../models/Workspace");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the requester is either the user themselves or an admin
    if (req.user.role === "admin" || req.user._id.toString() === userId) {
      res.json(user);
    } else {
      res.status(403).json({ message: "Unauthorized to view this user" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = asyncHandler(async (req, res) => {
  let imagePath;
  
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (req.file) {
    const { path: tempPath, filename } = req.file;
    const resizedImagePath = `uploads/resized-${filename}`;

    try {
      await sharp(tempPath)
        .resize({ width: 300, height: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedImagePath);

      imagePath = resizedImagePath;

      fs.unlink(tempPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting temp image:", err);
        }
      });
    } catch (error) {
      console.error("Error resizing image:", error);
      return res.status(500).json({ error: "Failed to process image" });
    }
  }

  const userToUpdate = await User.findById(req.params.id);
  // Check if the user exists
  if (!userToUpdate) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the current user is the owner of the account or an admin
  if (decoded.userId !== userToUpdate.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized to update this user" });
  }

  // Check if the current user is not an admin and is trying to update the role to admin
  if (req.body.role !== "user" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Unauthorized to update user role to admin" });
  }
  if (req.body.password && req.body.newPassword) {
    try {
      const isMatch = await bcrypt.compare(
        req.body.password,
        userToUpdate.password
      );

      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

     
      userToUpdate.password = req.body.newPassword || userToUpdate.password;

    } catch (error) {
      console.error("Error comparing or hashing password:", error);
      return res.status(500).json({ error: "Failed to update password" });
    }
  }
  // Update user document
  userToUpdate.name = req.body.name || userToUpdate.name;
  userToUpdate.email = req.body.email || userToUpdate.email;
  userToUpdate.image = imagePath || userToUpdate.image;
  userToUpdate.description = req.body.description || userToUpdate.description
  // Check if there's a new password provided


  userToUpdate.role = req.body.role || userToUpdate.role;

  // Save the updated user document
  const updatedUser = await userToUpdate.save();

  res.status(200).json({ success: true, data: updatedUser });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  // Ensure only admin can delete users


  // Find the user to delete
  const userToDelete = await User.findById(req.params.id);

  if (!userToDelete) {
    return res.status(404).json({ message: "User not found" });
  }

  // Perform the delete operation
  await User.findByIdAndDelete(req.params.id);

  // Respond with success message
  res.status(200).json({ message: "User deleted successfully" });
});

exports.getMe = asyncHandler(async (req, res) => {
  // 1. استخراج التوكن من رأس الطلب
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "لا توجد تفاصيل للتأكيد." });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // يجب تعيين JWT_SECRET بقيمة سرية خاصة بك
  try {
    // 2. فك التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // يجب تعيين JWT_SECRET بقيمة سرية خاصة بك

    // 3. استخراج الايدي من البيانات المفككة
    const userId = decoded.userId;
    // 4. البحث عن الايدي في قاعدة البيانات أو المخزن
    const user = await User.findById(userId); // افترض أن User هو موديل المستخدم الخاص بك

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "المستخدم غير موجود." });
    }

    // إذا كان الايدي موجود، يمكنك إعادة true
    res.status(200).json({ success: true, data: user.name });
  } catch (error) {
    console.error("خطأ في فك التوكن:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

exports.sendFriend = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const friend = await User.findOne({ email: req.params.id });
    if (!friend) {
      return res
        .status(404)
        .json({ success: false, message: "Friend not found" });
    }
    if(friend._id.toString() === user._id.toString()){
      return res.status(400).json({ success: false, message: "You can't add yourself as a friend" });
    }
    console.log(friend._id)
    console.log(user._id)

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already in your friends list",
      });
    }

    if (friend.isBlocked(req.user._id)) {
      return res
        .status(400)
        .json({ success: false, message: "You are blocked by this user" });
    }

    if (
      user.friendsRequests.some(
        (reques) => reques.user.toString() === friend._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent" });
    }

    if (
      friend.friendsRequests.some(
        (reques) => reques.user.toString() === req.user._id.toString()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request from this user",
      });
    }

    friend.friendsRequests.push({ user: req.user._id });
    const notification = new Notification({
      receiver: friend._id,
      link: "/friends",
      title: "New Friend Request",
      content: `${user.name} sent you a friend request.`,
      seen: false,
      createdAt: new Date(),
    });

    await notification.save();
    await user.save();
    await friend.save();

 
    res
      .status(200)
      .json({ success: true, message: "Friend request sent successfully" });
         notifyUser(friend._id, {
           type: "FRIEND_REQUEST",
           sender: user.name,
         });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" ,error:error});
  }
});


exports.respondToFriendRequest = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const requestIndex = user.friendsRequests.findIndex(
      (reqe) =>
        reqe.user.toString() === req.params.id && reqe.status === "pending"
    );

    if (requestIndex === -1) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Friend request not found or already responded to",
        });
    }

    if (req.body.response === "accept") {
      const friend = await User.findById(req.params.id);
      if (!friend) {
        return res
          .status(404)
          .json({ success: false, message: "Friend not found" });
      }

      user.friends.push(req.params.id);
      friend.friends.push(req.user._id);
      const notification = new Notification({
        receiver: req.params.id,
        link: "/chats",
        title: "Friend Request Accepted",
        content: `${friend.name} accepted your friend request.`,
        seen: false,
        createdAt: new Date(),
      });
  
     user.friendsRequests.splice(requestIndex, 1);
      await notification.save()
      await user.save();
      await friend.save();

      res
        .status(200)
        .json({ success: true,rejected:false, message: "Friend request accepted" });
    } else if (req.body.response === "reject") {
     user.friendsRequests.splice(requestIndex, 1);
      await user.save();
      res
        .status(200)
        .json({ success: true,rejected:true, message: "Friend request rejected" });
    } else {
      res.status(400).json({ success: false, message: "Invalid response" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
exports.getFriendRequests = asyncHandler(async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to get friend requests",
      });
    }

    const user = await User.findById(req.user._id).populate({
      path: "friendsRequests.user",
      select: "name email image _id",
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      // استخدام كائن لتعقب طلبات الصداقة
      const seenRequests = {};

      // مصفوفة جديدة لتخزين الطلبات الفريدة
      const uniqueFriendRequests = [];

      user.friendsRequests.forEach((request) => {
        const userId = request.user._id.toString();
        if (!seenRequests[userId]) {
          seenRequests[userId] = true;
          uniqueFriendRequests.push({
            user: {
              _id: request.user._id,
              name: request.user.name,
              email: request.user.email,
              image: request.user.image,
            },
            status: request.status,
            createdAt: request.createdAt,
          });
        }
      });

      res
        .status(200)
        .json({ success: true, friendRequests: uniqueFriendRequests });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

exports.searchFriends = asyncHandler(async (req, res) => {
  try {
    // Extract user ID from token

 
    // Search in friends' information based on the provided query
    const searchTerm = req.params.searchTerm;
    const friendsIds = req.user.friends; // Assuming friends is an array of IDs

    // Query to find users matching the search term among the user's friends
    const users = await User.find({
      $and: [
        { _id: { $in: friendsIds } }, // Only search among the user's friends
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            // Add more fields as needed for search
          ],
        },
      ],
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

exports.setStatus = asyncHandler( async (req, res) => {
  const userId  = req.params.id;

  const { status } = req.body;
  if(userId !== req.user._id.toString()){
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!["online", "offline"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

exports.setChatId = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { chatId } = req.body;
  
  if (userId !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(req.body.chatId)
  try {
    // if(req.user.isInChat.res === false || chatId === 'no-id'){
    //   return res.status(200).json({ message: "ChatId removed" });
    // }
    if(req.user.isInChat && req.user.isInChat.chatId === chatId){
      return res.status(200).json({ message: "ChatId already set" });
    }
    const update =
      chatId === "no-id"
        ? { isInChat: { res: false } }
        : { isInChat: { res: true, chatId: chatId } };

    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const message = chatId === "no-id" ? "ChatId removed" : "ChatId updated";
    res.status(200).json({ message, user });
  } catch (error) {
    console.error("Error updating chatId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
exports.blockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { block, blockerId } = req.body;

  if (userId !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!["true", "false"].includes(block)) {
    return res.status(400).json({ error: "Invalid block status" });
  }
  try {
    const user = await User.findById(userId);
    const blocker = await User.findById(blockerId);

    if (!user || !blocker) {
      return res.status(404).json({ error: "User not found" });
    }

    if (block === "true") {
      if (!user.blockList.includes(blockerId)) {
        user.blockList.push(blockerId);
      }
      user.friends = user.friends.filter((id) => id.toString() !== blockerId);
      blocker.friends = blocker.friends.filter(
        (id) => id.toString() !== userId
      );
    } else if (block === "false") {
      user.blockList = user.blockList.filter(
        (id) => id.toString() !== blockerId
      );
    }

    await user.save();
    await blocker.save();

    res.status(200).json({ message: "Block status updated" });
  } catch (error) {
    console.error("Error updating block status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.getFriends = asyncHandler(async (req,res)=>{
  const userId  = req.user._id;

  if(!userId){
    return res.status(401).json({ error: "Unauthorized" });
  }
  try{
    const user = await User.findById(userId).populate('friends')
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Friends fetched", friends: user.friends });
  }catch(error){
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})


exports.getFriend = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const objectId = new mongoose.Types.ObjectId(userId);

  // اطبع قائمة الأصدقاء للتحقق من البيانات
  console.log(req.user.friends);

  // تحقق من وجود معرف المستخدم في قائمة الأصدقاء
  if (!req.user.friends.some((friendId) => friendId.equals(objectId))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {

    console.log(objectId)
    const friend = await User.findById(objectId).select('name email image role friends')
    console.log(friend);

    if (!friend) {
      return res
        .status(404)
        .json({ error: "Friend not found in user's friend list" });
    }
    console.log()

    // قم بإنشاء كائن جديد يحتوي على البيانات التي تريد إرجاعها فقط
  
    res.status(200).json({ message: "Friend fetched", friend: friend });
  } catch (error) {
    console.error("Error fetching friend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
exports.removeFriend = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friendId = req.params.id;
  const objectId = new mongoose.Types.ObjectId(friendId);
  if (!req.user.friends.some((friendId) => friendId.equals(objectId))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({ message: "User not found" ,success:false});
    }
    if (!friend) {
      return res.status(404).json({ message: "User not found" ,success:false});
    }
    friend.friends = friend.friends.filter((friendId) => !friendId.equals(userId));
    user.friends = user.friends.filter((friendId) => !friendId.equals(objectId));
    await friend.save();  
    await user.save();
    res.status(200).json({ message: "Friend removed" ,success:true});
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Internal server error" ,success:false});
  }
})
exports.getFriendDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select(
      "name email image role blockList friends description"
    ).populate('friends')
    const workspace = await Workspace.find({admins:userId}).select("name  description image _id")
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User details fetched", user: user,success:true,workspaces:workspace });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error",success:false });
  }
})