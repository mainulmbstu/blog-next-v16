import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import { UserModel } from "@/lib/models/userModel";

export async function GET(req) {
  let authorId = req.nextUrl.searchParams.get("authorId");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  try {
    await dbConnect();

    const total = await PostModel.find({ user: authorId });

    const postList = await PostModel.find({ user: authorId })
      .populate("user", "-password")
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    const author = await UserModel.findById(authorId, { password: 0 }).sort({
      createdAt: -1,
    });
    return Response.json({ postList, author, total: total?.length });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
