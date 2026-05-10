import { Suspense } from "react";
import Skeleton from "@/lib/components/Skeleton";
import Home2 from "@/lib/components/home/home2";

export default function Home({ searchParams }) {
  return (
    <Suspense fallback=<Skeleton />>
      <Home2 searchParams={searchParams} />
    </Suspense>
  );
}
