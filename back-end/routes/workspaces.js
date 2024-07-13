const router = require("express").Router();
const { createWorkspace, getWorkspaces, getWorkspaceById, getWorkspaceTasks, getAllWorkspacesRequests, confirmWorkspaceRequest, rejectWorkspaceRequest, deleteWorkspace, updateWorkspace, getAllWorkspaceRequests, requestWorkspaceJoin, acceptFromAdminToWorkspace } = require("../Controllers/workspaceController");
const { auth } = require("../middleware");
const imageUpload = require("../multer.config");

router.post("/", auth, imageUpload.single("image"), createWorkspace);
router.put(
  "/:id",
  auth,
  imageUpload.single("image"),
  updateWorkspace
);
router.get("/", auth, getWorkspaces);
router.get("/:id", auth, getWorkspaceById);
router.get("/tasks/:id", auth, getWorkspaceTasks);
router.get("/allRequests/:id", auth, getAllWorkspacesRequests);
router.post("/acceptRequest/:workspaceId", auth, confirmWorkspaceRequest);
router.post("/requestToJoin/:workspaceId", auth, requestWorkspaceJoin);
router.post("/rejectRequest/:workspaceId", auth, rejectWorkspaceRequest);
router.delete("/deleteWorkspace/:id", auth, deleteWorkspace);
router.get("/getAllWorkspaceRequests/:id", auth, getAllWorkspaceRequests);
router.post("/acceptJoinReq/:id", auth, acceptFromAdminToWorkspace);
// router.put("/:id", auth, isAdmin, updateWorkspace);
// router.delete("/:id", auth, isAdmin, deleteWorkspace);
module.exports = router