'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { CiMenuFries } from 'react-icons/ci';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useActiveSidebar } from '@/contexts/GlobalContext';
import Sidebar from '../Sidebar';

import WorkspaceReqs from './WorkspaceReqs';
import axios from 'axios';
const WorkspaceRequestsPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const loading = auth ? auth.loading : true;
  const router = useRouter();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const [reqs,setReqs] = useState<any>([])
  const [loadingReqs,setLoadingReqs] = useState(true)
  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingReqs(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/api/workspaces/allRequests/${user?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        // Axios response data is accessed via the `data` property
        setReqs(res.data.requests)
        setLoadingReqs(false)
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingReqs(false)
      }
    };

    fetchRequests(); // Call the fetch function immediately
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
            <div className="flex flex-wrap w-[100%] max-md:px-8 max-md:flex-col-reverse max-lg:px-2 max-lg:gap-2  px-8 py-5 gap-4 justify-around items-center">
              <div className="w-[60%] max-md:w-full">
                <WorkspaceReqs
                  reqsData={reqs}
                  loading={loading}
                  setReqsData={setReqs}
                  userId={user?._id}
                />
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default WorkspaceRequestsPage;