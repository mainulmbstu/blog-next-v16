// import { userListAction } from "./action";
import Pagination from "@/lib/components/pagination";
import Card from "@/lib/components/postCard";
import { Axios } from "@/lib/helpers/AxiosInstance";
import { category } from "@/lib/helpers/constants";

export const generateMetadata = async ({ searchParams }) => {
  let { categoryName } = await searchParams;
  return {
    title: categoryName,
    description: categoryName,
  };
};
export async function generateStaticParams() {
  return category.map((item) => ({ category: item.name }));
}

const CategoryPage = async ({ params, searchParams }) => {
  let { category } = await params;
  let spms = await searchParams;
  let categoryName = (await spms["categoryName"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "10");
  // let start=(Number(page)-1)*Number(perPage)
  // console.log(spms);
  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/user/category?keyword=${category}&page=${page}&perPage=${perPage}`,
    {
      cache: "force-cache",
      next: { tags: ["post-list"] },
    },
  );
  let data = await res.json();
  // let { data } = await Axios.get(
  //   `/api/user/category?keyword=${category}&page=${page}&perPage=${perPage}`
  // );
  let postList = data?.postList;
  // let postList = await res.json();
  let entries = postList;
  // let entries = postList?.slice(start, end);
  return (
    <div className="p-2">
      <h4>
        Category Name: {categoryName} ({data?.total}){" "}
      </h4>
      <div className="grid md:grid-cols-4 gap-6">
        {entries?.length ? (
          entries.map((item) => <Card key={item._id} item={item} />)
        ) : (
          <p>No data found</p>
        )}
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total}
          page={page}
          perPage={perPage}
          spms1="categoryName"
          spms1Value={categoryName}
        />{" "}
      </div>
    </div>
  );
};

export default CategoryPage;
