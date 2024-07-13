'use client'
import { TASKS } from "@/data/data";
import React, { useEffect, useState } from 'react'
import { CiMenuFries } from "react-icons/ci";
import { useActiveSidebar    } from "@/contexts/GlobalContext";
import WorkSpaceItem from "./WorkSpaceItem";
import { useWorkspaces } from "@/contexts/Workspaces/GetWorkSpacesContext";
import { CiCirclePlus } from "react-icons/ci";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import CreateWork from "../CreateWork";
import Image from "next/image";
import noData from '@/public/assets/workspace/no-data.svg'
const AllWorkSpaces = () => {
      const [activeSidebar, setActiveSidebar] = useActiveSidebar()
const workSpaces = useWorkspaces();
const [works, setWorks] = useState([]);
useEffect(() => {
  if (workSpaces && workSpaces.workSpaces && workSpaces.workSpaces.workspaces) {
    setWorks(workSpaces.workSpaces.workspaces);
  }
}, [workSpaces]);
  const auth = useAuth();
  const [modelWork, setModelWork] = useState(false);

  const User = auth ? auth.user : null;
  return (
    <>
      {modelWork && User && Cookies.get("token") && (
        <CreateWork
          setModelWork={setModelWork}
          user={User}
          modelWork={modelWork}
        />
      )}
      <section className="w-[100%] h-max p-7 max-[280px]:px-2">
        <div className="justify-between items-center flex w-[100%] max-[500px]:flex-col max-[500px]:justify-center max-[500px]:gap-2">
          <h1 className="flex flex-col gap-2 max-[370px]:gap-1 text-2xl font-bold max-w-[300px]">
            <span className="flex w-full justify-center items-center gap-2">
              All WorkSpaces{" "}
              <span
                className="text-white text-3xl hover:text-accent cursor-pointer"
                onClick={() => setModelWork(true)}
              >
                <CiCirclePlus />
              </span>
            </span>
            <hr className="border-0 bg-accent w-[30%] h-[3px] rounded-xl " />
          </h1>
          <span
            className="lg:hidden flex gap-2 justify-center items-center cursor-pointer"
            onClick={() => {
              setActiveSidebar(!activeSidebar);
            }}
          >
            <span className="text-white">Show sidebar</span>
            <CiMenuFries className="text-white text-xl" />
          </span>
        </div>
        <div
          className={`${
            works && works.length ? "grid" : "flex"
          }  max-[1150px]:grid-cols-1 xl:grid-cols-2 min-[1150px]:grid-cols-2 min-[1920px]:grid-cols-3
       justify-start mt-6 items-center w-[100%] gap-3 max-sm:grid-cols-1 `}
        >
          {works && works.length ? (
            works.length > 0 &&
            works.map((item, i) => (
              <div key={i} className="h-[260px]">
                <WorkSpaceItem item={item} user={User} />
              </div>
            ))
          ) : (
            <div className="w-full gap-y-3 py-10 flex justify-center items-center flex-col">
              <Image
                src={noData}
                width={360}
                height={360}
                alt="no data image"
              />
              <h1 className="text-3xl font-bold">No Workspaces</h1>
              <span
                onClick={() => setModelWork(true)}
                className="cursor-pointer bg-accent text-white
                                       py-1.5 px-3 rounded-lg shadow-md hover:bg-accent-dark 
                                       transition-colors duration-300 text-xl"
              >
                Add Workspaces
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AllWorkSpaces;