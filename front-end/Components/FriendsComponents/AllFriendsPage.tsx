"use client";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CiMenuFries } from "react-icons/ci";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import Sidebar from "../Sidebar";
import FriendReqs from "./FriendReqs";
import AddFriend from "./AddFriend";
import { useFriends } from "@/contexts/Friends/FriendsContext";
import { useChangeFriends } from "@/contexts/Friends/ChangeFriendsContext";
import Friend from "./Friend";
import axios from "axios";
const AllFriendsPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const loading = auth ? auth.loading : true;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const [friends, setFriends] = useState<any>([]);
  const [loadingFrnds, setLoadingFrnds] = useState<any>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoadingFrnds(true)
      try {
        const res= await axios.get(
          "http://localhost:5000/api/users/friends/getAll",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        
        setFriends(res.data.friends);
        setLoadingFrnds(false)
      }catch(e){
        console.log(e)
        setLoadingFrnds(false)
      }
    };
    fetch()
  }, []);
  return (
    <>
      {Cookies.get("token") && loading === false && !user ? (
        router.push("/login")
      ) : (
        <>
          <Sidebar User={user} />
          <main
            className="bg-primary border-2 max-sm:w-[98%] border-accent
      rounded-xl font-arabic w-[88%] max-lg:w-[99%] min-h-[80vh] lg:flex lg:items-center  max-h-[100vh]"
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
            <div className="flex flex-wrap w-[100%] max-md:px-4 max-md:flex-col-reverse max-lg:px-2 max-lg:gap-2  px-8 py-5 gap-4 justify-around items-center">
              <div className="w-[60%] max-md:w-full">
                <Friend
                  loading={loadingFrnds}
                  friends={friends}
                  setFriends={setFriends}
                  user={user}
                />
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default AllFriendsPage;
