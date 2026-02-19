"use client";

import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ title, design, disable }) => {
  let { pending } = useFormStatus();
  return (
    <button
      disabled={pending || disable}
      className={`btn w-full disabled:text-black ${design}`}
    >
      {" "}
      {pending ? "Submitting..." : title}{" "}
    </button>
  );
};

export default SubmitButton;
