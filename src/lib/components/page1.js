// import { userListAction } from "./action";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Link from "next/link";
import { Axios } from "@/lib/helpers/helperFunction";
import Card from "@/lib/components/postCard";
import PaginationButton from "@/lib/components/paginationButton";

const Home1 = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "3");
  // let start=(Number(page)-1)*Number(perPage)
  let start = (page - 1) * perPage;
  let end = page * perPage;
  // console.log(vvvvvv)
  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/user/all-posts?keyword=${keyword}`
    // {
    //   cache: "force-cache",
    // }
  );
  let postList = await res.json();
  // let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  let mmm = async (count = 1) => {
    "use server";
    console.log("inn", count);
    // return entries;
  };
  let totalPage = Math.ceil(postList?.length / perPage);
  let entries = postList?.slice(start, end);
  // console.log("test", kkk);
  return (
    <div className="p-2">
      <div>
        <Link className="btn btn-primary" href={"/create-post"}>
          Create Post
        </Link>
      </div>
      <div className="my-3">
        <Form action={"/"}>
          <div className="join">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="Title or Author name"
              />
            </div>
            <div className="">
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </Form>
      </div>
      <h5>Total posts found {postList?.length} </h5>
      <div className="overflow-x-auto grid md:grid-cols-4 gap-6">
        {entries?.length ? (
          entries.map((item) => <Card key={item._id} item={item} />)
        ) : (
          <p>No data found</p>
        )}
      </div>
      <div className=" mt-3 ">
        <Pagination
          totalPage={totalPage}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
      <div className=" mt-3 ">
        <PaginationButton
          mmm={mmm}
          totalPage={totalPage}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
    </div>
  );
};

export default Home1;
