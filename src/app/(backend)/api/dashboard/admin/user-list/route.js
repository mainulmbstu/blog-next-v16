import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword");
  try {
    await dbConnect();
    const userList = await UserModel.find(
      {
        $or: [
          { email: { $regex: keyword, $options: "i" } },
          { name: { $regex: keyword, $options: "i" } },
        ],
      },
      { password: 0 }
    );

    return Response.json(userList);
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
}
