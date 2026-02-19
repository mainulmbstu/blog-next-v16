"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Axios } from "../helpers/AxiosInstance";
import { getTokenData } from "../helpers/getTokenData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(Cookies.get("token"));
  // console.log(userInfo ? "true" : "false");
  // let getUserInfo = async () => {
  //   if (token) {
  //     let res = await Axios.get(`api/get-user?token=${token}`);
  //     if (res?.status === 200) {
  //       setUserInfo(res?.data);
  //     }
  //   } else {
  //     setUserInfo("");
  //   }
  // };
  let getUserInfo = async () => {
    if (token) {
      let tokenData = await getTokenData(token);
      setUserInfo(tokenData);
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    token && getUserInfo();
  }, [token]);

  return (
    <AuthContext
      value={{
        userInfo,
        setUserInfo,
        getUserInfo,
        setToken,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);
