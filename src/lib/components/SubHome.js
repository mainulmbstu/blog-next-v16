"use client";

import Form from "next/form";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Pagination from "./pagination";
import PaginationButton from "./paginationButton";

const SubHome = () => {
  const [postList, setpostList] = useState([]);
  const [page, setpage] = useState(1);
  let fetchData = async () => {
    let res = await fetch(
      `http://localhost:3000/api/user/all-posts?keyword=${""}`
      // {
      //   cache: "force-cache",
      // }
    );
    let postList = await res.json();
    setpostList(postList);
  };
  useEffect(() => {
    fetchData();
  }, []);
  //   let entries = postList;
  let entries = postList?.slice(0, page * 3);
  console.log(entries);

  return (
    <div>
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
            entries.map((item) => <h2 key={item._id}>{item.title}</h2>)
          ) : (
            <p>No data found</p>
          )}
        </div>
        {/* <div className=" mt-3 ">
          <Pagination
            totalPage={totalPage}
            page={page}
            perPage={perPage}
            spms1="keyword"
            spms1Value={keyword}
          />{" "}
        </div> */}
        <div className=" mt-3 ">
          <PaginationButton
            setpage={setpage}
            // page={page}
            // perPage={perPage}
            // spms1="keyword"
            // spms1Value={keyword}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default SubHome;
