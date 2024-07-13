// src/app/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import { useRouter } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import Sidebar from "../Sidebar";
import SignIn from "./SignIn";
import Image from "next/image";

const SignInPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();

  

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
       p-4 max-sm:p-0  flex items-center justify-between flex-col lg:justify-center
        max-sm:max-h-[100vh] lg:max-h-[801px] text-white"
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

            <SignIn />
          </main>
        </>
      )}
    </>
  );
};

export default SignInPage;
