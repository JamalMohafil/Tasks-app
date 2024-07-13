// src/app/page.tsx
"use client";
import { useAuth } from "../../contexts/AuthContext";
import React from "react";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTasks, FaCheckCircle, FaUsers } from "react-icons/fa";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import { CiMenuFries } from "react-icons/ci";
import Login from "./Login";

const LoginPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();

 
  const handleAllTasksClick = () => {
    router.push("/all-tasks");
  };

  return (
    <>
      {user ? (
        router.push("/")
      ) : (
        <>
          <Sidebar User={user} />
          <main
            className="bg-primary border-2 max-sm:w-[98%] border-accent
      rounded-xl font-arabic h-max w-[88%] 
      max-lg:w-[95%] max-w-[1650px]
       p-4 max-sm:p-0  flex flex-col items-center justify-between lg:justify-center
        max-sm:max-h-[100vh] lg:max-h-[601px] text-white"
          >
            <span
              className="lg:hidden px-4 pt-6 flex gap-2 justify-end mb-4 items-center w-[100%] cursor-pointer"
              onClick={() => {
                setActiveSidebar(!activeSidebar);
              }}
            >
              <span className="text-white">Show sidebar</span>
              <CiMenuFries className="text-white text-xl" />
            </span>
            <Login />
          </main>
        </>
      )}
    </>
  );
};

export default LoginPage;
