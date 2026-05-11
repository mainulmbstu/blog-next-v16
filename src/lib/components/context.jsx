"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getTokenData } from "../helpers/getTokenData";
import { useRouter } from "next/navigation";
import { swalModal } from "../helpers/swalModal";
import { signOut } from "@/app/(frontend)/user/login/social/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(Cookies.get("token"));
  const [loginExpireTime, setLoginExpireTime] = useState(0);
  // const [loginExpireTime, setLoginExpireTime] = useState(24 * 60 * 60 * 1000);
  let router = useRouter();

  let getUserInfo = async () => {
    if (token) {
      let tokenData = await getTokenData(token);
      setUserInfo(tokenData?.userInfo);
      setLoginExpireTime(tokenData?.loginExpireTime ?? 24 * 60 * 60 * 1000);
    } else {
      setUserInfo(null);
    }
  };

  //================
  let logout = () => {
    signOut();
    Cookies.remove("token");
    setUserInfo(null);
    setToken(null);
    router.refresh("/");
    swalModal("You have been logged out", "success", false);
  };
  //=================================
  let autoLogout = () => {
    if (!loginExpireTime) return;
    const timeoutId = setTimeout(() => {
      logout();
    }, loginExpireTime - Date.now());

    return () => clearTimeout(timeoutId);
  };
  useEffect(() => {
    token && getUserInfo();
    autoLogout();
  }, [token, loginExpireTime]);
  //=======================

  return (
    <AuthContext
      value={{
        userInfo,
        setUserInfo,
        getUserInfo,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);
