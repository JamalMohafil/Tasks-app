import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
type Props = {}

const ShowRequestsWork = ({id,setReqsModel}:any) => {
    const [loading,setLoading] = useState(false)
    const [workspace,setWorkSpace] = useState<any>(null)
     useEffect(() => {
       const fetchData = async () => {
         setLoading(true);
         const res = await fetch(
           `http://localhost:5000/api/workspaces/getAllWorkspaceRequests/${id}`,
           {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${Cookies.get("token")}`,
             },
           }
         );
         const data = await res.json();
         setWorkSpace(data.requests.joinRequests);
         setLoading(false);
       };
       fetchData();
     }, [id]);
     const reqsRef = useRef<any>()
     

     const handleClickOutside = (event: any) => {
       if (reqsRef.current && !reqsRef.current.contains(event.target)) {
         setReqsModel(false);
       }
     };
 
     useEffect(() => {
       document.addEventListener("click", handleClickOutside);
       return () => {
         document.removeEventListener("click", handleClickOutside);
       };
     }, []);
     const router = useRouter()
     const acceptReq = async (i:number,id:string,userId:string) => {
        const res = await fetch(
          `http://localhost:5000/api/workspaces/acceptJoinReq/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({ status: "accept",userId, }),
          }
        );
        const data = await res.json();
        if(!data || data.success === false){
            toast.error('something went wrong')
        }
        if(data && data.success === true){
            setWorkSpace(
              workspace.filter((item: any) => item.user._id !== userId)
            );
            router.refresh()
            toast.success('Request Accepted')
        }
     }
     const rejectReq = async (i:number,id:string,userId:string) => {
         const res = await fetch(
           `http://localhost:5000/api/workspaces/acceptJoinReq/${id}`,
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${Cookies.get("token")}`,
             },
             body: JSON.stringify({ status: "reject", userId }),
           }
         );
        const data = await res.json();
        if(!data || data.success === false){
            toast.error('something went wrong')
        }
        if(data && data.success === true){
            setWorkSpace(
              workspace.filter((item: any) => item.user._id !== userId)
            );
            toast.success('Request rejected')
            router.refresh()
        }
     }
     
  return (
    <div
      className="h-screen w-screen z-[625] flex justify-center items-center absolute left-0 top-0
    bg-black/60"
    >
      <div
        ref={reqsRef}
        className="min-h-[400px] max-h-[90vh] overflow-y-auto min-w-[500px] gap-y-3 bg-primary border border-accent rounded-lg flex flex-col justify-start items-center
        px-6 py-3"
      >
        <h2 className="text-2xl text-accent mb-2 mt-1 font-bold">
          Workspace Requests
        </h2>
        {workspace &&
          workspace.length > 0 &&
          workspace.map((item: any, i: number) => (
            <div
              key={item._id}
              className="w-[100%] max-w-[540px] max-[460px]:h-[130px] max-[460px]:gap-1 h-[70px] px-3 py-2 flex justify-around border border-accent rounded-xl items-center gap-2 flex-wrap"
            >
              <div className=" max-[460px]:w-full flex justify-center items-center gap-2">
                <Image
                  src={
                    item.user.image.startsWith("http")
                      ? item.user.image
                      : `http://localhost:5000/${item.user.image}`
                  }
                  width={55}
                  height={55}
                  alt=""
                  className="rounded-full"
                />
                <div>
                  <Link href={`/friends/${item.user._id}`} className="text-xl">
                    {item.user.name}
                  </Link>
                  <span className="block max-[460px]:inline max-[460px]:w-full break-all">
                    {item.user.email}
                  </span>
                </div>
              </div>
              <div className="max-[460px]:w-full max-[460px]:justify-center flex gap-3 items-center">
                <span
                  className="cursor-pointer bg-green-500 transition-all hover:bg-green-500/70 flex justify-center items-center rounded-full p-2"
                  onClick={() => acceptReq(i, id,item.user._id)}
                >
                  <FaCheck className="text-white" />
                </span>
                <span
                  className="cursor-pointer bg-red-500 transition-all hover:bg-red-500/70 flex justify-center items-center rounded-full p-2"
                  onClick={() => rejectReq(i, id,item.user._id)}
                >
                  <IoMdClose className="text-white" />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ShowRequestsWork