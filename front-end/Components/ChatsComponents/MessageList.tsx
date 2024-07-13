import React, { useRef, useEffect, useState } from "react";
import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { formatDate, formatTime, isNewDay } from "../../Actions/utils";
import { useLimitChatChange } from "@/contexts/Chats/LimitChatChangeContext";
import { FaRegTrashAlt } from "react-icons/fa";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Image from "next/image";
import ModelShowImage from "./ModelShowImage";
import { useSendMessageChange } from "@/contexts/Chats/SendMessageChangeContext";
interface MessageListProps {
  messages: any[];
  user: any;
  usern: any[];
  maxWidth: any;
  chatLoading: any;
  activeModel:any;
  totalMessages: any;
  setActiveModel: any;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  user,
  usern,
  totalMessages,
  maxWidth: maxWidthPar,
  chatLoading,
  setActiveModel,
  activeModel,
}) => {
  const messagesEndRef = useRef<any>(null);
  const [limitChat, setLimitChat] = useLimitChatChange();

  const handleLi = () => {
    setLimitChat((prevLimit: any) => prevLimit + 10);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // استخدام useRef لتتبع الرسائل السابقة
  const previousMessagesRef = useRef<any[]>([]);

  useEffect(() => {
    // مقارنة الرسائل السابقة بالرسائل الحالية لتحديد ما إذا كانت هناك رسائل جديدة
    if (messages) {
      scrollToBottom();
    }

    // تحديث الرسائل السابقة
  }, [messages]);
  const { chatId } = useParams();
  const [sendMessageChange, setSendMessageChange] = useSendMessageChange();

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/${chatId}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },

      body: JSON.stringify({
        chatId: chatId,
      })          
        }
      );
      const data = await res.json();
      if (data && data.success === true) {
        NotificationManager.success("Message deleted successfully");
        setSendMessageChange('Test'+Math.floor(Math.random() * 1000));
      }
      setLimitChat(limitChat + 1);
      setLimitChat(limitChat - 1);
    } catch (e) {
      console.log(e);
    }
  };
  const wrapText = (text: string, maxWidth: number) => {
    const words = text.split(" ");
    let wrappedText = "";
    let line = "";

    words.forEach((word) => {
      const testLine = line + (line.length > 0 ? " " : "") + word;
      const testLineWidth = getTextWidth(testLine, "16px Arial");

      if (testLineWidth > maxWidth) {
        if (line.length === 0) {
          let partialWord = "";
          for (let i = 0; i < word.length; i++) {
            partialWord += word[i];
            const testPartialWidth = getTextWidth(partialWord, "16px Arial");
            if (testPartialWidth > maxWidth) {
              wrappedText +=
                (wrappedText.length > 0 ? "<br>" : "") + partialWord;
              partialWord = "";
            }
          }
          line = partialWord;
        } else {
          wrappedText += (wrappedText.length > 0 ? "<br>" : "") + line;
          line = word;
        }
      } else {
        line = testLine;
      }
    });

    wrappedText += (wrappedText.length > 0 ? "<br>" : "") + line;

    return wrappedText;
  };

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      return 0;
    }
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  const [previewImg, setPreviewImg] = useState<any>(null);
  return (
    <>
      {activeModel && (
        <ModelShowImage previewImg={previewImg}  setActiveModel={setActiveModel} />
      )}
      {Array.isArray(messages) &&
        messages?.map((message: any, index: any) => {
          const previousMessage = messages[index - 1];
          const newDay = isNewDay(message, previousMessage);
          const isSeenByUser = message?.seen?.length > 1;
          const isSender = message.sender === user?._id;

          const maxWidth = maxWidthPar;
          const conte = wrapText(message?.content, maxWidth);
          return (
            <div key={message._id} className="w-[100%] relative">
              {newDay && (
                <div className="max-w-[300px] w-max text-center my-4 sticky left-[50%] top-[5%]">
                  <div className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )} 
              {index === 0 && totalMessages > messages.length && (
                <>
                  {chatLoading ? (
                    <div className="max-w-[300px] flex justify-center sticky  left-[27%] translate-x-[27%] top-[5%] items-center">
                      <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        return handleLi();
                      }}
                      className="max-w-[300px] cursor-pointer w-max text-center my-4 sticky  left-[40%] translate-x-[40%] top-[5%]"
                    >
                      <div className="bg-accent shadow-lg shadow-accentHover py-1 px-3 rounded-md">
                        تحميل رسائل مسبقة
                      </div>
                    </div>
                  )}
                </>
              )}
              <div
                className={`py-3 px-2 flex ${
                  isSender ? "justify-end " : "justify-start"
                }`}
              >
                <div className="max-w-[100%] h-max">
                  <div
                    className={`w-max px-3 py-3 flex items-center justify-end flex-col rounded-xl ${
                      isSender
                        ? "bg-accent shadow-lg shadow-accentHover text-white pl-[21px]"
                        : "bg-gray-700 drop-shadow-sm shadow-gray-400 text-gray-300"
                    } relative`}
                  >
                    {message.imageUrl && (
                      // eslint-disable-next-line react/jsx-no-undef
                      <div
                        className="bg-primary w-full p-1 flex justify-center items-center rounded-xl cursor-pointer"
                        onClick={() => {
                          setPreviewImg(message.imageUrl);
                          setActiveModel(true);
                        }}
                      >
                        <img
                          src={
                            message?.imageUrl.startsWith("http")
                              ? message?.imageUrl
                              : `http://localhost:5000/${message?.imageUrl}`
                          }
                          alt="te"
                          loading="lazy"
                          className="rounded-lg max-w-[300px] w-full max-h-[250px]"
                        />
                      </div>
                    )}
                    <div
                      dangerouslySetInnerHTML={{ __html: conte }}
                      className="max-w-[100%]"
                    ></div>

                    {isSender && (
                      <>
                        <span
                          className="absolute left-1 cursor-pointer top-1 text-sm"
                          onClick={() => deleteMessage(message._id)}
                        >
                          <FaRegTrashAlt />
                        </span>

                        <div className="text-sm absolute bottom-1 left-1.5 text-white">
                          {isSeenByUser ? <IoCheckmarkDone /> : <IoCheckmark />}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`text-sm text-gray-500 ${
                  isSender ? "text-right" : "text-left"
                } px-2`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          );
        })}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;
