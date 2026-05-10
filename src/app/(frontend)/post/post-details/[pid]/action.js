"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { LikeModel } from "@/lib/models/LikeModel";
import { PostModel } from "@/lib/models/PostModel";
import { revalidatePath, updateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
//===========================
export const detailsAction = async (pid) => {
  try {
    await dbConnect();
    const post = await PostModel.findById(pid).populate("user", "-password");
    return { details: post };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================
export const similarPostAction = async (pid) => {
  try {
    await dbConnect();
    const post = await PostModel.findById(pid).populate("user", "-password");
    const similarPosts = await PostModel.find({
      category: post?.category,
      _id: { $ne: pid },
    })
      .populate("user", "name")
      .limit(12)
      .sort({ updatedAt: -1 });

    return { similarPosts };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================
export const likeStatusAction = async (pid) => {
  let { userInfo } = await getTokenData(await getCookieValue("token"));

  try {
    await dbConnect();
    const like = await LikeModel.findOne({
      post: pid,
      user: userInfo?._id,
    });
    return like;
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//================================
export const likeAction = async (pid) => {
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  try {
    await dbConnect();
    if (!pid) {
      return { message: "pid is required" };
    }

    await LikeModel.create({
      post: pid,
      status: true,
      user: userInfo?._id,
    });

    let post = await PostModel.findById(pid);
    post.like = post?.like + 1;
    await post.save();
    updateTag("comment-list");
    return { message: "Post liked successfully" };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//=====================================
export const commentAction = async (formData) => {
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  let comment = formData.get("comment");
  let pid = formData.get("pid");
  let parentId = formData.get("parentId");
  let cid = formData.get("cid");

  try {
    if (!comment) {
      throw new Error("Comment is required");
    }
    await dbConnect();
    if (!cid) {
      let comm = new CommentModel();
      comm.post = pid;
      comm.comment = comment;
      comm.user = userInfo?._id;
      if (parentId) comm.parentId = parentId;
      await comm.save();

      let post = await PostModel.findById(pid);
      post.comment = post?.comment + 1;
      await post.save();
      return { success: true, message: "Comment added successfully" };
    } else {
      const itemExist = await CommentModel.findById(cid);
      if (!itemExist) throw new Error("Comment not found");
      if (itemExist?.user?.toString() !== userInfo?._id?.toString()) {
        throw new Error("You are not authorized to edit this comment");
      }
      if (comment) itemExist.comment = comment;

      await itemExist.save();
      return { success: true, message: "Comment updated successfully" };
    }
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  } finally {
    updateTag("comment-list");
  }
};
//===========================================================
export const deletePostAction = async (id = "") => {
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  try {
    await dbConnect();
    const itemExist = await PostModel.findById(id);
    if (!itemExist) {
      throw new Error("Post not found");
    }
    if (
      userInfo?.role !== "admin" &&
      itemExist?.user?.toString() !== userInfo?._id?.toString()
    ) {
      throw new Error("You are not authorized to delete this.");
    }
    itemExist.picture?.public_id &&
      (await deleteImageOnCloudinary(itemExist.picture?.public_id));
    await LikeModel.deleteMany({ post: id });
    await CommentModel.deleteMany({ post: id });
    await PostModel.findByIdAndDelete(id);
    updateTag("post-list");

    return {
      message: `${itemExist?.title} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
