import Image from "next/image";
import Link from "next/link";
import React from "react";
import Cookies from "js-cookie";
const SingleChat = ({ chat, idUser }: any) => {
  const partici = chat.participants[0].id === idUser ? 1 : 0;
  const formatTime = (timestamp:any) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const makeSeen = async ()=>{
    try {

      const res = await fetch(
        `http://localhost:5000/api/messages/makeSeen/${chat.chatId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    const data = await res.json()

  }catch(e){
    console.log(e)
  }
  }
  let contentMsg = chat?.lasMsg?.content || "";
    contentMsg = contentMsg.split("").join("<wbr>");
  let nameUser = chat?.participants[partici]?.name || "";
    nameUser = nameUser.split("").join("<wbr>");
    console.log(chat)
  return (
    <Link
      href={`/chats/${chat?.chatId ? chat.chatId : ""}`}
      onClick={() => makeSeen()}
      className="w-full px-3 border border-accent hover:bg-white/5 cursor-pointer transition-all flex justify-between items-center py-2"
    >
      <div className="flex items-center gap-2 w-[80%] h-[60px]">
        <Image
          src={`${
            chat.participants[partici].image.startsWith("http")
              ? chat.participants[partici].image
              : `http://localhost:5000/${chat.participants[partici].image}`
          }`}
          width={50}
          height={50}
          alt="Participant image"
          className="rounded-full"
        />
        <div className="flex flex-col justify-center items-start gap-y-1 ">
          <h2
            className="max-w-[100%] max-h-[24px] truncate"
            dangerouslySetInnerHTML={{ __html: nameUser }}
          />
          <span
            className="text-sm max-w-[100%] truncate   max-h-[22px]"
            dangerouslySetInnerHTML={{ __html: contentMsg }}
          />
        </div>
      </div>

      <div className="flex flex-col items-end w-[20%] justify-between h-[55px] relative">
        {chat?.lasMsg?.createdAt && (
          <span className="text-sm w-max">
            {formatTime(chat?.lasMsg?.createdAt)}
          </span>
        )}
        {chat?.unseenMessages?.count > 0 &&
          chat?.unseenMessages.user == idUser && (
            <span
              className={`rounded-full bg-accent text-white w-5 text-sm font-bold h-5 flex justify-center items-center mt-1 ${
                chat?.unseenMessages?.user &&
                chat?.unseenMessages.user !== idUser &&
                "absolute w-0 h-0 overflow-hidden opacity-0 top-[-500%] "
              }${
                chat?.unseenMessages.count === 0 &&
                "overflow-hidden absolute top-[-500%] w-0 h-0 p-0 "
              }`}
            >
              {chat?.unseenMessages.count > 0 && chat?.unseenMessages.count}
            </span>
          )}
      </div>
    </Link>
  );
};

export default SingleChat;
