import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import dbConnect from "@/lib/helpers/dbConnect";
import { uploadOnCloudinary } from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { getCookieValue } from "@/lib/helpers/helperFunction";

export async function POST(req) {
  let formData = await req.formData();

  let userInfo = await getTokenData(await getCookieValue("token"));
  let title = formData.get("title");
  let category = formData.get("category");
  let post = formData.get("post");
  if (!title || !category || !post) {
    return Response.json({ message: "Please enter all required fields" });
  }
  let file = formData.get("file");
  try {
    await dbConnect();

    let url;
    if (file?.size) {
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "blognextpost",
      );
      url = { secure_url, public_id };
    }
    await PostModel.create({
      title,
      category,
      categorySlug: slugify(category),
      post,
      user: userInfo?._id,
      picture: url && url,
    });
    revalidateTag("post-list", "max");
    // revalidateTag("post-list", { expire: 0 });
    // revalidatePath("/", "layout");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'

    return Response.json({
      success: true,
      message: `Post created successfully `,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
