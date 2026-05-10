"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { PostModel } from "@/lib/models/PostModel";
import { UserModel } from "@/lib/models/userModel";
import { cacheLife, cacheTag } from "next/cache";

export const allPostAction = async (keyword, page = 1, perPage) => {
  "use cache";
  cacheLife("days");
  cacheTag("post-list");
  let skip = (page - 1) * perPage;
  // let limit = page * perPage;
  try {
    await dbConnect();
    let author = await UserModel.find({
      name: { $regex: keyword, $options: "i" },
    });
    let authIdArr = author?.length && author.map((item) => item._id);
    const total = await PostModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { post: { $regex: keyword, $options: "i" } },
        { user: authIdArr?.length && authIdArr },
      ],
    });
    const postList = await PostModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { post: { $regex: keyword, $options: "i" } },
        { user: authIdArr?.length && authIdArr },
      ],
    })
      // .populate({ path: "category", select: "name", model: CategoryModel })
      // .populate("category", "name", CategoryModel)
      .populate("user", "-password", UserModel)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return { postList: JSON.stringify(postList), total: total?.length };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
