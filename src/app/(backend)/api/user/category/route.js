import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  try {
    await dbConnect();

    const total = await PostModel.find(
      keyword === "All-Category"
        ? {} // null
        : {
            categorySlug: { $regex: keyword, $options: "i" },
          }
    );
    const postList = await PostModel.find(
      keyword === "All-Category"
        ? {} // null
        : {
            categorySlug: { $regex: keyword, $options: "i" },
          }
    )
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
