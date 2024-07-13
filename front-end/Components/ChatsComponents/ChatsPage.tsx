'use client'
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import { useSendMessageChange } from "@/contexts/Chats/SendMessageChangeContext";
import { useLimitChatChange } from "@/contexts/Chats/LimitChatChangeContext";
import Sidebar from "../Sidebar";
import SidebarChats from "./SidebarChats";
import Chat from "./Chat";
import { CiMenuFries } from "react-icons/ci";
import { BsChatDots } from "react-icons/bs";
import { useSocket } from "@/contexts/SocketContext";

const ChatPage = () => {
  const params = useParams();
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const onlines = auth ? auth.onlineUsers : null;
  const loading = auth ? auth.loading : true;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const [chatData, setChatData] = useState<any>([]);
  const [noData, setNoData] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatDataLoading, setChatDataLoading] = useState(false);
  const [sendMessageChange, setSendMessageChange] = useSendMessageChange();
  const [limitChat, setLimitChat] = useLimitChatChange();
  const [socket,setSocket] = useSocket()
  const getChat = useCallback(async () => {
    if (!params.chatId || !user) return;

    setChatLoading(true);
    try {
      const token = Cookies.get("token");

      // تعيين chatId للمستخدم
      await fetch(`http://localhost:5000/api/users/setChatId/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId: params.chatId }),
      });

      // جلب بيانات الشات
      const res = await fetch(
        `http://localhost:5000/api/messages/${params.chatId}?limit=${limitChat}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          next: { revalidate: 3600 }, // إعادة التحقق من البيانات كل ساعة
        }
      );

      if (!res.ok) throw new Error("Failed to fetch chat data");

      const data = await res.json();
      setChatData((prevData:any) =>
        prevData && prevData === data ? prevData : data
      );
      if (
        data.message === "Chat not found or user not authorized" ||
        data.message === "Invalid chatId"
      ) {
        setNoData(true);
      }

      setChatLoading(false);
      setChatDataLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      setChatData([]);
      setChatLoading(false);
      setChatDataLoading(false);
    }
  }, [params.chatId, limitChat]);

  useEffect(() => {
    const fetchData = async () => {
      await getChat();
    };
    fetchData();
  }, [getChat, params.chatId, sendMessageChange, limitChat]);
  useEffect(()=>{
    // console.log('test socket newMesg')
    // console.log(socket)
    socket?.on("newMessage",(savedMessage:any)=>{
      // console.log('please work')
      // console.log(savedMessage,'saved')
      if(chatData && chatData.messages){
        const newDat = {
          chat:chatData.chat,
          messages:[...chatData.messages,savedMessage],
          success:chatData.success,
          totalMessages:chatData.totalMessages
        }
       setChatData(newDat)
      }
    })
  },[sendMessageChange, user, limitChat, socket, chatData])
  useEffect(() => {
    if (!params.chatId && user) {
      const setNoChatId = async () => {
        try {
          await fetch(`http://localhost:5000/api/users/setChatId/${user._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({ chatId: "no-id" }),
          });
        } catch (error) {
          console.error("Error setting no chatId:", error);
        }
      };
      setNoChatId();
    }
  }, [params, params.chatId, user]);

  const loader = () => {
    let conve = false;
    setTimeout(() => {
      conve = true;
    }, 5000);
    if (conve === false) {
      return (
        <div className="w-[100vw] absolute overflow-hidden top-0 left-0 h-screen z-[500] flex justify-center items-center">
          <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    if (conve === true) {
      return router.push("/login");
    }
  };

  return (
    <>
      {!Cookies.get("token") && loading === false && !user ? (
        router.push("/login")
      ) : (
        <>
          <Sidebar User={user} />
          <main className="bg-primary border-2 max-sm:w-[98%] border-accent rounded-xl font-arabic w-[77%] max-lg:w-[99%] max-h-[1920px]">
            <span
              className="lg:hidden md:max-w-[70%] px-4 pt-3 flex gap-2 justify-end mb-4 items-center w-[100%] cursor-pointer"
              onClick={() => setActiveSidebar(!activeSidebar)}
            >
              <span className="text-white">Show sidebar</span>
              <CiMenuFries className="text-white text-xl" />
            </span>
            <div className="flex flex-row justify-between">
              <div className="max-w-[27%] w-[27%]">
                <SidebarChats chatLoading={chatLoading} />
              </div>
              <div className="max-w-[73%] flex-grow">
                {chatDataLoading ? (
                  <div className="w-[99.9vw] lg:w-[98vw] absolute flex-col gap-y-2 top-0 left-0 overflow-hidden h-[100vh] bg-black z-[500] flex justify-center items-center">
                    <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    Did you know that the chat data is loading? 🙂
                  </div>
                ) : chatData && params.chatId ? (
                  <Chat
                    chatData={chatData}
                    noData={noData}
                    setChatData={setChatData}
                    chatLoading={chatLoading}
                  />
                ) : (
                  <div className="h-[95vh] border border-accent rounded-xl max-lg:h-[90vh] flex flex-col justify-center items-center text-white">
                    <BsChatDots className="text-6xl mb-4" />
                    <h1 className="text-2xl font-bold">Welcome to the Chat</h1>
                    <p className="text-lg mt-2">
                      Select a conversation to start chatting
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default ChatPage;
