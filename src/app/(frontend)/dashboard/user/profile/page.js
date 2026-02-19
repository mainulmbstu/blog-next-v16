import React from "react";
import Profile from "@/app/(frontend)/dashboard/admin/profile/Profile";

export const metadata = {
  title: "Profile",
  description: "User Profile page",
};
const UserProfile = async () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default UserProfile;
