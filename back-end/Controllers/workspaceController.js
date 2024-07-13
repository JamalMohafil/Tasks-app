const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const fs = require("fs").promises; // استخدام `fs.promises`
const Workspace = require("../models/Workspace");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const deleteFileWithRetry = async (filePath, retries = 5, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
      return;
    } catch (err) {
      if (err.code === "EPERM") {
        console.warn(
          `Retry ${i + 1}/${retries} for deleting file: ${filePath}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  console.error(`Failed to delete file after ${retries} attempts: ${filePath}`);
};

exports.createWorkspace = asyncHandler(async (req, res) => {
  const { name, description, members, createdBy } = req.body;

  try {
    if (createdBy !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let imagePath;
    if (req.file) {
      const { path: tempPath, filename } = req.file;
      const resizedImagePath = `uploads/resized-${filename}`;
      await sharp(tempPath)
        .resize({ width: 300, height: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedImagePath);

      // Attempt to delete the temp file with retry mechanism
      deleteFileWithRetry(tempPath).catch((err) => {
        console.error("Error deleting temp image:", err);
      });

      imagePath = resizedImagePath;
    }

    const newWork = new Workspace({
      name,
      description,
      image:
        imagePath ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WQTIyI3gDR7pusOaPAIGJKzMZ9aUxcfsJQ&s",
      createdBy,
      members: [createdBy],
      admins: [createdBy],
    });

    const memberIds = JSON.parse(members);
    for (const memberId of memberIds) {
      const user = await User.findById(memberId);
      if (user) {
        user.workspacesRequests.push({
          workspace: newWork._id,
          status: "pending",
          user: req.user._id,
        });
        const newNoti = new Notification({
          receiver: user._id,
          title: `Workspace Request`,
          content: `${req.user.name} wants to join your workspace`,
          link: "/all-workspaces/requests",
        });
        await newNoti.save();
        await user.save();
      }
    }

    req.user.workspaces.push(newWork._id);
    await req.user.save();
    await newWork.save();

    res.json({ workspace: newWork, success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

exports.updateWorkspace = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;
  const workspaceId = req.params.id;

  try {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;

    if (req.file) {
      const { path: tempPath, filename } = req.file;
      const resizedImagePath = `uploads/resized-${filename}`;
      await sharp(tempPath)
        .resize({ width: 300, height: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedImagePath);

      deleteFileWithRetry(tempPath).catch((err) => {
        console.error("Error deleting temp image:", err);
      });

      workspace.image = resizedImagePath;
    }

    if (members) {
      const newMemberIds = JSON.parse(members);
      const currentMemberIds = workspace.members.map((member) =>
        member.toString()
      );

      const addedMembers = newMemberIds.filter(
        (id) => !currentMemberIds.includes(id)
      );
      const removedMembers = currentMemberIds.filter(
        (id) => !newMemberIds.includes(id)
      );

      // Handle added members (send invite)
      for (const memberId of addedMembers) {
        const user = await User.findById(memberId);
        if (user) {
          user.workspacesRequests.push({
            workspace: workspace._id,
            status: "pending",
            user: req.user._id,
          });
          const newNoti = new Notification({
            receiver: user._id,
            title: `Workspace Request`,
            content: `${req.user.name} wants you to join their workspace`,
            link: "/all-workspaces/requests",
          });
          await newNoti.save();
          await user.save();
        }
      }
      
      // Handle removed members
      for (const memberId of removedMembers) {
        const user = await User.findById(memberId);
        if (user) {
          workspace.members = workspace.members.filter(
            (id) => id.toString() !== memberId
          );
          user.workspaces = user.workspaces.filter(
            (workspaceId) => workspaceId.toString() !== workspace._id.toString()
          );
          user.workspacesRequests = user.workspacesRequests.filter(
            (request) =>
              request.workspace.toString() !== workspace._id.toString()
          );
          const newNoti = new Notification({
            receiver: user._id,
            title: `Removed from Workspace`,
            content: `${req.user.name} has removed you from the workspace`,
            link: "/all-workspaces",
          });
          await newNoti.save();
          await user.save();
        }
      }
    }

    await workspace.save();
    res.json({ workspace, success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

exports.getWorkspaces = asyncHandler(async (req, res) => {
  if (!req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // استعلام لاسترجاع الـ Workspaces التي يكون المستخدم هو createdBy أو عضو فيها
  const workspaces = await Workspace.find({
    $or: [
      { createdBy: req.user._id }, // المستخدم هو createdBy
      { members: req.user._id }, // المستخدم هو عضو في members
    ],
  }).populate("members", "image").select('-tasks'); // اسماء الادمنز
  if(!workspaces){
    return res.status(200).json({ workspaces: [], success: true });
  }
  res.json({ workspaces, success: true });
});

exports.getWorkspaceById = asyncHandler(async (req, res) => {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    // console.log(req.user.workspaces,'woksp',objectId);
    console.log(req.user._id,'idFroMFas')
    const user = await User.findById(req.user._id);
    console.log(req.params.id,'freaking')
    console.log(user.workspaces.includes(req.params.id),'woksp');
    // if (!req.user.workspaces.includes(req.params.id)) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

const workspace = await Workspace.findById(req.params.id)
  .populate("admins", "name image email _id")
  .populate("members", "image _id name email")
  .select("-tasks");
    res.json({ workspace, success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});
exports.getWorkspaceTasks = asyncHandler(async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id).select("tasks _id").populate("tasks");
    res.json({ workspace, success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
})
exports.requestWorkspaceJoin = asyncHandler(async (req,res)=>{
  const {workspaceId} = req.params
  if(!req.user._id){
    return res.status(401).json({message:'Unauthorized',success:false})
  }
  const workspace = await Workspace.findById(workspaceId)
  if(!workspace){
    return res.status(404).json({message:'Workspace not found',success:false})
  }
  if(workspace.joinRequests.some((request)=>request.user.equals(req.user._id))){
    return res.status(400).json({message:'Request already sent',success:true})
  }
  workspace.joinRequests.push({
    user:req.user._id,
    status:'pending'
  })
  await workspace.save()
  res.json({message:'Request sent',success:true})
})
exports.getAllWorkspaceRequests = asyncHandler(async(req,res)=>{
  const workspaceId = req.params.id
  const workspace = await Workspace.findById(workspaceId)
  if(!req.user._id ){
    return res.status(401).json({message:'Unauthorized',success:false})
  }
  if( !workspace.admins.includes(req.user._id) && !workspace.createdBy.equals(req.user._id)){
    return res.status(401).json({message:'You are not allowed to view this',success:false})
  }
  const requests = await Workspace.findById(workspaceId).select('joinRequests').populate('joinRequests.user')
  res.json({requests,success:true})
})
exports.confirmWorkspaceRequest = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    const workspace = await Workspace.findById(workspaceId);

    if (!user || !workspace) {
      return res.status(404).json({ message: "User or Workspace not found" });
    }

    const requestIndex = user.workspacesRequests.findIndex(
      (request) => request.workspace.toString() === workspaceId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    user.workspacesRequests.splice(requestIndex, 1);
    user.workspaces.push(workspace._id);
    workspace.members.push(user._id);

    await user.save();
    await workspace.save();

    res.json({ message: "Request accepted", success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});
exports.rejectWorkspaceRequest = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const user = await User.findById(req.user._id);
    const workspace = await Workspace.findById(workspaceId);

    if (!user || !workspace) {
      return res.status(404).json({ message: "User or Workspace not found" });
    }

    const requestIndex = user.workspacesRequests.findIndex(
      (request) => request.workspace.toString() === workspaceId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    // إزالة الطلب من قائمة workspacesRequests
    user.workspacesRequests.splice(requestIndex, 1);
    await user.save();

    res.json({ message: "Request rejected and removed", success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});
exports.getAllWorkspacesRequests = asyncHandler(async (req, res) => {
  try {
    const userWithRequests = await User.findById(req.params.id).select(
      "workspacesRequests"
    );

    if (!userWithRequests) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const workspaceRequests = userWithRequests.workspacesRequests;

    const allReqs = await Promise.all(
      workspaceRequests.map(async (request) => {
        const workspace = await Workspace.findById(request.workspace).select(
          "name description image"
        );
        const user = await User.findById(request.user).select(
          "name email image"
        );
        return {
          ...request.toObject(),
          user,
          workspace,
        };
      })
    );

    res.json({ requests: allReqs, success: true });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});
exports.deleteWorkspace = asyncHandler(async (req,res)=>{
  const {id} = req.params
try {
    const workspace = await Workspace.findById(id)
  if(!workspace){
    return res.status(404).json({message:'Workspace not found',success:false})
  }
  console.log(req.user._id)
  console.log(req.user._id !== workspace.createdBy.toString());
  console.log( workspace.createdBy.toString());
  if (req.user._id.toString() !== workspace.createdBy.toString()) {
    return res.status(403).json({
      message: "You are not allowed to delete this workspace",
      success: false,
    });
  }
  
    await Workspace.findByIdAndDelete(id)
  res.json({message:'Workspace deleted',success:true})
}catch(e){
  res.status(400).json({message:e.message,success:false})
}
})
exports.acceptFromAdminToWorkspace = asyncHandler(async (req, res) => {
  const workspaceId = req.params.id;
  const { status, userId } = req.body;

  try {
    const workspace = await Workspace.findById(workspaceId);
    const user = await User.findById(userId);

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found", success: false });
    }

    if (
      !workspace.admins.includes(req.user._id) &&
      !workspace.createdBy.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized action", success: false });
    }

    if (status === "accept") {
      if (!workspace.members.includes(userId)) {
        workspace.members.push(userId);
        user.workspaces.push(workspace._id);
        workspace.joinRequests = workspace.joinRequests.filter(
          (item) => item.user.toString() !== userId
        );
        await workspace.save();
        await user.save();
        return res.json({ message: "Workspace user added", success: true });
      } else {
        return res
          .status(400)
          .json({ message: "User is already a member", success: false });
      }
    } else if (status === "reject") {
      workspace.joinRequests = workspace.joinRequests.filter(
        (item) => item.user.toString() !== userId
      );
      await workspace.save();
      return res.json({
        message: "Workspace join request removed",
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid status", success: false });
    }
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
});
