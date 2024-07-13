const express = require("express");
const router = express.Router();
const { isAdmin, auth } = require("../middleware");
const { getAllUsers, getUserById, deleteUser, getMe, updateUser, respondToFriendRequest, sendFriend,
     getFriendRequests, 
     searchFriends,
     setStatus,
     setChatId,
     blockUser,
     getFriends,
     getFriend,
     searchFriends2,
     removeFriend,
     getFriendDetails,
     } = require("../Controllers/userController");
const { signup, login, checkOn } = require("../Controllers/authController");
const imageUpload = require("../multer.config");
// Routes for user management
router.get("/", auth, isAdmin, getAllUsers);  // Get All Users (only accessible to admins)
router.get("/:id",auth, getUserById); // Get a single user (accessible to the user themselves or admins)
router.post("/getMe",auth, getMe); // Get a single user (accessible to the user themselves or admins)
router.put("/:id", auth, imageUpload.single("image"), updateUser);
router.delete("/:id", auth,isAdmin, deleteUser);
// Routes for authentication
router.post("/signup",imageUpload.single('image'), signup);
router.post("/login", login);

router.post("/sendFriend/:id", auth, sendFriend);
router.get("/getFriendRequests/:id", auth, getFriendRequests);
router.post("/respondToFriendRequest/:id", auth, respondToFriendRequest);
router.put("/:id/status",auth,setStatus)
router.post('/searchFriends/:searchTerm', auth,searchFriends)
router.put('/setChatId/:id',auth,setChatId)
router.post('/checkOn',auth,checkOn)
router.get("/friends/getAll",auth,getFriends)
router.get("/friends/:id",auth,getFriend)
router.get("/getUser/:id", getFriendDetails);
router.put('/block/:id',auth,blockUser)
router.delete("/deleteFriend/:id", auth, removeFriend);
module.exports = router;
