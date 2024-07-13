const expressAsyncHandler = require("express-async-handler");
const notfic = require('../models/Notification')
exports.getMyNotifications = expressAsyncHandler(async (req, res) => {
    if(!req.user) return
    const limit = req.query.limit || 10;
    const notifications = await notfic.find({ receiver: req.user._id }).limit(limit).sort({ createdAt: -1 });
    if(!notifications) return res.json({});
    const notificationsCount = await notfic.countDocuments({ receiver: req.user._id});
    res.json({ notifications, notificationsCount });
})
exports.makeSeenNotificationsAll = expressAsyncHandler(async (req, res) => {
    const notifications = await notfic.updateMany({ receiver: req.user._id }, { $set: { seen: true } });
    res.json(notifications);
})
exports.makeSeenNotification = expressAsyncHandler(async (req, res) => {
    const notifications = await notfic.updateOne({ _id: req.params.id }, { $set: { seen: true } });
    res.json(notifications);
})