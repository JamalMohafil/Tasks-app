"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image"; // استيراد Image من next.js
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
const Search = () => {
  const [searchTerm, setSearchTerm] = useState(""); // حالة لتخزين قيمة حقل البحث
  const [searchResults, setSearchResults] = useState([]); // حالة لتخزين نتائج البحث
  const auth = useAuth();
  const router = useRouter()
  const user = auth ? auth.user : null;
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
        handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // دالة للبحث عن المستخدمين
  const handleSearch = async () => {
    // يمكنك استبدال الرابط بالرابط الفعلي للبحث عن المستخدمين
    const res = await fetch(
      `http://localhost:5000/api/users/searchFriends/${searchTerm}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    const data = await res.json();
    setSearchResults(data.users); // تعيين نتائج البحث
  };
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
    if(data && data.success === true){
      router.push(`/chats/${data.chatId}`)
    }
    }catch(e){
      router.push('/chats')
      console.log(e)
    }
  };
  return (
    <div className="px-4 pt-2 relative">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        className="w-[100%] focus:border-accent border-transparent border p-2 rounded-lg bg-gray-700 text-white focus:outline-0"
      />
      {searchTerm && (
        <div className="border absolute flex flex-col gap-y-4  top-[90%] w-[100%] left-0 bg-primary border-accent z-[20] rounded-md p-3 mt-2">
          <h2>Search results</h2>
          {searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((user: any) => (
                <li
                  key={user?._id}
                  className="flex items-center outline-1 outline outline-accent  px-2 gap-2 rounded-lg cursor-pointer shadow-lg  mb-4 py-2"
                  onClick={() => CreateChat(user?._id)}
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        user?.image.startsWith("http")
                          ? user?.image
                          : `http://localhost:5000/${user.image}`
                      }
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium max-w-[85%] overflow-hidden overflow-ellipsis max-h-[20px]">
                      {user?.name}
                    </p>
                    <p className="max-w-[84%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                      {user?.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
