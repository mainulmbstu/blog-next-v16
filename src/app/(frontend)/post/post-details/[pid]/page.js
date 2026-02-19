// export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import {
  deletePostAction,
  likeAction,
  likeStatusAction,
  postDetailsAction,
} from "./action";
import Link from "next/link";
import { getCookieValue } from "@/lib/helpers/helperFunction";
import moment from "moment";
import Image from "next/image";
import getBase64 from "@/lib/helpers/plaiceholder";
import { GrLike } from "react-icons/gr";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import CommentModalNormal from "./commentModalNormal";
import DeleteModal from "@/lib/components/DeleteModal";
import EditCommentModal from "./editCommentModal";
import { getTokenData } from "@/lib/helpers/getTokenData";
import SimilarPosts from "./SimilarPosts";
import NestedCommentData from "./NestedCommentData";

export const generateMetadata = async ({ searchParams }) => {
  let { title, post } = await searchParams;
  return {
    title: title,
    description: post,
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
  let userInfo = await getTokenData(await getCookieValue("token"));
  let { postDetails } = await postDetailsAction(pid);
  // let similarPostsPromise = similarPostAction(pid);
  let blurData = await getBase64(postDetails?.picture?.secure_url);
  let blurDataAuthor = await getBase64(postDetails?.user?.picture?.secure_url);
  let like = await likeStatusAction(pid);
  let subLikeAction = likeAction.bind(null, pid);

  return (
    <div>
      <div className="px-2">
        <div className="">
          <div className="">
            <div className="">
              <figure className=" h-40 md:h-100 relative">
                <Image
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  blurDataURL={blurData}
                  placeholder="blur"
                  className=" object-contain"
                  src={postDetails?.picture?.secure_url}
                  alt=""
                />{" "}
              </figure>
            </div>
            <div className=" pe-3 flex justify-end items-center mt-2 ">
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
              Like: {postDetails?.like} || comments: {postDetails?.comment} ||
              <div
                className={
                  postDetails?.user?._id == userInfo?._id ? "mx-2 " : "hidden"
                }
              >
                <EditCommentModal
                  post={{
                    id: pid,
                    title: postDetails?.title,
                    category: postDetails?.category,
                    post: postDetails?.post,
                    picture: postDetails?.picture?.secure_url,
                  }}
                />
              </div>
              <div
                className={
                  postDetails?.user?._id == userInfo?._id ||
                  userInfo?.role === "admin"
                    ? ""
                    : "hidden"
                }
              >
                <DeleteModal
                  value={{
                    id: postDetails?._id.toString(),
                    message: `Do you want to delete ${postDetails?.title}`,
                    action: deletePostAction,
                    redirect: "/",
                  }}
                />
              </div>
            </div>
            <div className=" px-md-3">
              <div>
                <h4>Title: {postDetails?.title} </h4>
                <p className="flex">
                  <Link
                    href={postDetails?.user?.picture?.secure_url}
                    target="_blank"
                  >
                    <Image
                      priority={true}
                      // sizes="w-10"
                      blurDataURL={blurDataAuthor}
                      placeholder="blur"
                      className=" object-contain w-10 h-auto rounded-full me-3"
                      src={postDetails?.user?.picture?.secure_url}
                      alt=""
                      width={100}
                      height={100}
                    />{" "}
                  </Link>{" "}
                  <span className="mt-3">{postDetails?.user?.name} </span>
                </p>
                <p>Post Category: {postDetails?.category} </p>
                <p>
                  Created:
                  {moment(postDetails?.createdAt).format(
                    "DD-MMM-YYYY || hh:mm:ss a"
                  )}
                  , ({moment(postDetails?.createdAt).fromNow()})
                </p>
                <p>
                  Updated:
                  {moment(postDetails?.updatedAt).format(
                    "DD-MMM-YYYY || hh:mm:ss a"
                  )}
                  , ({moment(postDetails?.updatedAt).fromNow()})
                </p>
                <p className="border border-zinc-200 p-2 text-break">
                  Post: {postDetails?.post}{" "}
                </p>
              </div>
            </div>

            <div className=" px-3">
              <h4>Comment on this post</h4>
              <CommentModalNormal pid={pid} />
              <div className="mt-3">
                <Link
                  className=" underline text-blue-500"
                  href={`/post/author-posts?authorId=${postDetails?.user?._id}`}
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
