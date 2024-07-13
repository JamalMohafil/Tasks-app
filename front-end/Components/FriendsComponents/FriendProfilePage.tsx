"use client";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CiMenuFries } from "react-icons/ci";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import Sidebar from "../Sidebar";
import FriendReqs from "./FriendReqs";
import AddFriend from "./AddFriend";
import { useFriends } from "@/contexts/Friends/FriendsContext";
import { useChangeFriends } from "@/contexts/Friends/ChangeFriendsContext";
import FriendProfile from "./FriendProfile";
import axios from "axios";
const FriendProfilePage = () => {

  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const {id} = useParams()
  const [loading,setLoading] = useState(true)
  const [friend,setFriend] = useState<any>('')
  const [friendChange,setFriendChange] = useState('1')
  console.log(id)
  const [friendsModel, setFriendsModel] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res: any = await axios.get(
          `http://localhost:5000/api/users/getUser/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        if (res) {
          setFriend(res.data);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetch();
  }, [id, friendChange]);
  return (
    <>
      <Sidebar User={user} />
      <main
        className="bg-primary border-2 max-sm:w-[98%] border-accent
      rounded-xl font-arabic w-[88%] max-lg:w-[99%] relative max-w-[1000px] min-h-[500px] lg:flex lg:items-center "
      >
        <span
          className="lg:hidden px-4 pt-6 flex gap-2 justify-end mb-1 items-center w-[100%] cursor-pointer"
          onClick={() => {
            setActiveSidebar(!activeSidebar);
          }}
        >
          <span className="text-white">Show sidebar</span>
          <CiMenuFries className="text-white text-xl" />
        </span>
        <div
          className="flex flex-wrap w-[100%] 
            max-md:px-8 max-md:flex-col-reverse max-lg:px-2 max-lg:gap-2 
             px-8 py-5 gap-4 justify-center items-center"
        >
          <div className="w-[80%] max-md:w-full">
            <FriendProfile
              setFriendChange={setFriendChange}
              friend={friend}
              loading={loading}
              user={user}
              friendsModel={friendsModel}
              setFriendsModel={setFriendsModel}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default FriendProfilePage;
