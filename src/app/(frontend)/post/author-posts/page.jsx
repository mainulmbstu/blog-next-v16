import Pagination from "@/lib/components/pagination";
import Card from "@/lib/components/postCard";

const AuthorPage = async ({ searchParams }) => {
  let spms = await searchParams;
  let authorId = (await spms?.authorId) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "8");
  // let start=(Number(page)-1)*Number(perPage)
  let start = (page - 1) * perPage;
  let end = page * perPage;

  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/user/author-posts?authorId=${authorId}&page=${page}&perPage=${perPage}`,
    // {
    //   cache: "force-cache",
    //   next: { tags: ["post-list"] },
    // },
  );
  let { postList, author, total } = await res.json();
  // let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  // let entries = postList?.slice(start, end);
  let entries = postList;
  return (
    <div className="p-2">
      <h4>Total posts found {postList?.length} </h4>
      <h4>Author Name: {author?.name} </h4>
      <div className="grid md:grid-cols-4 gap-6">
        {entries?.length ? (
          entries.map((item) => <Card key={item._id} item={item} />)
        ) : (
          <p>No data found</p>
        )}
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={total || 1}
          page={page}
          perPage={perPage}
          spms1="authorId"
          spms1Value={authorId}
        />{" "}
      </div>
    </div>
  );
};

export default AuthorPage;
