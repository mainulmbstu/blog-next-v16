// export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import { UserModel } from "@/lib/models/userModel";
import dbConnect from "@/lib/helpers/dbConnect";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = 12;
  let skip = (page - 1) * perPage;
  let limit = page * perPage;
  try {
    await dbConnect();
    let author = await UserModel.find({
      name: { $regex: keyword, $options: "i" },
    });
    let authIdArr = author?.length && (await author.map((item) => item._id));
    const total = await PostModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { post: { $regex: keyword, $options: "i" } },
        { user: authIdArr?.length && authIdArr },
      ],
    });
    let totalPage = Math.ceil(total?.length / perPage);
    const postList = await PostModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { post: { $regex: keyword, $options: "i" } },
        { user: authIdArr?.length && authIdArr },
      ],
    })
      .populate("user", "-password", UserModel)
      // .populate({ path: "user", select: "name email", model: UserModel })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return Response.json({ postList, total: total?.length, totalPage });
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
