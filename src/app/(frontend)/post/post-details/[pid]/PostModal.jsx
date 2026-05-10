"use client";
import { useEffect, useRef, useState } from "react";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import Image from "next/image";
import blogBanner from "@/assets/blog.svg";
import { Axios } from "@/lib/helpers/AxiosInstance";
import ProgressBar from "@/lib/components/ProgressBar";
import { usePathname, useRouter } from "next/navigation";
import { swalModal } from "@/lib/helpers/swalModal";
import { category } from "@/lib/helpers/constants";

const PostModal = ({
  editItem,
  title = "Edit",
  design = "btn-link text-blue-600",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  let value = editItem && JSON.parse(editItem);
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);
  let router = useRouter();
  let pathname = usePathname();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      inputRef.current?.focus();
    }
  }, [isOpen]);
  //===================================
  let clientAction = async (formData) => {
    formData.append("id", value?._id || "");

    try {
      setLoading(true);
      let { data } = await Axios.post("/api/create-post", formData, {
        onUploadProgress: (progressEvent) => {
          const prog = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(prog);
        },
      });
      if (data?.success) {
        router.refresh(pathname);
        swalModal(data?.message);
      } else {
        swalModal(data?.message, "error");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setProgress(0);
      if (value) setIsOpen(false);
    }
  };

  return (
    <div className="">
      <button
        type="button"
        disabled={loading}
        className={`btn ${design} `}
        onClick={() => setIsOpen(true)}
      >
        {loading ? "Submitting" : title}
      </button>
      {/* modal*/}
      <div
        className={`bg-gray-700/80 w-screen  h-screen fixed top-0 left-0 grid  justify-start  md:justify-center items-start md:items-center z-999 overflow-scroll  ${
          isOpen ? " " : "scale-0"
        }`}
      >
        {/* modal box*/}
        <div
          className={`w-screen max-w-md transition-all duration-1000  shadow-sm shadow-sky-300 p-3 bg-base-100 relative   ${isOpen ? " opacity-100 " : " opacity-0"}`}
        >
          <h4 className="text-start">{title}</h4>
          <div className=" p-2  bg-base-300">
            <div className=" ms-2 pb-1">
              <Image
                src={
                  picture
                    ? URL.createObjectURL(picture)
                    : value
                      ? value?.picture?.secure_url
                      : blogBanner
                }
                alt="image"
                className=" h-50 w-auto object-contain mx-auto"
                height={100}
                width={100}
              />
            </div>
            <Form action={clientAction} className="text-start">
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Select Image
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
                  ref={inputRef}
                  defaultValue={value?.title}
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
                  className="input"
                >
                  <option value={""}>
                    {value?.category || "Select Category"}
                  </option>
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
                  defaultValue={value?.post}
                  rows={6}
                  className="input"
                  type="text"
                  name="post"
                  // value={inputval.post}
                  placeholder="Enter post description"
                  required
                />
              </div>

              <div className="mt-3">
                <ProgressBar progress={progress} color={"bg-blue-400"} />
                <SubmitButton design={"btn-primary w-full"} />
              </div>
            </Form>
            <div className="my-2">
              <button
                type="button"
                className="btn  btn-error btn-circle absolute top-1 right-4"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
