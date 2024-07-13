import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoMdSend, IoMdAttach } from "react-icons/io";
import Cookies from "js-cookie";
import moment from "moment";
import { MdBlock } from "react-icons/md";
import { useSendMessageChange } from "@/contexts/Chats/SendMessageChangeContext";
import { BsLock } from "react-icons/bs";
import { useChangeAuth } from "@/contexts/ChangeContext";
import { useLimitChatChange } from "@/contexts/Chats/LimitChatChangeContext";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { formatDate, formatTime, isNewDay } from "@/Actions/utils";
import MessageList from "./MessageList";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Link from "next/link";
const Chat = ({ chatData, chatLoading,noData }: any) => {
  let messages = chatData?.messages;
  const auth = useAuth();
  let totalMessages = chatData?.totalMessages;
    const messageRef = useRef<HTMLDivElement>(null);

  const user = auth ? auth.user : null;
  const [sendMessageChange, setSendMessageChange] = useSendMessageChange();
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(false);
  const usern = Array.isArray(chatData.chat?.participants)
    ? chatData.chat?.participants.filter((pak: any) => pak?._id !== user?._id)
    : [];
  const [message, setMessage] = useState("");
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imageFile,setImageFile] = useState<any>()
  const [imagePreview,setImagePreview] = useState<any>()
  const modalRef = useRef<HTMLDivElement | null>(null);
  const onlines = auth ? auth.onlineUsers : null;
     const handleImageChange = (e: any) => {
       const file: any = e.target.files?.[0];

       if (file) {
         const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
         if (!validImageTypes.includes(file.type)) {
           NotificationManager.error("Please select a valid image file (jpeg, png, gif)");
           return;
         }

         setImageFile(file);
         const imageUrl = URL.createObjectURL(file);
         setImagePreview(imageUrl);

         return () => {
           URL.revokeObjectURL(imageUrl);
         };
       }
     };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleClickOutside = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setActiveModel(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [blockLoading, setBlockLoading] = useState(false);

  const blockUser = async () => {
    setBlockLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/block/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            blockerId: usern[0]._id,
            block: "true",
          }),
        }
      );
      const data = await res.json();
      if (data && data.message === "Block status updated") {
        NotificationManager.success("Block status updated");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Block Error:", error);
    } finally {
      setBlockLoading(false);
    }
  };
  const unBlockUser = async () => {
    setBlockLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/block/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            blockerId: usern[0]._id,
            block: "false",
          }),
        }
      );
      const data = await res.json();
      if (data && data.message === "Block status updated") {
        NotificationManager.success("Block status updated");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Unblock Error:", error);
    } finally {
      setBlockLoading(false);
    }
  };
    // const maxWidth = messageRef.current
    //   ? messageRef?.current?.offsetWidth * 0.82
    //   : 300; 
      const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
    useEffect(()=>{
      setMaxWidth(
        messageRef.current ? messageRef?.current?.offsetWidth * 0.82 : 300
      );
    },[messageRef])
const sendMessage = async (e: any) => {
  
  e.preventDefault();
  if (!user || !usern[0]._id) {
    return NotificationManager.error("Something went wrong");
  }
  if (!message || !usern[0]._id || !user || !user._id) {
    return NotificationManager.error("Something went wrong");
  }
  setSendMessageLoading(true);

  const formData = new FormData();
  if (imageFile) formData.append("imageUrl", imageFile);
  formData.append("senderId", user._id);
  formData.append("reciverId", usern[0]._id);
  formData.append("content", message);
  
  try {
    const res = await fetch(
      `http://localhost:5000/api/messages/${chatData.chat._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    
    if (data.success === false) {
      NotificationManager.error(data.message);
      setMessage("");
      setImagePreview(null)
      setImageFile(null)
    } else {
      setSendMessageChange("tes" + Math.floor(Math.random() * 1000));
      setMessage("");
      setImagePreview(null)
      setImageFile(null)
    }
  } catch (error) {
    console.error("Send Message Error:", error);
    NotificationManager.error("Failed to send message");
  } finally {
    setSendMessageLoading(false);
  }
};
    const [activeModelS, setActiveModelS] = useState<boolean>(false);


    return (
      <>
        <div
          className={`h-screen w-[100vw] bg-black/20 overflow-hidden z-[61] flex justify-center items-center fixed top-0 left-0  ${
            activeModel ? "flex" : "hidden"
          }`}
        >
          <div
            ref={modalRef}
            className="min-w-[400px] max-sm:min-w-[300px] gap-y-2 p-4 min-h-[300px] bg-primary rounded-lg flex flex-col items-center"
          >
            <Image
              src={
                noData
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WQTIyI3gDR7pusOaPAIGJKzMZ9aUxcfsJQ&s"
                  : usern[0] &&
                    usern[0].image &&
                    usern[0]?.image.startsWith("http")
                  ? usern[0]?.image
                  : `http://localhost:5000/${usern[0]?.image}`
              }
              width={100}
              height={100}
              className="rounded-lg"
              alt="jamal"
            />
            <h2 className="text-2xl">
              {noData ? "UnKnown User" : usern[0]?.name}
            </h2>
            <span>{usern[0]?.email}</span>
            {noData ? null : (
              <div className="flex-1 justify-center flex-col gap-y-3 flex items-center">
                <button
                  onClick={() => {
                    if (blockLoading === false) {
                      return blockUser();
                    }
                  }}
                  disabled={blockLoading}
                  className="bg-accent flex gap-2 items-center justify-center px-4 py-2.5 cursor-pointer hover:bg-accent/80 transition-all  rounded-xl"
                >
                  {blockLoading ? (
                    <div className="w-[100%] flex justify-center items-center">
                      <div className="w-[25px] h-[25px] border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <MdBlock className="text-2xl" /> Block
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveModel(false)}
                  className="bg-accent px-4 py-2.5 cursor-pointer hover:bg-accent/80 transition-all  rounded-xl"
                >
                  Back to chat
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-[95vh] xl:max-h-[1120px] max-lg:h-[90vh] max-h-[100%] flex flex-col justify-between">
          {chatLoading && !chatData && !usern ? (
            <div className="w-full h-full flex justify-center items-center">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* معلومات المستخدم */}
              <div
                className="w-full border-l py-4 border-accent max-lg:border-t
        flex justify-between px-8 items-center"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      noData
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WQTIyI3gDR7pusOaPAIGJKzMZ9aUxcfsJQ&s"
                        : usern[0]?.image?.startsWith("http")
                        ? usern[0]?.image
                        : `http://localhost:5000/${usern[0]?.image}`
                    }
                    width={50}
                    height={50}
                    alt="jamal"
                    className="rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <Link href={`/friends/${usern[0]?._id}`} className="text-lg">
                      {noData ? "Unknown User" : usern[0]?.name}
                    </Link>
                    {noData ? null : (
                      <span className={`${onlines.includes(usern[0]?._id) ? "text-green-500" : "text-red-500"} text-sm`}>
                        {onlines.includes(usern[0]?._id) ? "Online" : "Offline"}
                      </span>
                    )}
                  </div>
                </div>
                {noData ? null : (
                  <div
                    onClick={() => setActiveModel(true)}
                    className="bg-accent cursor-pointer hover:bg-accentHover px-4 py-2 rounded-xl flex justify-center items-center"
                  >
                    More Details
                  </div>
                )}
              </div>
              {/* محتوى الدردشة */}
              <div
                className={`flex-1  h-max max-w-[100%] overflow-auto overflow-x-hidden pb-1 
          border border-accent ${noData && "flex justify-center items-center"}`}
                ref={messageRef}
              >
                {noData ? (
                  <h1 className="text-2xl">Sorry but there is no data here</h1>
                ) : (
                  <MessageList
                    totalMessages={totalMessages}
                    messages={messages}
                    user={user}
                    maxWidth={maxWidth}
                    usern={usern}
                    activeModel={activeModelS}
                    chatLoading={chatLoading}
                    setActiveModel={setActiveModelS}
                  />
                )}

                <div />
              </div>
            </>
          )}
          {/* إدخال الرسالة */}
          {user?.blockList.includes(usern[0]?._id) ? (
            <div className="w-full  border-accent  gap-2 text-red-500 border-l py-3 flex items-center justify-center px-2">
              <button
                onClick={() => {
                  if (blockLoading === false) {
                    return unBlockUser();
                  }
                }}
                className="bg-red-400 text-white flex gap-2 items-center justify-center px-4 py-1.5 cursor-pointer hover:bg-red-500/80 transition-all  rounded-xl"
              >
                {blockLoading ? (
                  <div className="w-[100%] flex justify-center items-center">
                    <div className="w-[25px] h-[25px] border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "UnBlock"
                )}
              </button>
              <MdBlock className="text-xl" />
              You are blocked this user
            </div>
          ) : usern[0]?.blockList?.includes(user?._id) ? (
            <div className="w-full  border-accent  gap-2 text-red-500 border-l py-3 flex items-center justify-center px-2">
              <MdBlock className="text-xl" />
              You are blocked By {usern[0]?.name}
            </div>
          ) : (
            <form
              onSubmit={(e: any) => sendMessage(e)}
              className="w-full  border-accent border-l relative py-3 flex items-center justify-center px-2"
            >
              {imageFile && imagePreview && (
                <div className="absolute bottom-[100%] left-[30%] translate-x-[30%] w-[400px] h-[330px] max-h-[330px] flex justify-center items-center p-2 bg-primary border-accent border">
                  <img alt="te" src={imagePreview} className="max-h-[300px]" />
                </div>
              )}
              <textarea
                className="max-h-[100px] flex-1 py-2 px-3 focus:outline-none active:outline-none 
            border-[3px] border-transparent bg-gray-700 focus:border-accent  active:border-accent  rounded-lg mr-2"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={
                  sendMessageLoading ||
                  user?.blockList.includes(usern[0]?._id) ||
                  noData
                }
                maxLength={200}
              />
              <label
                htmlFor="imageUp"
                className="bg-accent py-2 text-white flex justify-center items-center px-2 rounded-sm cursor-pointer"
              >
                <IoMdAttach className="text-2xl" />
                <input
                  type="file"
                  className="hidden"
                  id="imageUp"
                  name="imageUp"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={
                    sendMessageLoading ||
                    user?.blockList.includes(usern[0]?._id) ||
                    noData
                  }
                />
              </label>
              <button
                type="submit"
                disabled={
                  sendMessageLoading ||
                  user?.blockList.includes(usern[0]?._id) ||
                  noData
                }
                className="bg-accentHover w-[45px] h-[45px] rounded-full flex justify-center items-center ml-2"
              >
                {sendMessageLoading ? (
                  <div className="w-[100%] flex justify-center items-center">
                    <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <IoMdSend className="text-white text-xl" />
                )}
              </button>
            </form>
          )}
        </div>
      </>
    );
};

export default Chat;
