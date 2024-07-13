'use client'
import React, { useEffect, useState, useCallback } from "react";
import { FaUserPlus, FaUserClock } from "react-icons/fa";
import { BsChatSquareDots } from "react-icons/bs";
import SingleChat from "./SingleChat";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Search from "./Search";
import { useParams } from "next/navigation";
import { useSendMessageChange } from "@/contexts/Chats/SendMessageChangeContext";

const SidebarChats = ({chatLoading}:any) => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const [chats, setChats] = useState([]);
  const [loading,setLoading] = useState(true)
  const params = useParams()
  const fetchD =async (userId:any) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/chats/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

    
      const data = await res.json();
      setChats((prevChats) =>
        data.chats && data.chats !== prevChats ? data.chats : prevChats
      );
      setLoading(false);
    } catch (error:any) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  }


    const [sendMessageChange,setSendMessageChange] = useSendMessageChange()

  useEffect(() => {
    if (user && user._id && Cookies.get("token")) {
      fetchD(user._id);
    }
  }, [params.chatId, sendMessageChange,user]);
 
  return (
    <>
      <ToastContainer />
      <div className="py-2 w-[100%]">
        {loading ? (
          <div className="w-[100%] flex justify-center items-center">
            <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl px-4 text-accent flex justify-start items-center gap-2 font-bold  w-[100%]">
              <BsChatSquareDots />
              Chats
            </h2>
            <div className="w-full px-4 flex justify-center gap-y-2 items-start mt-3 flex-col">
              <Link
                href={"/friends"}
                className="flex justify-center items-center gap-2 cursor-pointer"
              >
                <span className="border border-gray-400 p-2 w-9 h-9  flex justify-center items-center rounded-full text-accent">
                  <FaUserPlus className=" text-xl " />
                </span>
                Add Friend
              </Link>
              <Link
                className="flex justify-center items-center gap-2 cursor-pointer"
                href={`/friends`}
              >
                <span className="border border-gray-400 p-2 w-9 h-9  flex justify-center items-center rounded-full text-accent">
                  <FaUserClock className=" text-xl " />
                </span>
                Friend Requests
              </Link>{" "}
            </div>
            <Search />
            <hr className="w-full mt-3 border-0 bg-accent h-[1px]" />
            {Array.isArray(chats) &&
              chats.filter((chat:any)=>chat.lasMsg && chat.lasMsg.content).map((chat, i) => (
                <SingleChat key={i} chat={chat} idUser={user?._id} />
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default SidebarChats;
