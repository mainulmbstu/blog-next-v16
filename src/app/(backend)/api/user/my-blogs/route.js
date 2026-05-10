import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";

export async function GET(req) {
  try {
    await dbConnect();

    const postList = await PostModel.find({}).populate("user", "-password");

    return Response.json(postList);
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
