"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const loginAction = async (formData) => {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })

  let social = formData.get("social");
  let email = formData.get("email");
  let password = formData.get("password");
  let tokenExpire = 24 * 60 * 60;

  // in seconds
  await dbConnect();
  try {
    if (!social) {
      if (!email || !password)
        throw new Error("Please enter all required fields");
    }
    const user = await UserModel.findOne({ email });

    if (!user) throw new Error("User does not exist");

    if (!social) {
      let passMatch = await bcrypt.compare(
        password,
        user.password ?? process.env.JWT_KEY,
      );
      if (!passMatch) throw new Error("Wrong credentials");
    }

    if (!user.isVerified) throw new Error("Email is not verified");

    const userInfo = await UserModel.findOne({ email }, { password: 0 });
    let token = jwt.sign(
      { userInfo, loginExpireTime: Date.now() + tokenExpire * 1000 },
      process.env.JWT_KEY,
    );

    (await cookies()).set("token", token, {
      // httpOnly: true,
      maxAge: tokenExpire,
    }); // expiry time in second
    return {
      success: true,
      message: `Login successful `,
      token,
      userInfo: JSON.stringify(userInfo),
    };
  } catch (error) {
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
