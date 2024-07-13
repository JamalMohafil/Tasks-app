import Footer from "@/Components/Footer";
import IsLogin from "@/Components/HomePage";
import Sidebar from "@/Components/Sidebar";
import Image from "next/image";
import { ThemeSwitcher } from "./themeSwitcher";
  let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjcyOTIwNTY3MTA2MmE3M2RlNzkxMTciLCJpYXQiOjE3MTg3ODQ1MTgsImV4cCI6MTcyNjU2MDUxOH0.0d_b2HUxv8QMk4iFs6BBk7Rm7c71Om6S488hj8gvFBw`;

export default function  Home() {
 
  return (
    <>
      <div className="bg-accentBg px-10 max-sm:px-3 max-[360px]:px-1 py-4 justify-center max-h-[1620px]  flex items-start gap-10">
        <IsLogin />
      </div>
      <Footer />
    </>
  );
}
