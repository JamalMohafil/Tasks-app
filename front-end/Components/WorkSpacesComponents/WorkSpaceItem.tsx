import { formatDate } from "@/Actions/utils";
import Image from "next/image";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ShowWorkItem from "./ShowWorkItem";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useChangeWorkSpaces } from "@/contexts/Workspaces/ChangeWorkSpaces";
import EditWorkItem from "./EditWorkItem";
import ShowRequestsWork from "./ShowRequestsWork";


const WorkSpaceItem = ({ item ,user}: any) => {
  const userImages = [
    "/assets/user/jamal.webp",
    "/assets/user/jamal.webp",
    "/assets/user/jamal.webp",
    "/assets/user/jamal.webp",
    "/assets/user/jamal.webp",
  ];
  const [showModal, setShowModal] = React.useState(false);
    const [changeWorkSpaces, setChangeWorkSpaces] = useChangeWorkSpaces()
  const deleteWorkspace = async (id:string)=>{
    try {
      const res = await fetch(
      "http://localhost:5000/api/workspaces/deleteWorkspace/" +id,
      {
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${Cookies.get("token")}`
        }
      }
    );
    const data = await res.json();
    if(data && data.success === true){
      toast.success("Workspace deleted successfully");
      setChangeWorkSpaces('tejsd'+Date.now())
    }
    } catch (error) {
      toast.error("Something went wrong, Please try again later");
      console.log(error);
    }
  }
       const maxLength = 180; // الحد الأقصى لطول النص
       const shortDescription =
         item.description.length > maxLength
           ? item.description.substring(0, maxLength) + "..."
           : item.description;
       
           const [modelEdit,setModelEdit] = useState(false)
           const [reqsModel,setReqsModel] = useState(false)
  return (
    <>
      {showModal && <ShowWorkItem id={item._id} setShowModal={setShowModal} />}
      {modelEdit && (
        <EditWorkItem setModelEdit={setModelEdit} item={item} user={user} />
      )}
      {reqsModel && (
        <ShowRequestsWork setReqsModel={setReqsModel} id={item._id} user={user} />
      )}
      <div
        className="bg-[#3a3a3a] relative border h-[90%] justify-between px-4
       border-gray-400 rounded-xl py-4 flex flex-col gap-3 shadow-lg hover:shadow-2xl 
       transition-shadow duration-300"
      >
        {item.admins.includes(user._id) && (
          <span className="absolute right-3 top-3 bg-accent text-white px-3 py-1 rounded-xl font-semibold shadow-md">
            admin
          </span>
        )}
        {item.joinRequests && item.joinRequests.length > 0 && (
          <span onClick={() => setReqsModel(true)} className="absolute right-24 top-3 cursor-pointer bg-accent text-white px-3 py-1 rounded-xl font-semibold shadow-md">
            Requests
          </span>
        )}
        <div className="flex justify-start items-center gap-3">
          <div className="flex-shrink-0 relative h-16 w-16">
            <Image
              src={
                item.image && item.image.startsWith("http")
                  ? item.image
                  : `http://localhost:5000/${item.image}`
              }
              onClick={() => setShowModal(item._id)}
              className="rounded-full cursor-pointer"
              layout="fill"
              objectFit="cover"
              alt="User Image"
            />
          </div>
          <div className="flex flex-col">
            <h2
              className="text-2xl font-bold text-white cursor-pointer"
              onClick={() => setShowModal(item._id)}
            >
              {item.name}
            </h2>
            <p className="text-[16px] font-arabic leading-normal line-clamp break-words text-gray-300">
              {shortDescription}
            </p>
          </div>
        </div>
        <div
          className={`flex justify-between flex-wrap gap-3 mt-2 ${
            !item.admins.includes(item._id) || user._id !== item.createdBy
              ? "items-end"
              : "items-center"
          }`}
        >
          <div className="flex flex-col gap-y-1">
            <span className="text-white text-sm mb-2 ml-1">
              CreatedAt: {formatDate(item.createdAt)}
            </span>
            {item.admins.includes(item._id) ||
              (user._id === item.createdBy && (
                <div className="flex gap-2">
                  {item.admins.includes(user._id) && (
                    <span
                      onClick={() => setModelEdit(true)}
                      className="cursor-pointer text-white hover:text-gray-400 transition-colors duration-200"
                    >
                      <FaEdit />
                    </span>
                  )}
                  {user._id == item.createdBy && (
                    <span
                      onClick={() => deleteWorkspace(item._id)}
                      className="cursor-pointer text-white hover:text-gray-400 transition-colors duration-200"
                    >
                      <FaTrashAlt />
                    </span>
                  )}
                </div>
              ))}
          </div>
          <div
            className="flex justify-end items-center mt-2 cursor-pointer"
            onClick={() => setShowModal(item._id)}
          >
            {item.members.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="flex-shrink-0 relative h-8 w-8">
                <Image
                  src={
                    item.image && item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000/${item.image}`
                  }
                  className="rounded-full"
                  layout="fill"
                  objectFit="cover"
                  alt={`User ${index + 2}`}
                />
              </div>
            ))}
            {item.members.length > 3 && (
              <div className="flex-shrink-0 relative h-6 w-6 bg-gray-600 rounded-full flex items-center justify-center ml-1">
                <span className="text-white text-sm">
                  +{item.members.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkSpaceItem;
