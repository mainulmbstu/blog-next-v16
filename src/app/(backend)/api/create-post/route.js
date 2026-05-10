import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { PostModel } from "@/lib/models/PostModel";

export async function POST(req) {
  let formData = await req.formData();
  let id = formData.get("id");
  let title = formData.get("title");
  let category = formData.get("category");
  let post = formData.get("post");
  let file = formData.get("file");
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  try {
    if (!id) {
      if (!title || !category || !post) {
        throw new Error("Please enter all required fields");
      }
      await dbConnect();

      let url;
      if (file?.size) {
        if (file?.size > 3 * 1024 * 1000) {
          throw new Error("File too large, maximum 3 mb`");
        }
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "blogNext",
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

      return Response.json({
        success: true,
        message: `Post: ${title} has been created successfully`,
      });
    } else {
      await dbConnect();
      const itemExist = await PostModel.findById(id);
      if (file?.size) {
        itemExist.picture?.public_id &&
          (await deleteImageOnCloudinary(itemExist.picture?.public_id));
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "blogNext",
        );
        itemExist.picture = { secure_url, public_id };
      }
      if (title) itemExist.title = title;
      if (category) itemExist.category = category;
      if (post) itemExist.post = post;

      await itemExist.save();

      return Response.json({
        success: true,
        message: `Post: ${title} has been Updated successfully`,
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  } finally {
    revalidateTag("post-list", { expire: 0 });
    // for immediate update {expire:0}, 'max' for update after refresh or next visit.
    // revalidatePath("/", "layout");
    // revalidatePath("/dashboard/admin/create-category");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'
  }
}
