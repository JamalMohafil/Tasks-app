"use client";
import React, { useCallback } from "react";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
const FriendReqs = ({
  friendReqsData,
  setFriendReqsData,
  loadingFriendReqs,
}: any) => {
  const router = useRouter()
  const acceptReq = async (i: number, id: any) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/respondToFriendRequest/${id}`,
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({ response: "accept" }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      if (data.success) {
          const newFriendReqsData = friendReqsData.filter(
            (item: any) => item.user._id !== id
          );

          // Update the state with the new data
          setFriendReqsData(newFriendReqsData);

      }
      if (data.success && data.rejected === true) {
        toast.success("Friend request rejected");
            const newFriendReqsData = friendReqsData.filter(
              (item: any) => item.user._id !== id
            );

            // Update the state with the new data
            setFriendReqsData(newFriendReqsData);
      }
      if (data.success && data.rejected === false) {
        toast.success("Friend request accepted");

        // Filter the friend request data to remove the accepted request
        const newFriendReqsData = friendReqsData.filter(
          (item:any) => item.user._id !== id
        );

        // Update the state with the new data
        setFriendReqsData(newFriendReqsData);

   
      }

    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const rejectReq = async (i: number, id: any) => {
    setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/respondToFriendRequest/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({ response: "reject" }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        if (data.success) {
               const newFriendReqsData = friendReqsData.filter(
                 (item: any) => item.user._id !== id
               );

               // Update the state with the new data
               setFriendReqsData(newFriendReqsData);

        }

        if (data.success && data.rejected === true) {
          toast.success("Friend request rejected");
                const newFriendReqsData = friendReqsData.filter(
                  (item: any) => item.user._id !== id
                );

                // Update the state with the new data
                setFriendReqsData(newFriendReqsData);
        }
        if (data.success && data.rejected === false) {
          toast.success("Friend request accepted");
                const newFriendReqsData = friendReqsData.filter(
                  (item: any) => item.user._id !== id
                );

                // Update the state with the new data
                setFriendReqsData(newFriendReqsData);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }, 1000);
  };

  return (
    <div
      className="w-[100%] overflow-y-auto max-h-[90vh] min-h-[80vh] border border-accent flex flex-col
       items-center justify-start p-3 gap-y-4 rounded-lg"
    >
      <h1 className="text-2xl text-accent mb-1">Friend Requests</h1>
      {loadingFriendReqs ? (
        <div className="w-[100%] flex justify-center items-center">
          <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : friendReqsData !== null && friendReqsData.length > 0 ? (
        friendReqsData.map((item: any, i: number) => (
          <>
            <div
              key={item.user._id}
              className="w-[100%] max-w-[400px] max-[460px]:h-[130px] max-[460px]:gap-1 h-[70px] px-3 py-2 flex justify-between border border-accent rounded-xl items-center gap-2 flex-wrap"
            >
              <div className="w-[65%] max-[460px]:w-full flex justify-center items-center gap-2">
                <Image
                  src={
                    item.user.image.startsWith("http")
                      ? item.user.image
                      : `http://localhost:5000/${item.user.image}`
                  }
                  width={55}
                  height={55}
                  alt=""
                  className="rounded-full"
                />
                <div>
                  <h2>{item.user.name}</h2>
                  <span className="block max-[460px]:inline max-[460px]:w-full break-all">
                    {item.user.email}
                  </span>
                </div>
              </div>
              <div className="max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
                <span
                  className="cursor-pointer bg-green-500 transition-all hover:bg-green-500/70 flex justify-center items-center rounded-full p-2"
                  onClick={() => acceptReq(i, item.user._id)}
                >
                  <FaCheck className="text-white" />
                </span>
                <span
                  className="cursor-pointer bg-red-500 transition-all hover:bg-red-500/70 flex justify-center items-center rounded-full p-2"
                  onClick={() => rejectReq(i, item.user._id)}
                >
                  <IoMdClose className="text-white" />
                </span>
              </div>
            </div>
          </>
        ))
      ) : (
        <h2 className="text-[16px]">No Friend Requests</h2>
      )}
    </div>
  );
};

export default FriendReqs;
