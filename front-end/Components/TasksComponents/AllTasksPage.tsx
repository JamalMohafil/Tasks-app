"use client";
import React, { useEffect, useState } from "react";
import AllTasks from "./AllTasks";
import Sidebar from "../Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
const AllTasksPage = () => {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const router = useRouter();
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { workId } = useParams();
  const [changeTasks, setChangeTasks] = useState("false");
  const [filters, setFilters] = useState<any>("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
          const queryParams = new URLSearchParams();
          if (filters.user) {
            queryParams.append("user", filters.user);
          }
          if (filters.status) {
            queryParams.append("status", filters.status);
          }
          if (filters.sort) {
            queryParams.append("sort", filters.sort);
          }

          const url = `http://localhost:5000/api/tasks/${workId}?${queryParams.toString()}`;
      const res = await axios.get(url,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res && res.data.success === true) {
        setTasks(res.data.tasks);
      }
      console.log(res)
      setLoading(false);
    };
    fetchData();
  }, [workId, changeTasks,filters]);
  console.log(filters);
  return (
    <>
      {Cookies.get("token") && user ? (
        <>
          <Sidebar User={user} />
          <main className="bg-primary h-max max-sm:w-full w-[70%] max-lg:w-[95%] max-w-[1650px]">
            <div className="w-[100%] h-[100%] border-2 border-accent shadow-sm rounded-xl">
              <AllTasks
                user={user}
                tasks={tasks}
                filters={filters}
                setFilters={setFilters}
                loading={loading}
                setChangeTasks={setChangeTasks}
              />
            </div>
          </main>
        </>
      ) : (
        router.push("/login")
      )}
    </>
  );
};

export default AllTasksPage;
