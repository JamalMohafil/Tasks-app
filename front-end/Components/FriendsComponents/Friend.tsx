"use client";
import React, { useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Friend = ({ friends, setFriends, loading, user }: any) => {
  const router = useRouter();
  const CreateChat = async (usern: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          participants: [user?._id, usern],
        }),
      });
      const data = await res.json();
      if (data && data.success === true) {
        router.push(`/chats/${data.chatId}`);
      }
    } catch (e) {
      router.push("/chats");
      console.log(e);
    }
  };
  const removeFriend = async (id: string) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/users/deleteFriend/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data && data.success === true) {
        toast.success('Removed friend successfully');
        setFriends(friends.filter((item: any) => item._id !== id));
      }
    } catch (e) {
      toast.error('Failed to remove friend');
      console.log(e);
    }
  };
  return (
    <div
      className="w-[100%] overflow-y-auto max-h-[90vh] min-h-[80vh] border border-accent flex flex-col
       items-center justify-start p-3 gap-y-4 rounded-lg"
    >
      <h1 className="text-2xl text-accent mb-1">Friends Page</h1>
      {loading ? (
        <div className="w-[100%] flex justify-center items-center">
          <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : friends !== null && friends.length > 0 ? (
        friends.map((item: any, i: number) => (
          <>
            <Link href={`/friends/${item._id}`}
              key={item._id}
              className="w-[100%] max-w-[540px] max-[460px]:h-[130px] max-[460px]:gap-1 h-[70px] px-3 py-2 flex justify-around border border-accent rounded-xl items-center gap-2 flex-wrap"
            >
              <div className=" max-[460px]:w-full flex justify-center items-center gap-2">
                <Image
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000/${item.image}`
                  }
                  width={55}
                  height={55}
                  alt=""
                  className="rounded-full"
                />
                <div>
                  <h2>{item.name}</h2>
                  <span className="block max-[460px]:inline max-[460px]:w-full break-all">
                    {item.email}
                  </span>
                </div>
              </div>
              <div className="max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
                <span
                  onClick={() => CreateChat(item._id)}
                  className="cursor-pointer bg-accent transition-all
               hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                >
                  Message
                </span>
                <span
                  onClick={() => removeFriend(item._id)}
                  className="cursor-pointer bg-red-500 transition-all
               hover:bg-red-500/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                >
                  Remove
                </span>
              </div>
            </Link>
          </>
        ))
      ) : (
        <h2 className="text-[16px]">No Friends</h2>
      )}
    </div>
  );
};

export default Friend;
