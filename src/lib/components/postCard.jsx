import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import DeleteModal from "./DeleteModal";
import { getTokenData } from "../helpers/getTokenData";
import { deletePostAction } from "@/app/(frontend)/post/post-details/[pid]/action";
import { blurDataURL } from "../helpers/blurData";
import { getCookieValue } from "../helpers/getCookieValue";

const PostCard = async ({ item }) => {
  let CharLimit = 100;
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  return (
    <div className="h-full my-2">
      <div className=" shadow-xl h-full flex flex-col cursor-pointer hover:bg-zinc-400 bg-zinc-300 dark:bg-gray-700 p-1">
        <figure className=" h-40 md:max-h-80 relative">
          <Image
            src={item?.picture?.secure_url}
            priority={true}
            // fill
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            blurDataURL={blurDataURL()}
            placeholder="blur"
            className=" object-contain h-40 w-auto mx-auto"
            alt="image"
            width={200}
            height={200}
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
              Post: {item?.post?.substring(0, CharLimit)}{" "}
              {item?.post?.length > CharLimit ? "..." : ""}
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-between">
          <Link
            className="btn-link text-blue-500 "
            href={`/post/post-details/${item._id}`}
          >
            View Details
          </Link>
          <div
            className={
              item?.user?._id?.toString() === userInfo?._id ||
              userInfo?.role === "admin"
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
