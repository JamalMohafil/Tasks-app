import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const AddFriend = () => {
  const [loading,setLoading] = useState(false)
  const addFriendAction = async (e:any) => {
    e.preventDefault();
    const email = e.target.email.value.trim(); // Trim whitespace from email input

    if (!email) {
      toast.error("Email cannot be empty");
      return;
    }

    try {
      setLoading(true)
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
                setLoading(false);

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
          return toast.success("Friend request sent");
        }
      }, 2000);

    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  return (
    <div className="w-[100%] min-h-[300px] border border-accent p-2 px-5 gap-y-2 rounded-xl flex flex-col justify-center">
      <h2>Add Friend By E-mail</h2>
      <form
        onSubmit={(e) => addFriendAction(e)}
        className="flex flex-col gap-y-4"
      >
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          className="w-[100%] focus:border-accent border-transparent border p-2 rounded-lg bg-gray-700 text-white focus:outline-0"
        />
        <button
          disabled={loading}
          type="submit"
          className={`w-[100%] border border-accent ${
            !loading && "hover:bg-accent"
          } transition-all p-2 rounded-xl`}
        >
          {loading ? (
            <div className="w-[100%] flex justify-center items-center">
              <div className="w-[30px] h-[30px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            "Add"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFriend;
