import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import { loginMiddleware, test } from "@/lib/helpers/helperFunction";
import { cookies, headers } from "next/headers";

export async function GET(request) {
  let token = request.nextUrl.searchParams.get("token");
  // let token = await loginMiddleware();
  // let tokenData = test(token);

  try {
    await dbConnect();

    const postList = await PostModel.find({}).populate("user", "-password");

    return Response.json(postList);
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
