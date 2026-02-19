import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import dbConnect from "@/lib/helpers/dbConnect";

export async function GET(req) {
  let userId = req.nextUrl.searchParams.get("userId");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  try {
    await dbConnect();
    const total = await PostModel.find({ user: userId });
    const postList = await PostModel.find({ user: userId })
      .populate("user", "-password")
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return Response.json({ postList, total: total?.length });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
