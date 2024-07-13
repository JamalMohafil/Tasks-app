// src/app/page.tsx
"use client";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTasks, FaCheckCircle, FaUsers } from "react-icons/fa";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import { CiMenuFries } from "react-icons/ci";

const IsLogin = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();

  const handleAllTasksClick = () => {
    router.push("/all-tasks");
  };
  return (
    <>
      <Sidebar User={user} />
      <main
        className="bg-primary border-2 border-accent
      rounded-xl font-arabic h-max w-[88%] 
      max-lg:w-[95%] max-w-[1650px]
       p-4 flex flex-col items-center justify-between max-xl:min-h-screen xl:min-h-[800px] text-white"
      >
        <span
          className="lg:hidden flex gap-2 justify-end mb-4 items-center w-[100%] cursor-pointer"
          onClick={() => {
            setActiveSidebar(!activeSidebar);
          }}
        >
          <span className="text-white">Show sidebar</span>
          <CiMenuFries className="text-white text-xl" />
        </span>
        <motion.div
          className="text-center flex-grow items-center  flex flex-col justify-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to tasks maneger</h1>
          <p className="text-lg mb-8">
            Görevler uygulaması, günlük ve profesyonel görevlerinizi yönetmek ve
            düzenlemek için mükemmel bir çözümdür. Uygulama, ilerlemenizi takip
            etmenize ve hedeflerinize verimli ve etkili bir şekilde ulaşmanıza
            yardımcı olur.
          </p>
          <button
            onClick={handleAllTasksClick}
            className="px-6 py-2 bg-accent max-w-[400px] hover:bg-[#5e20ce] text-white font-semibold rounded-md transition duration-300"
          >
            Go to tasks
          </button>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="hover:scale-105 transition-all bg-gray-800 p-6 rounded-lg border-2 border-accent text-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <FaTasks size={50} className="mb-3 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">إدارة المهام</h2>
              <p>
                تتبع جميع مهامك في مكان واحد، وقم بتصنيفها وإعطاء أولويات لها.
              </p>
            </motion.div>
          </div>
          <div className="hover:scale-105 transition-all bg-gray-800 p-6 rounded-lg border-2 border-accent text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <FaCheckCircle size={50} className="mb-3 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">متابعة التقدم</h2>
              <p>
                راقب تقدمك اليومي وحقق أهدافك بكفاءة عالية من خلال تقارير دورية.
              </p>
            </motion.div>
          </div>
          <div className="hover:scale-105 transition-all bg-gray-800 p-6 rounded-lg border-2 border-accent text-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <FaUsers size={50} className="mb-3 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">التعاون الجماعي</h2>
              <p>شارك مهامك وتعاون مع فريقك لتحقيق أفضل النتائج معاً.</p>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default IsLogin;
