import Page1 from "../lib/components/home/page1";
import { Suspense } from "react";
import Skeleton from "@/lib/components/Skeleton";

export default function Home({ searchParams }) {
  return (
    <Suspense fallback=<Skeleton />>
      <Page1 searchParams={searchParams} />
    </Suspense>
  );
}
