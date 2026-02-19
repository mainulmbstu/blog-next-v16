import MyBlogPage from "@/app/(frontend)/dashboard/admin/my-blogs/MyBlogPage";

const MyBlogs = async ({ searchParams }) => {
  return (
    <div>
      <MyBlogPage searchParams={searchParams} />
    </div>
  );
};

export default MyBlogs;
