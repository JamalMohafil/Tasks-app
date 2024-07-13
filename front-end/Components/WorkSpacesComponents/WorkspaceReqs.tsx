'use client'
import React, { useCallback } from 'react'
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useChangeWorkSpaces } from '@/contexts/Workspaces/ChangeWorkSpaces';
import Link from 'next/link';
const WorkspaceReqs = ({ reqsData, loading, setReqsData, userId }: any) => {
  const [changeWorkSpaces, setChangeWorkSpaces] = useChangeWorkSpaces();
  const acceptReq = useCallback(
    async (i: number, id: any) => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/workspaces/acceptRequest/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({ response: "accept" }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await res.json();
        if (data.success) {
          const newReq = [...reqsData];
          newReq.splice(i, 1);
          setReqsData(newReq);
        }
        if (data.success) {
          toast.success("Friend request accepted");
        }
       
        setChangeWorkSpaces("jmfsd" + Math.random());
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    },
    [reqsData, setReqsData]
  );

  const rejectReq = useCallback(
    async (i: number, id: any) => {
      setTimeout(async () => {
        try {
          const res = await fetch(
            `http://localhost:5000/api/workspaces/rejectRequest/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
              body: JSON.stringify({ response: "reject" }),
            }
          );

          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await res.json();
          if (data.success) {
            const newReq = [...reqsData];
            newReq.splice(i, 1);
            setReqsData(newReq);
          }

          if (data.success) {
            toast.success("Friend request rejected");
          }
      
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      }, 1000);
    },
    [reqsData, setReqsData]
  );
  return (
    <div
      className="w-[100%] overflow-y-auto max-h-[90vh] min-h-[80vh] border border-accent flex flex-col
       items-center justify-start p-3 gap-y-4 rounded-lg"
    >
      <h1 className="text-2xl text-accent mb-1">WorkSpaces Requests</h1>
      {loading ? (
        <div className="w-[100%] flex justify-center items-center">
          <div className="w-[40px] h-[40px] border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reqsData !== null && reqsData.length > 0 ? (
        reqsData.map((item: any, i: number) => {
           const maxLength = 80; // الحد الأقصى لطول النص
           const shortDescription = item.workspace?.description ?
             item.workspace.description.length > maxLength
               ? item.workspace.description.substring(0, maxLength) + "..."
               : item.workspace.description : "";
         return (
           <>
             <div
               key={i}
               className="w-[100%] max-w-[600px]  max-[460px]:gap-1 h-max
               px-3 py-2 flex justify-center
               border border-accent rounded-xl flex-col items-center gap-2 flex-wrap"
             >
               <div className="flex justify-between flex-wrap gap-2 w-full items-center">
                 <Link
                   href={`/friends/${item.user._id}`}
                   className="w-[49%] max-w-[200px] max-[460px]:w-full flex justify-center items-center gap-2"
                 >
                   <Image
                     src={
                      item.user && item.user.image && item.user.image.startsWith("http")
                         ? item.user.image
                         : `http://localhost:5000/${item.user.image}`
                     }
                     width={55}
                     height={55}
                     alt=""
                     className="rounded-full"
                   />
                   <div>
                     <p className="font-medium max-w-[95%] overflow-hidden overflow-ellipsis max-h-[22px]">
                       {item.user.name}
                     </p>
                     <p className="max-w-[96%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                       {item.user.email}
                     </p>
                     {/* <h2>{item.user.name}</h2>
                    <span className="block max-[460px]:inline max-[460px]:w-full break-all">
                      {item.user.email}
                    </span> */}
                   </div>
                 </Link>
                 <div className="w-[49%] max-[460px]:w-full flex justify-start items-center gap-2">
                   <Image
                     src={
                       item && item.workspace && item.workspace?.image && item.workspace.image?.startsWith("http")
                         ? item.workspace?.image
                         : `http://localhost:5000/${item.workspace?.image}`
                     }
                     width={55}
                     height={55}
                     alt=""
                     className="rounded-full"
                   />
                   <div>
                     <p className="font-medium max-w-[100%] overflow-hidden overflow-ellipsis max-h-[22px]">
                       {item.workspace?.name}
                     </p>
                     <p className="max-w-[100%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                       {shortDescription}
                     </p>
                   </div>
                 </div>
               </div>

               <div className="max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
                 <span
                   className="cursor-pointer bg-green-500 transition-all hover:bg-green-500/70 flex justify-center items-center rounded-full p-2"
                   onClick={() => acceptReq(i, item.workspace?._id)}
                 >
                   <FaCheck className="text-white" />
                 </span>
                 <span
                   className="cursor-pointer bg-red-500 transition-all hover:bg-red-500/70 flex justify-center items-center rounded-full p-2"
                   onClick={() => rejectReq(i, item.workspace?._id)}
                 >
                   <IoMdClose className="text-white" />
                 </span>
               </div>
             </div>
           </>
         );
})
      ) : (
        <h2 className="text-[16px]">No Friend Requests</h2>
      )}
    </div>
  );
};

export default WorkspaceReqs