"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getCookieValue } from "@/lib/helpers/helperFunction";
import { CommentModel } from "@/lib/models/CommentModel";
import { LikeModel } from "@/lib/models/LikeModel";
import { PostModel } from "@/lib/models/PostModel";
import { revalidatePath, updateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";

export const postDetailsAction = async (pid) => {
  try {
    await dbConnect();
    const post = await PostModel.findById(pid).populate("user", "-password");
    return { postDetails: post };
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
  let userInfo = await getTokenData(await getCookieValue("token"));

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
  let userInfo = await getTokenData(await getCookieValue("token"));
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
export const commentAction = async (pid, comment, parentId) => {
  let userInfo = await getTokenData(await getCookieValue("token"));

  try {
    await dbConnect();
    let comm = new CommentModel();
    comm.post = pid;
    comm.comment = comment;
    if (parentId) comm.parentId = parentId;
    comm.user = userInfo?._id;
    await comm.save();
    let post = await PostModel.findById(pid);
    post.comment = post?.comment + 1;
    await post.save();
    updateTag("comment-list");
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================================================
export const deletePostAction = async (id = "") => {
  try {
    await dbConnect();
    const post = await PostModel.findByIdAndDelete(id);
    post.picture?.public_id &&
      (await deleteImageOnCloudinary(post.picture?.public_id));
    await LikeModel.deleteMany({ post: id });
    await CommentModel.deleteMany({ post: id });
    updateTag("post-list");

    return {
      message: `${post?.title} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//===========================================================
export const editPostAction = async (pid, formData) => {
  let title = formData.get("title");
  let category = formData.get("category");
  let post = formData.get("post");
  let file = formData.get("file");

  try {
    await dbConnect();
    const postExist = await PostModel.findById(pid);
    if (file?.size) {
      postExist.picture?.public_id &&
        (await deleteImageOnCloudinary(postExist.picture?.public_id));
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "blognextpost",
      );
      postExist.picture = { secure_url, public_id };
    }
    if (title) postExist.title = title;
    if (category) postExist.category = category;
    if (post) postExist.post = post;

    await postExist.save();
    updateTag("post-list");
    return {
      success: true,
      message: `Post Updated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
