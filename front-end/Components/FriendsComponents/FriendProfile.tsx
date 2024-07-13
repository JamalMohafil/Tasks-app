'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
type Props = {};
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Link from "next/link";
import { IoIosCloseCircleOutline } from "react-icons/io";

const FriendProfile = ({ friend, loading, user, setFriendChange }: any) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // حالة الاتصال (true للمتصل، false لغير المتصل)
 const [friendsModel, setFriendsModel] = useState(false);

 
  const RequestToJoin = async (workspaceId:string) => {
    const res = await fetch(
      "http://localhost:5000/api/workspaces/requestToJoin/"+workspaceId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    const data = await res.json();
    if(!data || data.success === false){
      toast.error('something went wrong');
    }
    if(data && data.message === 'Workspace not found'){
      toast.error('Workspace not found');
    }
    if (data && data.message === "Unauthorized") {
      toast.error("Unauthorized");
    }
    if (data && data.success === true && data.message === "Request sent") {
      toast.success("Request sent successfully");
    }
    if (data && data.message === 'Request already sent') {
      toast.success("Request already sent");
    }
  };
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
          participants: [friend.user._id, usern],
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
  
  const addFriendAction = async (e: any, email: string) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      setTimeout(async () => {
        const res = await fetch(
          `http://localhost:5000/api/users/sendFriend/${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await res.json();

        if (
          data &&
          data.message &&
          data.message === "You already have a pending request from this user"
        ) {
          return toast.error(
            "You already have a pending request from this user"
          );
        }
        if (data && data.message === "You can't add yourself as a friend") {
          return toast.error("You can't add yourself as a friend");
        }
        if (data && data.message === "User is already in your friends list") {
          return toast.warn("User is already in your friends list");
        }
        if (!data || data.success === false) {
          return toast.error("Sorry something went wrong");
        }
        if (data && data.success === true) {
          setFriendChange('tes'+Date.now())
          return toast.success("Friend request sent");
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
    }
  };
  const removeFriendAction = async (e: any, id: string) => {
    e.preventDefault();

    if (!id) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      setTimeout(async () => {
        const res = await fetch(
          `http://localhost:5000/api/users/deleteFriend/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await res.json();

        if (
          data &&
          data.message &&
          data.message === "You already have a pending request from this user"
        ) {
          return toast.error(
            "You already have a pending request from this user"
          );
        }
        if (data && data.message === "User not found") {
          return toast.error("User not found");
        }
        if (data && data.message === "User not found") {
          return toast.warn("User not found");
        }
        if (!data || data.success === false) {
          return toast.error("Sorry something went wrong");
        }
        if (data && data.success === true) {
          window.location.reload()
          return toast.success("Friend removed");
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
    }
  };
   const blockUser = async (id:string) => {
     try {
       const res = await fetch(
         `http://localhost:5000/api/users/block/${user._id}`,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${Cookies.get("token")}`,
           },
           body: JSON.stringify({
             blockerId: id,
             block: "true",
           }),
         }
       );
       const data = await res.json();
       if (data && data.message === "Block status updated") {
         NotificationManager.success("Block status updated");
       }
      //  setTimeout(() => {
      //    window.location.reload();
      //  }, 1500);
     } catch (error) {
       console.error("Block Error:", error);
     } 
   };
   const unBlockUser = async (id:string) => {
     try {
       const res = await fetch(
         `http://localhost:5000/api/users/block/${user._id}`,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${Cookies.get("token")}`,
           },
           body: JSON.stringify({
             blockerId: id,
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
     }
   };
   
  return (
    <>
      {friendsModel && (
        <div
          className="h-screen w-screen z-[640] bg-black/65 fixed left-0
         top-0 flex justify-center items-center"
        >
          <div
            className="min-h-[400px] max-h-[90vh] overflow-y-auto flex-col gap-y-3 bg-primary min-w-[600px] border border-accent 
          rounded-lg flex relative justify-start items-center px-4 py-2"
          >
            <span onClick={() => setFriendsModel(false)} className="absolute right-3 cursor-pointer top-2 text-red-500 text-3xl"><IoIosCloseCircleOutline /></span>
            <h2 className="text-2xl text-accent mb-2">
              {friend.user.name} List Friends
            </h2>
            {friend.user.friends &&
              friend.user.friends.length > 0 &&
              friend.user.friends.map((item: any) => {
              return (
                <Link
                  href={`/friends/${item._id}`}
                  key={item._id}
                  className="w-[100%] max-w-[540px] max-[460px]:h-[130px] max-[460px]:gap-1 h-[70px] px-6 py-2 flex justify-between  border border-accent rounded-xl items-center gap-2 flex-wrap"
                >
                  <div className=" max-[460px]:w-full flex justify-s items-center gap-2">
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
                      onClick={() => {
                        if (item._id !== user._id) {
                          CreateChat(item._id);
                        }
                      }}
                      className={`cursor-pointer bg-accent transition-all
               hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold ${user._id === item._id && "w-[150px]"}`}
                    >
                      {user._id === item._id ? (
                        <Link href={"/friends/" + user._id}>View Profile</Link>
                      ) : (
                        "Message"
                      )}
                    </span>
                    {user &&
                      !user.friends.includes(item._id) &&
                      user._id !== item._id && (
                        <span
                          className="cursor-pointer bg-green-500 transition-all
                      hover:bg-green-500/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                        >
                          Send Friend Request
                        </span>
                      )}
                    {!user && (
                      <Link
                        href={"/login"}
                        className="cursor-pointer bg-green-500 transition-all
                      hover:bg-green-500/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                      >
                        Send Friend Request
                      </Link>
                    )}
                  </div>
                </Link>
              );
})}
          </div>
        </div>
      )}
      <div className="w-[100%] h-max min-h-[500px] border border-accent flex flex-col items-center relative justify-center p-3 gap-y-3 rounded-lg">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h1 className="text-2xl text-accent mb-1 z-10">User Profile</h1>
            <span className="absolute left-1 top-2 bg-accent px-2 py-1 rounded-lg">
              role: {friend.user.role}{" "}
            </span>
            <div className="relative w-[180px] h-[180px]">
              <Image
                src={
                  friend.user &&
                  friend.user.image &&
                  friend.user.image.startsWith("http")
                    ? friend.user.image
                    : `http://localhost:5000/${friend.user.image}`
                }
                alt={"User"}
                width={180}
                height={180}
                className="rounded-lg"
              />
              <span
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white ${
                  isOnline
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500 animate-pulse"
                }`}
              ></span>
            </div>

            <h2 className="z-10 text-2xl">{friend.user.name}</h2>
            <span className="text-center max-w-[600px] z-10">
              {friend.user.description}
            </span>
            <div className="flex items-center gap-3">
              <span
                className="z-10 cursor-pointer"
                onClick={() => {
                  setFriendsModel(true);
                  console.log("test");
                }}
              >
                Friends: {friend.user.friends.length}
              </span>
        
              <span className="z-10">
                Workspaces: {friend.workspaces.length}
              </span>
            </div>
            <div className="z-10 max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
              {user &&
              user._id !== friend.user._id &&
              !user.blockList.includes(friend.user._id) ? (
                <>
                  <span
                    onClick={() => CreateChat(friend.user._id)}
                    className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                  >
                    Message
                  </span>
                  {user &&
                  user.friends &&
                  user.friends.includes(friend.user._id) ? (
                    <span
                      onClick={(e: any) =>
                        removeFriendAction(e, friend.user._id)
                      }
                      className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                    >
                      Remove Friend
                    </span>
                  ) : (
                    <span
                      onClick={(e: any) =>
                        addFriendAction(e, friend.user.email)
                      }
                      className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                    >
                      Send Friend Request
                    </span>
                  )}
                </>
              ) : (
                !user && (
                  <>
                    <Link
                      href={"/login"}
                      className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                    >
                      Message
                    </Link>

                    <Link
                      href={"/login"}
                      className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                    >
                      Send Friend Request
                    </Link>
                  </>
                )
              )}
              {user && user._id === friend.user._id && (
                <span className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold">
                  This is your profile! Amazing
                </span>
              )}
              {user && user._id !== friend.user._id && (
                <span
                  className="z-10 cursor-pointer bg-red-500 transition-all hover:bg-red-500/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                  onClick={() => setIsBlocked(!isBlocked)}
                >
                  {user.blockList.includes(friend.user._id) ? (
                    <span onClick={() => unBlockUser(friend.user._id)}>
                      Unblock
                    </span>
                  ) : (
                    <span onClick={() => blockUser(friend.user._id)}>
                      Block
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="z-10 mt-4 w-full max-w-[700px] px-4 py-2 border border-accent rounded-lg">
              <h3 className="text-2xl mb-5 font-bold  text-center ">Workspaces</h3>
              {friend.workspaces && friend.workspaces.length > 0 ? friend.workspaces.map((workspace: any, index: number) => (
                <div
                  key={index}
                  className="mb-2 p-2 border border-accent rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      className="rounded-full"
                      src={
                        workspace.image && workspace.image.startsWith("http")
                          ? workspace.image
                          : `http://localhost:5000/${workspace.image}`
                      }
                      width={80}
                      height={80}
                    />
                    <div>
                      <h4 className="text-lg">{workspace.name}</h4>
                      <p>{workspace.description}</p>
                    </div>
                  </div>
                  <div className="max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
                    <span
                      onClick={() => RequestToJoin(workspace._id)}
                      className="cursor-pointer bg-accent transition-all hover:bg-accent/70 flex justify-center items-center rounded-xl p-2 text-white font-semibold"
                    >
                      Request To Join
                    </span>
                  </div>
                </div>
              )) : <h2 className="text-center ">No Workspaces</h2>}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FriendProfile;
