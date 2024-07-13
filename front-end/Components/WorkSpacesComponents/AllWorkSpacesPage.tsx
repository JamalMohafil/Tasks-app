"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AllWorkSpaces from "./AllWorkSpaces";
const AllWorkSpacesPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter()
  return (
    <>
      {Cookies.get("token") && user ? (
        <>
          <Sidebar User={user} />
          <main className="bg-primary h-max w-[88%] max-lg:w-[95%] max-w-[1650px]">
            <div className="w-[100%] h-[100%] border-2 border-accent shadow-sm rounded-xl">
              <AllWorkSpaces />
            </div>
          </main>
        </>
      ) : (
        router.push("/login")
      )}
    </>
  );
};

export default AllWorkSpacesPage;
