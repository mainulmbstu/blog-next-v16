"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/components/context";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { editPostAction, postDetailsAction } from "./action";
import { useParams } from "next/navigation";
import { category } from "@/lib/helpers/categoryData";
import Image from "next/image";

const EditCommentModal = ({ post }) => {
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  // let subCommentAction = commentAction.bind(null, pid, "mmm");
  let clientAction = async (formData) => {
    setLoading(true);
    let data = await editPostAction(post?.id, formData);
    setLoading(false);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="EditCommentModal" className="btn btn-link">
        {loading ? "Submitting" : "Edit post"}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="EditCommentModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit your post</h3>
          <div className="mb-4 ms-2 flex justify-evenly">
            <div className="">
              <Image
                src={picture ? URL.createObjectURL(picture) : post?.picture}
                alt="image"
                className=" h-50 w-auto object-contain"
                height={100}
                width={100}
              />
            </div>
          </div>
          <Form
            action={clientAction}
            className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
          >
            <div className="mt-3">
              <label className="block" htmlFor="name">
                Select post Image
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
                defaultValue={post?.title}
                className="input"
                type="text"
                id="title"
                name="title"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="title">
                Select Category
              </label>
              <select
                // defaultValue={post?.category}
                name="category"
                className="select w-full"
              >
                <option value={post?.category}>{post?.category}</option>
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
                defaultValue={post?.post}
                className=" w-full min-h-12 bg-white p-2 border-0"
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
          <div className="modal-action">
            <label
              htmlFor="EditCommentModal"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </label>
            {/* <label
              // onClick={clientAction}
              htmlFor="EditCommentModal"
              className="btn btn-error"
            >
              Close
            </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCommentModal;
