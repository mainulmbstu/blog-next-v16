import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import { CommentModel } from "@/lib/models/CommentModel";
import { createNestedComments } from "@/lib/helpers/createNestedComments";

export async function GET(req) {
  let pid = req.nextUrl.searchParams.get("pid");
  try {
    await dbConnect();

    const comments = await CommentModel.find({ post: pid })
      .populate("user", "-password", UserModel)
      .sort({ createdAt: -1 });
    let nestedComList = await createNestedComments(comments);
    return Response.json({ comments: nestedComList, plainComments: comments });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
