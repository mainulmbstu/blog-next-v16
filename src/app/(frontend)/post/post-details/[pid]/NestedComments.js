"use client";

import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import CommentModal from "./commentModal";
import Image from "next/image";

const NestedComments = ({ pid, data }) => {
  const [parentId, setParentId] = useState("");
  const [page, setPage] = useState(1);

  let comments = data?.comments?.slice(0, page * 5);

  let nestedComments = (comments) => {
    let commList = [];
    if (comments?.length) {
      for (let v of comments) {
        commList.push(
          <li key={v._id} className="mx-3 list-non ms-8">
            <p className="flex">
              <Link
                className="me-2"
                href={v?.user?.picture ? v?.user?.picture?.secure_url : "/"}
                target="_blank"
              >
                <Image
                  priority={true}
                  // sizes="w-10"
                  // blurDataURL={blurDataAuthor}
                  // placeholder="blur"
                  className=" object-contain w-10 h-auto me-3"
                  src={v?.user?.picture?.secure_url}
                  alt=""
                  width={100}
                  height={100}
                />{" "}
              </Link>{" "}
              <span className="mt-3">
                {v.user?.name} ({moment(v?.createdAt).fromNow()})
              </span>
            </p>
            <p className="ps-4 ms-3">Comment: {v.comment}</p>
            <label
              htmlFor="commentModal"
              className="btn btn-link m-3"
              onClick={() => setParentId(v?._id)}
            >
              Reply this comment
            </label>
            <CommentModal pid={pid} parentId={parentId} />
            {v.children.length > 0 ? (
              <ul>{nestedComments(v.children)} </ul>
            ) : null}
          </li>
        );
      }
    }
    return commList;
    // setcatTree(myCategories)
  };
  return (
    <div>
      <h4 className=" ms-3">
        Comments about this post ({data?.plainComments?.length}){" "}
      </h4>
      {nestedComments(comments)}
      <button
        disabled={comments?.length === data?.comments?.length}
        className="btn btn-accent"
        onClick={() => setPage((prev) => prev + 1)}
      >
        Load more
      </button>
    </div>
  );
};

export default NestedComments;
