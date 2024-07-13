// SignIn.tsx
'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LoginAction } from "@/Actions/login";
import signinimg from "@/public/assets/auth/signin.svg";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SigninAction } from "@/Actions/signin";

const SignIn = () => {
  const [loading,setLoading] = useState<boolean>(false)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },2000)
    SigninAction(e);
  };

  return (
    <div className="flex items-center justify-center relative overflow-hidden w-[100%] p-4 gap-7 xl:flex-row">
      <div className="xl:w-2/5 max-sm:hidden xl:relative max-xl:absolute max-xl:left-[-20%] max-xl:top-[52%] max-xl:w-[400px] max-xl:rotate-12 -z-1 ">
        <Image src={signinimg} alt="sign in" width={400} height={400} />
      </div>
      <motion.div
        className=" max-sm:max-w-[100%] bg-primary z-10 border border-accentHover max-sm:w-[100%] p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-6">
          SignIn
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-accent mb-2">
              Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
              maxLength={30} // تحديد الحد الأقصى للأحرف
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-accent mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-accent mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-accent mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-accent mb-2">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-accent hover:bg-purple-700 text-white font-semibold rounded-md transition duration-300"
          >
            {loading ? (
              <div className="w-[100%] flex justify-center items-center">
                <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
