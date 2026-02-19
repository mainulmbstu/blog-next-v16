"use client";

import { useAuth } from "@/lib/components/context";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import blogBanner from "@/assets/blog.svg";
import { category } from "@/lib/helpers/categoryData";
import { Axios } from "@/lib/helpers/AxiosInstance";

const CreatePost = () => {
  const [picture, setPicture] = useState("");
  // let { userInfo } = useAuth();
  let router = useRouter();

  let clientAction = async (formData) => {
    // let data = await createAction(formData);
    let { data } = await Axios.post("/api/create-post", formData);
    if (data?.success) {
      Swal.fire("Success", data?.message, "success");
      router.push("/");
      // toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };

  return (
    <div className=" grid md:grid-cols-2">
      <div className="p-3">
        <Image
          priority={true}
          src={picture ? URL.createObjectURL(picture) : blogBanner}
          alt="image"
          className="h-auto w-full object-contain"
          height={500}
          width={500}
        />
      </div>
      <div className="p-3">
        <Form
          action={clientAction}
          className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
        >
          <div className="mt-3">
            <label className="block" htmlFor="name">
              Select Profile Image
            </label>
            <input
              onChange={(e) => {
                setPicture(e.target.files[0]);
              }}
              className="input"
              type="file"
              id="file"
              name="file"
            />
          </div>
          <div className="mt-3">
            <label className="block" htmlFor="title">
              Title
            </label>
            <input
              className="input"
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter post itle"
            />
          </div>
          <div>
            <label className="block" htmlFor="title">
              Select Category
            </label>
            <select
              // onChange={(e) => roleHandle(e.target.value, id)}
              // defaultValue={'Select Category'}
              name="category"
              className="select w-full"
            >
              {category?.length &&
                category.map((item) => (
                  <option
                    key={item?.name}
                    value={item?.name}
                    disabled={item?.name === "All Category"}
                  >
                    {item?.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-3">
            <label className="block" htmlFor="description">
              Post
            </label>
            <textarea
              className=" w-full min-h-12 p-2 border-0"
              type="text"
              name="post"
              // value={inputval.post}
              placeholder="Enter post description"
              required
            />
          </div>

          <div className="mt-3">
            <SubmitButton title={"Submit"} design={"btn-accent"} />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
