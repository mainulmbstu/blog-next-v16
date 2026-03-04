import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailer from "@/lib/helpers/nodeMailer";
import { deleteImageOnCloudinary, uploadOnCloudinary } from "@/lib/helpers/cloudinary";
import { revalidateTag } from "next/cache";

export async function POST(req) {
  // await new Promise(resolve => {
  //   setTimeout(resolve, 5000)
  // })
  let formData = await req.formData();

  let name = formData.get("name");
  let email = formData.get("email");
  let password = formData.get("password");
  if (!name || !email || !password) {
    return Response.json({ message: "Please enter all required fields" });
  }
  //for image
  let file = formData.get("file");
    let expireHour = 1
  // in hour
  try {
    await dbConnect();
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
       if (new Date() > userExist?.verifyTokenExpire) {
        await UserModel.findOneAndDelete({ email })
            userExist.picture?.public_id &&
              (await deleteImageOnCloudinary(userExist.picture?.public_id));
      } else {
        
        return Response.json({ message: "User already exist" });
      }
    }
    let url = "";
    if (file?.size) {
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "blognextprofile",
      );
      url = { secure_url, public_id };
    }
    let hashedPass = await bcrypt.hash(password, 10);
    let allUser = await UserModel.find({}).estimatedDocumentCount();
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPass,
      role: allUser ? "user" : "admin",
      verifyTokenExpire: Date.now() +  expireHour * 3600000,
      picture: url && url,
    });
    let verifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
    let credential = {
      email,
      subject: "Registration verification",
      body: `<h2>Hi ${name},</h2>
      <h3>You have been registered successfully in ${process.env.BASE_URL} . Your ID is ${newUser._id}. </h3>
      <p>Click <a href="${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}">Here</a> to verify your email or copy and paste the link below to your browser <p>Link validity: ${expireHour} hour</p> ${process.env.BASE_URL}/user/verify-email?verifyToken=${verifyToken}
      </p>
      
      Thanks for staying with us`,
    };
   await mailer(credential);
    // console.log(verifyToken);
    revalidateTag("user-list", "max");
    return Response.json({
      success: true,
      message: `Registration successful, a verification link has been sent to ${email}, please verify email to access your account `,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
