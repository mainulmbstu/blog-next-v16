// const mongoose = require("mongoose");
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts", //collection name in mongoose.model('users', userSchema)
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //collection name in mongoose.model('users', userSchema)
      required: true,
    },
    parentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const CommentModel =
  mongoose.models?.comments || mongoose.model("comments", commentSchema);
