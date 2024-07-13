import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useChangeWorkSpaces } from "@/contexts/Workspaces/ChangeWorkSpaces";

const CreateWork = ({ setModelWork, modelWork, user }:any) => {
  const [imagePreview, setImagePreview] = useState("/assets/user/jamal.webp");
  const [imageFile, setImageFile] = useState<any>('');
  const [name, setName] = useState("");
  const [loadingModel, setLoadingModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [oldRes,setOldRes] = useState([])
  const [selectedFriends, setSelectedFriends] = useState<any>([]); // حالة لتخزين الأصدقاء المختارين
const [loadingSearch,setLoadingSearch] = useState(false)
const [desc,setDesc] = useState('')
  const handleImageChange = (e:any) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image too large. Please choose a smaller image.");
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  };

  const closeModal = () => {
    setModelWork(false);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim() !== "") {
       await handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);
  useEffect(()=>{
    const fetchAll = async () => {
      const res = await fetch(
        `http://localhost:5000/api/users/friends/getAll`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const data = await res.json()
      setOldRes(data.friends)
      setSearchResults(data.friends)
    }
    fetchAll()
  },[])
  useEffect(()=>{
    if(searchTerm ===""){ 
      setSearchResults(oldRes)
    }
  },[searchTerm])
  const handleSearch = async () => {
    setLoadingSearch(true)
    const res = await fetch(`http://localhost:5000/api/users/searchFriends/${searchTerm}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    setLoadingSearch(false)
    setSearchResults(data.users);
    
  };

  const handleAddFriend = (friend:any) => {
    if (!selectedFriends.some((f:any) => f._id === friend._id)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };
  const [changeWorkSpaces, setChangeWorkSpaces] = useChangeWorkSpaces()
  const createWork = async () => {
    try {
      if (!name || !desc || !selectedFriends || !imageFile || !user) {
        return toast.error("Please fill all the fields");
      }
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name);
      formData.append(
        "members",
        JSON.stringify(selectedFriends.map((friend:any) => friend._id))
      );
      formData.append("description", desc);
      formData.append("createdBy", user._id);
      setTimeout(async() => {
        const res = await axios.post(
          "http://localhost:5000/api/workspaces",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        if (res && res.data.success === true) {
          setModelWork(false);
          toast.success("Workspace created successfully");
          setChangeWorkSpaces("test" + Math.random());
        }
      }, 2000);

    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div className="fixed left-0 top-0 h-screen w-[99vw] bg-black/60 flex justify-center items-center z-[620] overflow-hidden">
      <div className="min-w-[450px] max-h-[90vh] overflow-y-auto bg-primary rounded-xl flex flex-col justify-start items-center px-4 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // setModelWork(false);
            createWork();
          }}
          className="w-full flex justify-center items-center flex-col"
        >
          <div className="flex flex-col gap-y-2 mb-3 items-center">
            <label className="text-white cursor-pointer flex flex-col gap-y-1 items-center justify-center">
              <Image
                width={100}
                height={100}
                src={imagePreview}
                className="rounded-full"
                alt={user?.name || ""}
              />
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
            <div>
              <label htmlFor="name" className="block text-accent mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-accent mb-2">
                Workspace Description
              </label>
              <textarea
                id="name"
                className="w-full max-h-[150px] p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={400}
              />
            </div>
            <div>
              <label htmlFor="search" className="block text-accent mb-2">
                Search Friends
              </label>
              <input
                type="search"
                id="search"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mt-2">
                {loadingSearch ? (
                  <div className="w-[100%] flex justify-center items-center">
                    <div className="w-[25px] h-[25px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  searchResults &&
                  searchResults.length > 0 &&
                  searchResults.map((friend: any,i:number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-800 rounded mb-1"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Image
                          src={
                            friend?.image && friend.image.startsWith("http")
                              ? friend.image
                              : `http://localhost:5000/${friend.image}`
                          }
                          width={30}
                          height={30}
                          alt={friend?.name}
                        />
                        <div className="flex flex-col justify-center items-start ">
                          <p className="font-medium max-w-[85%] overflow-hidden overflow-ellipsis max-h-[20px]">
                            {friend?.name}
                          </p>
                          <p className="max-w-[100%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                            {friend?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddFriend(friend)}
                        className="bg-accent text-white px-2 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <h4 className="text-accent mb-2">
              Selected Friends ({selectedFriends.length})
            </h4>
            {selectedFriends.map((friend: any,i:number) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-gray-800 rounded mb-1"
              >
                <div className="flex justify-center items-center gap-2">
                  <Image
                    src={
                      friend?.image && friend.image.startsWith("http")
                        ? friend.image
                        : `http://localhost:5000/${friend.image}`
                    }
                    width={30}
                    height={30}
                    alt={friend?.name}
                  />
                  <div className="flex flex-col justify-center items-start ">
                    <p className="font-medium max-w-[85%] overflow-hidden overflow-ellipsis max-h-[20px]">
                      {friend?.name}
                    </p>
                    <p className="max-w-[100%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                      {friend?.email}
                    </p>
                  </div>
                </div>{" "}
                <span
                  onClick={() => {
                    setSelectedFriends(
                      selectedFriends.filter((f: any) => f._id !== friend._id)
                    );
                  }}
                  className="bg-red-600 cursor-pointer p-1 rounded-full flex justify-center items-center"
                >
                  <IoMdClose />
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full mt-4">
            <button
              disabled={loadingModel}
              type="submit"
              className="bg-accent text-white px-3 text-sm py-2 rounded hover:bg-accentHover transition duration-300"
            >
              {loadingModel ? (
                <div className="w-[100%] flex justify-center items-center">
                  <div className="w-[25px] h-[25px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Create"
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-3 text-sm py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWork;
