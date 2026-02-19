"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const PaginationButton = ({ page, perPage, totalPage, setpage }) => {
  let router = useRouter();
  let path = usePathname();
  // let searchParams = useSearchParams();
  // let page = searchParams.get("page") ?? "1";
  //   let perPage = searchParams.get("perPage") ?? "3";
  let pageArr = Array.from({ length: totalPage }, (v, i) => i + 1);

  const [count, setcount] = useState(1);
  console.log(count);

  return (
    <div>
      <button
        // disabled={page <= 1}
        onClick={() => {
          // router.push(
          //   `${path}?${spms1}=${spms1Value}&page=${page - 1}&perPage=${perPage}`
          // );
          setcount(count - 1);
          setpage(count - 1);
        }}
        className="btn btn-accent"
      >
        Previous
      </button>

      <button
        // disabled={page >= totalPage}
        onClick={() => {
          // router.push(
          //   `${path}?${spms1}=${spms1Value}&page=${page + 1}&perPage=${perPage}`
          // );
          setcount(count + 1);
          setpage(count + 1);
        }}
        className="btn btn-accent"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButton;
