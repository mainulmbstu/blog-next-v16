import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import { UserModel } from "@/lib/models/userModel";
import { CommentModel } from "@/lib/models/CommentModel";

export async function GET(req) {
  let pid = req.nextUrl.searchParams.get("pid");
  try {
    await dbConnect();

    const comments = await CommentModel.find({ post: pid })
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    let comList = await createNestedComments(comments);
    return Response.json({ comments: comList, plainComments: comments });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}

let createNestedComments = async (comments, parentId = null) => {
  let commentsList = [];
  let filteredCat;
  if (parentId == null) {
    filteredCat = await comments.filter((item) => item.parentId == undefined);
  } else {
    filteredCat = await comments.filter((item) => item.parentId == parentId);
    // console.log(filteredCat);
  }
  for (let v of filteredCat) {
    await commentsList.push({
      _id: v._id,
      post: v.post,
      comment: v.comment,
      user: v.user,
      parentId: v.parentId,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      children: await createNestedComments(comments, v._id),
    });
  }
  // console.log(commentsList);
  return commentsList;
};
