// const mongoose = require("mongoose");
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    post: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    categorySlug: { type: String, required: true },
    comment: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", //collection name in mongoose.model('User', userSchema)
      required: true,
    },
    picture: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dgj1icpu7/image/upload/v1739850899/dir0m1r7wi2bphos1uqk.jpg",
      },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

export const PostModel =
  mongoose.models?.posts || mongoose.model("posts", postSchema);
