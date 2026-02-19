"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/components/context";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { commentAction } from "./action";

const CommentModal = ({ pid, parentId }) => {
  let [loading, setLoading] = useState(false);
  let [comment, setComment] = useState("");

  // let subCommentAction = commentAction.bind(null, pid, "mmm");
  let clientAction = async () => {
    if (!comment) return Swal.fire("Error", "Comment cannot be blank", "error");
    setLoading(true);
    await commentAction(pid, comment, parentId);
    setLoading(false);
    setComment("");
  };
  return (
    <div>
      {/* The button to open modal */}
      {/* <label htmlFor="my_modal_6" className="btn btn-success">
        {loading ? "Submitting" : "Comment on this post"}
      </label> */}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="commentModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Comment Box</h3>
          <Form className=" p-4 w-full card">
            <div className="mt-3">
              <label className="block" htmlFor="comment">
                Comment
              </label>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                className="input w-full"
                type="text"
                id="comment"
                name="comment"
                value={comment}
                required
              />
            </div>
          </Form>
          <div className="modal-action">
            <label htmlFor="commentModal" className="btn btn-error">
              Close
            </label>
            <label
              onClick={clientAction}
              htmlFor="commentModal"
              className="btn btn-success"
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
