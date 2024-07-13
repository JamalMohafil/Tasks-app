'use client'
import React from "react";
import { motion } from "framer-motion";
import { LoginAction } from "@/Actions/login";

const Login = () => {
  return (
    <div className="flex items-center justify-center w-[100%] min-h-screen p-4">
      <motion.div
        className="border-2 border-accentHover max-sm:max-w-[100%] max-sm:w-[100%] p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-accent mb-6">
          Login
        </h2>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          return LoginAction(e);
        }}>
          <div>
            <label htmlFor="email" className="block text-accent mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
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
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div className="flex items-center justify-between max-sm:flex-wrap max-sm:flex-col max-sm:gap-y-3">
            <label className="flex items-center text-accent max-sm:w-[100%]">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-accent"
              />
              <span className="ml-2">remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-accent hover:underline max-sm:w-[100%]"
            >
              Need help?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-accent hover:bg-purple-700 text-white font-semibold rounded-md transition duration-300"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
