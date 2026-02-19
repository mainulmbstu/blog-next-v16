import PostCard from "@/lib/components/postCard";
import React from "react";
import { similarPostAction } from "./action";

const SimilarPosts = async ({ pid }) => {
  let similarPostsPromise = similarPostAction(pid);
  let data = await similarPostsPromise;
  let similarPosts = await data?.similarPosts;
  return (
    <div className=" mb-4">
      <h4>Similar posts</h4>
      <div className="grid md:grid-cols-4 gap-3">
        {similarPosts?.length &&
          similarPosts?.map((item) => <PostCard key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default SimilarPosts;
