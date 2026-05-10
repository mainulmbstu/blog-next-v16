import React from "react";
import NestedComments from "./NestedComments";

const NestedCommentData = async ({ pid }) => {
  let res = await fetch(
    `${process.env.BASE_URL}/api/user/all-comments?pid=${pid}`,
    { cache: "force-cache", next: { tags: ["comment-list"] } },
  );
  let data = await res.json();
  return (
    <div>
      <NestedComments data={data} pid={pid} />
    </div>
  );
};

export default NestedCommentData;
