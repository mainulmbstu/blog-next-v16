"use client";

import SubmitButton from "@/lib/components/SubmitButton";
import { auth, socialLogin } from "./auth";
import { useEffect } from "react";
import { Axios } from "@/lib/helpers/AxiosInstance";

const SocialLoginPage = ({ clientAction }) => {
  let loginWithGmail = async () => {
    let gooleData = await auth();

    if (!gooleData) return;
    let formData = new FormData();
    formData.append("google", "google" || "");
    formData.append("name", gooleData?.user?.name || "");
    formData.append("email", gooleData?.user?.email || "");
    formData.append("googleImage", gooleData?.user?.image || "");

    let { data } = await Axios.post("/api/user/register", formData);
    if (data?.success) {
      clientAction(formData);
    }
  };
  useEffect(() => {
    loginWithGmail();
  }, []);

  // console.log(session);
  return (
    <div className=" m-2 ">
      <form action={socialLogin}>
        <div className="mt-3">
          <SubmitButton
            value="google"
            title={"Sign in with google"}
            design={"btn-primary w-full"}
          />
        </div>
        <div className="mt-3">
          <SubmitButton
            value="github"
            title={"Sign in with github"}
            design={"btn-black w-full"}
          />
        </div>
      </form>
    </div>
  );
};

export default SocialLoginPage;
