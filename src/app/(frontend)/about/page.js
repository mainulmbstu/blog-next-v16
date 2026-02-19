"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

// export const metadata = {
//   title: "about",
//   description: "about page",
// };

const About = () => {
  const [count, setcount] = useState(0);
  // await new Promise((resolve) => {
  //   setTimeout(() => resolve(), 10000);
  // });
  useEffect(() => {
    if (count < 1000) {
      let timer = setInterval(() => {
        setcount((prev) => prev + 1);
      }, 1);
      return () => {
        clearInterval(timer);
      };
    }
  }, [count]);

  return (
    <div className="">
      <h2>About- {count}</h2>
      {/* <CldUploadWidget
        uploadPreset="preset1"
        onSuccess={({ event, info }) => {
          if (event === "success") {
            console.log(event, info);
          }
        }}
      >
        {({ open }) => {
          return (
            <button className="btn btn-accent" onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget> */}
    </div>
  );
};

export default About;
