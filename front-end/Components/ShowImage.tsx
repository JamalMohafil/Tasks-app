'use client'
import Image from 'next/image'
import React from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";

const ShowImage = ({image,setShowImage,showImageS}:any) => {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000/";

  return (
    <div
      className={`h-screen w-[100%] bg-black/35 transition-all overflow-hidden flex justify-center items-center fixed z-[52]  left-0 
        ${showImageS ? "top-0" : "top-[-150%]"}`}
    >
      <div className="w-max h-3/5 relative bg-primary max-sm:h-auto flex justify-center items-center rounded-xl">
        <span
          className="absolute top-[1%] z-[53] right-[1%] cursor-pointer"
          onClick={() => {
            setShowImage(false);
          }}
        >
          <IoIosCloseCircleOutline className="text-3xl" />
        </span>
        <div className="relative w-[100%] h-[100%] max-sm:p-0 p-4 justify-center flex items-center object-cover rounded-xl">
          <Image
            src={`${backendUrl}${image}`}
            alt="image"
            height={400}
            width={600}
            className="object-cover w-[100%] h-[100%]  max-sm:h-[70%] p-8 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default ShowImage