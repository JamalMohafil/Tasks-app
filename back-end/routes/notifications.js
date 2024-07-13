const express = require("express");
const { auth } = require("../middleware");
const { getMyNotifications, makeSeenNotification, makeSeenNotificationsAll } = require("../Controllers/notificationsController");
const router = express.Router();

router.get('/getMe',auth,getMyNotifications);
router.put("/seen/:id", auth,makeSeenNotification);
router.post("/seenAll",auth,makeSeenNotificationsAll);

module.exports = router