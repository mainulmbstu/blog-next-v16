"use client";

import SubmitButton from "@/lib/components/SubmitButton";
import { auth, socialLogin } from "./auth";
import { useEffect } from "react";
import { Axios } from "@/lib/helpers/AxiosInstance";

const SocialLoginPage = ({ clientAction }) => {
  let loginWithSocial = async () => {
    let socialData = await auth();

    if (!socialData) return;
    let formData = new FormData();
    formData.append("social", "social" || "");
    formData.append("name", socialData?.user?.name || "");
    formData.append("email", socialData?.user?.email || "");
    formData.append("socialImage", socialData?.user?.image || "");

    let { data } = await Axios.post("/api/user/register", formData);
    if (data?.success) {
      clientAction(formData);
    }
  };
  useEffect(() => {
    loginWithSocial();
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
        <div className="mt-3">
          <SubmitButton
            value="facebook"
            title={"Sign in with facebook"}
            design={"btn-blue w-full"}
          />
        </div>
      </form>
    </div>
  );
};

export default SocialLoginPage;
