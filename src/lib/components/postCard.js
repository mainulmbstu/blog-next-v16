import Image from "next/image";
import React from "react";
import getBase64 from "@/lib/helpers/plaiceholder";
import Link from "next/link";
import moment from "moment";
import { getCookieValue } from "../helpers/helperFunction";
import DeleteModal from "./DeleteModal";
import { getTokenData } from "../helpers/getTokenData";
import { deletePostAction } from "@/app/(frontend)/post/post-details/[pid]/action";

const PostCard = async ({ item }) => {
  let postCharLimit = 100;
  let userInfo = await getTokenData(await getCookieValue("token"));
  let blurData = await getBase64(item?.picture?.secure_url);
  return (
    <div className="h-full">
      <div className="card shadow-xl h-full flex flex-col">
        <figure className=" h-40 md:max-h-80 relative">
          <Image
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            blurDataURL={blurData}
            placeholder="blur"
            className=" object-contain"
            src={item?.picture?.secure_url}
            alt=""
          />{" "}
        </figure>
        <p className="text-end me-1">
          Like: {item?.like} || Comments: {item?.comment}{" "}
        </p>
        <div className="">
          <h3 className="">Title: {item?.title}</h3>
          <h5 className="">Author: {item?.user?.name}</h5>
          <p>{moment(item?.createdAt).fromNow()},</p>
          <div className="">
            <p className="">Category: {item?.category}</p>
            <p className="mb-2">
              Post: {item?.post?.substring(0, postCharLimit)}{" "}
              {item?.post?.length > postCharLimit ? "..." : ""}
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-between">
          <Link
            className="btn btn-primary "
            href={`/post/post-details/${item._id}?title=${
              item.title
            }&post=${item.post.substring(0, 300)}`}
          >
            Viw Details
          </Link>
          <div
            className={
              item?.user?._id == userInfo?._id || userInfo?.role === "admin"
                ? ""
                : "hidden"
            }
          >
            <DeleteModal
              value={{
                id: item?._id.toString(),
                message: `Do you want to delete ${item?.title}`,
                action: deletePostAction,
                // redirect: "/",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
