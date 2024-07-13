const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description:{
      type:String,
      required:true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    image:{
      type:String,
    required:true
  },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    joinRequests: [
    {
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status:{
        type:String,
        default:'pending'
      }
    }
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);
module.exports = Workspace;
