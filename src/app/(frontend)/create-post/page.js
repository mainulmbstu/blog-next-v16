import React from "react";
import CreatePost from "./createPost";

export const metadata = {
  title: "Create Post",
  description: "Create Post page",
};
const Page = () => {
  return (
    <div>
      <CreatePost />
    </div>
  );
};

export default Page;
