// export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import {
  deletePostAction,
  likeAction,
  likeStatusAction,
  detailsAction,
} from "./action";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { GrLike } from "react-icons/gr";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import DeleteModal from "@/lib/components/DeleteModal";
import { getTokenData } from "@/lib/helpers/getTokenData";
import SimilarPosts from "./SimilarPosts";
import NestedCommentData from "./NestedCommentData";
import { blurDataURL } from "@/lib/helpers/blurData";
import DateSSR2 from "@/lib/components/DateSSR2";
import CommentModal from "./CommentModal";
import PostModal from "./PostModal";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

export const generateMetadata = async ({ params }) => {
  let { pid } = await params;
  let { details } = await detailsAction(pid);
  return {
    title: details?.title,
    description: details?.post,
  };
};

// export async function generateStaticParams() {
//   // let res = await fetch(
//   //   `${process.env.BASE_URL}/api/user/all-posts?keyword=${""}`
//   // );
//   // let data = await res.json();
//   // let pids =
//   //   data?.length && data.map((item) => ({ pid: item._id?.toString() }));

//   // console.log(pids);
//   // return pids;
//   return [];
// }
const PostDetails = async ({ params }) => {
  // console.log(search);
  let { pid } = await params;
  let { userInfo } = await getTokenData(await getCookieValue("token"));
  let { details } = await detailsAction(pid);
  // let similarPostsPromise = similarPostAction(pid);
  let like = await likeStatusAction(pid);
  let subLikeAction = likeAction.bind(null, pid);

  if (!details) return null;
  return (
    <div>
      <div className="px-2">
        <div className="">
          <div className="">
            <div className="">
              <figure className=" h-40 md:h-100 relative">
                <Image
                  priority={true}
                  blurDataURL={blurDataURL()}
                  placeholder="blur"
                  className=" object-contain h-40 md:h-100  w-auto mx-auto"
                  alt="image"
                  width={2000}
                  height={2000}
                  src={details?.picture?.secure_url}
                />{" "}
              </figure>
            </div>
            <div className=" pe-3 flex flex-wrap md:justify-end items-center mt-2 ">
              <div className="flex items-center">
                <span>{like ? "You liked this post ||" : ""} </span>{" "}
                <Form className="px-3" action={subLikeAction}>
                  <SubmitButton
                    disable={like?.status}
                    design={"btn-link"}
                    title={
                      <GrLike
                        className={
                          like
                            ? " text-3xl  me-3 text-blue-400"
                            : "text-black  me-3"
                        }
                      />
                    }
                  />
                </Form>
              </div>
              <div>
                Likes: {details?.like} || comments: {details?.comment} ||
              </div>
              <div
                className={
                  details?.user?._id?.toString() === userInfo?._id
                    ? "mx-2 "
                    : "hidden"
                }
              >
                <PostModal
                  editItem={JSON.stringify(details)}
                  title="Edit Post"
                />
              </div>
              <div
                className={
                  details?.user?._id?.toString() === userInfo?._id ||
                  userInfo?.role === "admin"
                    ? ""
                    : "hidden"
                }
              >
                <DeleteModal
                  value={{
                    id: details?._id.toString(),
                    message: `Do you want to delete ${details?.title}`,
                    action: deletePostAction,
                    redirect: "/",
                  }}
                />
              </div>
            </div>
            <div className=" px-md-3">
              <div>
                <h4>Title: {details?.title} </h4>
                <p className="flex">
                  <Link
                    href={details?.user?.picture?.secure_url || "#"}
                    target="_blank"
                  >
                    <Image
                      priority={true}
                      blurDataURL={blurDataURL()}
                      placeholder="blur"
                      alt="image"
                      className=" object-contain w-10 h-auto rounded-full me-3"
                      width={100}
                      height={100}
                      src={details?.user?.picture?.secure_url}
                    />{" "}
                  </Link>{" "}
                  <span className="mt-3">{details?.user?.name} </span>
                </p>
                <p>Post Category: {details?.category} </p>
                <p>
                  Created:
                  <DateSSR2 date={details?.createdAt} time={true} />, (
                  {moment(details?.createdAt).fromNow()})
                </p>
                <p>
                  Updated:
                  <DateSSR2 date={details?.updatedAt} time={true} />, (
                  {moment(details?.updatedAt).fromNow()})
                </p>
                <p className="border border-zinc-200 p-2 text-break">
                  Post: {details?.post}{" "}
                </p>
              </div>
            </div>

            <div className=" px-3">
              <h4>Comment on this post</h4>
              <CommentModal
                pid={pid}
                title="Comment"
                design="btn btn-primary"
              />
              <div className="mt-3">
                <Link
                  className=" underline text-blue-500"
                  href={`/post/author-posts?authorId=${details?.user?._id}`}
                >
                  All posts of this author
                </Link>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className=" ">
          <div>
            <Suspense fallback={<h2>Loading comments</h2>}>
              <NestedCommentData pid={pid} />
            </Suspense>
          </div>
        </div>
        <hr />
        <div className=" mb-4">
          <Suspense fallback={<h2>Loading similar posts</h2>}>
            <SimilarPosts pid={pid} />
            {/* <SimilarPosts similarPostsPromise={similarPostsPromise} /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
