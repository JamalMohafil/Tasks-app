// AboutUs.tsx
import React from "react";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="flex items-center justify-center relative max-[1280px]:flex-col overflow-hidden w-full p-4 gap-4  xl:flex-row">
      <div className=" xl:flex justify-center items-center">
        <Image
          src={"/assets/user/jamal.webp"}
          width={300}
          height={300}
          alt="Sign in"
        />
      </div>
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-lg leading-relaxed">
          Hello, I am Jamal Mohafil, a 15-year-old developer passionate about
          creating innovative applications to enhance my programming skills.
          This project, the Tasks Application, is my own creation using Next.js
          14 and Express.js.
        </p>
        <p className="text-lg leading-relaxed mt-4">
          The application features advanced functionalities including chat
          capabilities and workspaces, designed to provide a seamless experience
          for managing tasks and collaborating on projects.
        </p>
        <div className="mt-8">
          <p className="text-lg font-bold">Follow me:</p>
          <ul className="flex gap-4 mt-2">
            <li>
              <a
                href="https://www.youtube.com/@jamal_mohafil"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-transparent hover:border-red-500 hover:bg-transparent bg-red-500
                rounded-lg px-3 pt-1 pb-2 transition-all flex justify-center items-center gap-2"
              >
                <FaYoutube className="text-2xl mt-1" />
                Youtube
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/jamal_goving1/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-transparent hover:border-pink-600 hover:bg-transparent bg-pink-600
                rounded-lg px-3 pt-1 pb-2 transition-all flex justify-center items-center gap-2"
              >
                <FaInstagram className="text-2xl mt-1" />
                 Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
