// BtnsSidebar.tsx
"use client"
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie
import { useRouter } from "next/router"; // استيراد useRouter من next/router

const BtnsSidebar = ({ User }: { User: any }) => {
  const router = useRouter();

  const handleSignOut = () => {
    Cookies.remove("token"); // إزالة الكوكيز باستخدام js-cookie
    router.reload();
  };

  const handleSignIn = () => {
    Cookies.set(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjcyYTc2NjY0YTM0NTVkNmJiNDA1YmQiLCJpYXQiOjE3MTg3OTA3MTIsImV4cCI6MTcyNjU2NjcxMn0.f7SKQE68Ia_Gkjuhg3sJ3Lbwwfkmm7DCtQMurvtYZaQ"
    );
  };

  return (
    <>
      {/* Section for Sign Out */}
      {User ? (
        <div
          className="text-white flex gap-2 justify-center items-center rounded-lg px-2 py-3 bg-accent mx-4 cursor-pointer mb-4"
          onClick={handleSignOut}
        >
          <FaSignOutAlt />
          <span>Sign out</span>
        </div>
      ) : (
        <div
          className="text-white flex gap-2 justify-center items-center rounded-lg px-2 py-3 bg-accent mx-4 cursor-pointer mb-4"
          onClick={handleSignIn}
        >
          <IoMdLogIn />
          <span>Sign in</span>
        </div>
      )}
    </>
  );
};

export default BtnsSidebar;
