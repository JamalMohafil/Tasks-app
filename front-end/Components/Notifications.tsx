"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import Cookies from "js-cookie";
import { useChangeNoti } from "@/contexts/Notifications/ChangeNotiContext";
import { IoMdCloseCircle } from "react-icons/io";
import moment from "moment";
import { formatDateNoti } from "@/Actions/utils";
import { useLimitNoti } from "@/contexts/Notifications/UpdateLimitNotiContext";
import { useNoti } from "@/contexts/Notifications/NotiContext";

const Notifications = ({ notis, setNotis, notifics }: any) => {
    const { loading, loadNotis } = useNoti();

  const [changeNoti, setChangeNoti] = useChangeNoti();
  const containerRef = useRef<HTMLDivElement>(null);
  const [newNotis,setNewNotis] = useState([])
  useEffect(() => {
    if (notifics) {
      setNewNotis(notifics.notifications);
    }
  }, [notifics]);
  const clickAction = async (i: number,notificSeen:any) => {
    if (notificSeen === true) return;
      const res = await fetch(
        `http://localhost:5000/api/notifications/seen/${notifics.notifications[i]._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
        setChangeNoti("tgd" + Math.floor(Math.random() * 12).toString());

  };
  const SeeAll = async () => {
    const res = await fetch(
      `http://localhost:5000/api/notifications/seenAll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    setChangeNoti("tgd" + Math.floor(Math.random() * 12).toString());
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setNotis(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [limitNoti, setLimitNoti] = useLimitNoti()
 
  return (
    <div
      className={`duration-300 transition-all bg-black/35 z-[51] h-screen w-screen justify-center items-center flex fixed top-0
        ${notis ? "opacity-100 left-0" : "opacity-0 left-[-150%]"}`}
    >
      <span className="absolute left-[3%] bg-white rounded-full top-5 cursor-pointer">
        <IoMdCloseCircle className="text-4xl text-red-600" />
      </span>
      <div
        ref={containerRef}
        className="relative w-max max-h-[90vh] max-md:w-[90%] gap-5 h-auto overflow-y-auto bg-primary rounded-lg
       flex flex-col p-4 pt-16 justify-between py-8 items-start"
      >
        <span
          className="absolute left-5 top-3 cursor-pointer hover:bg-accentHover text-white
         bg-accent py-1 px-3 rounded-lg"
          onClick={() => SeeAll()}
        >
          See All
        </span>
        <div className="flex flex-col gap-4">
          {notifics.notifications.map((notific: any, i: number) => {
            const link = notific?.link || ""; // التحقق من وجود الرابط وإعطاء قيمة افتراضية
            return (
              <div key={i}>
                {link ? (
                  <Link
                    href={notific.link}
                    onClick={() => {
                      clickAction(i,notific.seen);
                    }}
                    className="relative w-max max-w-[700px] flex gap-3 border border-accent items-center justify-center px-4 py-4 rounded-xl shadow-lg"
                  >
                    <span className="p-3 rounded-full bg-accent">
                      <IoMdNotifications className="text-white text-3xl" />
                    </span>
                  
                    <span
                      className={`absolute ${
                        notific.seen === true
                          ? "bg-yellow-500 left-[-3%] p-1"
                          : "bg-red-400 left-[-4.5%] p-0.5 px-1"
                      }  top-[-5%] rounded-full text-[12px] 
                  flex justify-center items-center text-white  `}
                    >
                      {notific.seen === true ? "read" : "unread"}
                    </span>
                    <span className="absolute right-2 text-[12px] top-[4%]">
                      {formatDateNoti(notific.createdAt)}
                    </span>
                    <div>
                      <h2>{notific.title}</h2>
                      <span>{notific.content}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="w-[200px] px-4 py-4 rounded-xl shadow-lg">
                    <h2>{notific.title}</h2>
                    <span>{notific.content}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {loading ? (
            <div className="max-w-[300px] flex justify-center sticky  left-[27%] translate-x-[27%] top-[5%] items-center">
              <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            notifics.notificationsCount > notifics.notifications.length && (
              <div
                onClick={() => {
                  return loadNotis();
                }}
                className="max-w-[300px] cursor-pointer w-max text-center my-4 sticky  left-[32%] translate-x-[32%] top-[5%]"
              >
                <div className="bg-accent hover:bg-accentHover/80 transition-all shadow-lg text-xl shadow-accentHover py-1 px-3 rounded-md">
                  Load More
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
