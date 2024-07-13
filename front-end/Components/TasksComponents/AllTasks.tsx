"use client";
import React, { useState } from "react";
import { CiCirclePlus, CiMenuFries } from "react-icons/ci";
import { useActiveSidebar } from "@/contexts/GlobalContext";
import CreateTask from "./CreateTask";
import { formatDate } from "react-datepicker/dist/date_utils";
import { formatDateNoti } from "@/Actions/utils";
import EditTask from "./EditTask";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "./check.css"
const TASKS = [
  {
    id: 1,
    name: "Task 1",
    description: "Description for task 1",
    status: "Pending",
    dueDate: "2024-08-01",
    isImportant: true,
    dateUpload: "2024-07-01",
  },
  {
    id: 2,
    name: "Task 2",
    description: "Description for task 2",
    status: "Completed",
    dueDate: "2024-08-02",
    isImportant: false,
    dateUpload: "2024-07-02",
  },
  {
    id: 3,
    name: "Task 3",
    description: "Description for task 3",
    status: "Overdue",
    dueDate: "2024-07-01",
    isImportant: false,
    dateUpload: "2024-07-03",
  },
  {
    id: 4,
    name: "Task 4",
    description: "Description for task 4",
    status: "Pending",
    dueDate: "2024-08-03",
    isImportant: true,
    dateUpload: "2024-07-04",
  },
  {
    id: 5,
    name: "Task 5",
    description: "Description for task 5",
    status: "Pending",
    dueDate: "2024-08-04",
    isImportant: false,
    dateUpload: "2024-07-05",
  },
];

const AllTasks = ({
  tasks,
  loading,
  user,
  setChangeTasks,
  filters,
  setFilters,
}: any) => {
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const [loadingDel, setLoadingDel] = useState(false);

  const handleDelete = async (taskId: any) => {
    setLoadingDel(true);
    const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const data = await res.json();
    if (!data) {
      return toast.error("Something went wrong");
    }
    if (data && data.message === "Unauthorized to access this task") {
      return toast.error("Unauthorized to access this task");
    }
    if (
      data &&
      data.success === false &&
      data.message !== "Unauthorized to access this task"
    ) {
      return toast.error(data.message);
    }
    if (data && data.success === true) {
      toast.success(data.message);
      setChangeTasks("mres" + new Date());
    }
    setLoadingDel(false);
  };

  const [modelTask, setModelTask] = useState(false);
  const [modelEdit, setModelEdit] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [task, setTask] = useState<any>({});
  return (
    <>
      {modelTask && (
        <CreateTask
          setModelTask={setModelTask}
          modelTask={modelTask}
          user={user}
          setChangeTasks={setChangeTasks}
        />
      )}
      {modelEdit && (
        <EditTask
          setModelTask={setModelEdit}
          modelTask={modelEdit}
          user={user}
          task={task}
          setChangeTasks={setChangeTasks}
        />
      )}
      {modelShow && (
        <div className="fixed left-0 top-0 h-screen w-[99vw] bg-black/60 flex justify-center items-center z-[620] overflow-hidden">
          <div className="min-w-[450px] relative border border-accent max-h-[90vh] overflow-y-auto bg-primary rounded-xl flex flex-col justify-start items-center px-4 py-2">
            <h2 className="text-xl font-bold mb-4">{task.name}</h2>
            {task.isImportant &&
              task.status !== "Overdue" &&
              task.status !== "Comleted" && (
                <span className="px-2 py-1 rounded-lg absolute left-2 bottom-2 bg-red-500">
                  Important
                </span>
              )}
            {task.status == "Overdue" && (
              <span className="px-2 py-1 rounded-lg absolute left-2 bottom-2 bg-red-500">
                overdue
              </span>
            )}
            {task.status == "Completed" && (
              <span className="px-2 py-1 rounded-lg absolute left-2 bottom-2 bg-green-500">
                Completed
              </span>
            )}
            <div className="mb-2">
              <strong>Description:</strong> {task.description}
            </div>
            <div className="mb-2">
              <strong>Status:</strong> {task.status}
            </div>
            <div className="mb-2">
              <strong>Due Date:</strong> {formatDateNoti(task.dueDate)}
            </div>
            <div className="mb-2">
              <strong>Upload Date:</strong> {formatDateNoti(task.dateUpload)}
            </div>

            <Link href={`/friends/${task.user?._id}`} className="mb-2">
              <strong>Assigned to:</strong>{" "}
              {task.user ? task.user.name : "Unassigned"}
            </Link>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setModelShow(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="w-[100%] my-12 flex justify-center items-center">
          <div className="w-[45px] h-[45px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <section className="w-[100%] h-max p-7 max-[280px]:px-2">
          <div
            className="justify-between items-center flex w-[100%] max-sm:flex-col 
       max-sm:justify-center max-sm:gap-2"
          >
            <div className="flex justify-between flex-wrap gap-2 max-md:justify-center items-center w-full">
              <h1 className="flex gap-2 max-md:text-center max-[370px]:gap-1 text-2xl font-bold max-w-[400px]">
                All Tasks For Test workspace
              </h1>
              <span
                className="bg-accent px-2.5 py-1.5 text-[16px] hover:border-accent border border-transparent hover:bg-transparent rounded-lg cursor-pointer"
                onClick={() => setModelTask(true)}
              >
                Add Task
              </span>
            </div>

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
          <div className="w-full flex justify-end items-end">
            <div className="flex gap-3 mt-3 lg:max-w-[650px] max-md:flex-wrap max-md:w-full max-md:max-w-none justify-center items-center ">
              <div className="flex justify-center items-center  w-max flex-nowrap gap-2">
                <label htmlFor="check" className="w-max cursor-pointer">
                  Show Yours
                </label>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      user: e.target.checked ? user._id : false,
                    });
                  }}
                  checked={filters.user ? true : false}
                  id={"check"}
                />
              </div>
              <select
                className="w-3/5 max-md:w-full p-2 rounded bg-gray-700
                 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={filters.sort}
                onChange={(e) => {
                  setFilters({ ...filters, sort: e.target.value });
                }}
              >
                <option>Newest</option>
                <option>Oldest</option>
              </select>
              <select
                className="w-3/5 max-md:w-full p-2 rounded bg-gray-700
                 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                }}
              >
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Overdue</option>
                <option>Important</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-y-3 mt-4 overflow-x-auto">
            <table className="min-w-[800px]  border-collapse">
              <thead>
                <tr className="bg-accent">
                  <th className="border p-2 whitespace-nowrap">Title</th>
                  <th className="border p-2 whitespace-nowrap">Description</th>
                  <th className="border p-2 whitespace-nowrap">Status</th>
                  <th className="border p-2 whitespace-nowrap">Due Date</th>
                  <th className="border p-2 whitespace-nowrap">User</th>
                  <th className="border p-2 whitespace-nowrap">Important</th>
                  <th className="border p-2 whitespace-nowrap">Date Upload</th>
                  <th className="border p-2 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {tasks && tasks.length > 0 ? (
                  tasks.map((task: any, index: number) => (
                    <tr key={index}>
                      <td className="border p-2">{task.name}</td>
                      <td
                        onClick={() => {
                          setModelShow(true);
                          setTask(task);
                        }}
                        className="border cursor-pointer p-2 text-ellipsis overflow-hidden max-w-[300px]"
                      >
                        {task.description}
                      </td>
                      <td
                        className={`border p-2 ${
                          task.status === "Pending"
                            ? "bg-yellow-400"
                            : task.status === "Completed"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      >
                        {task.status}
                      </td>
                      <td className="border p-2">
                        {formatDateNoti(task.dueDate)}
                      </td>
                      <td className="border p-2">
                        <Link href={`/friends/${task.user?._id}`}>
                          {task.user ? task.user?.name : "Unassigned"}
                        </Link>
                      </td>
                      <td
                        className={`${
                          task.isImportant && "bg-red-500/65"
                        } border p-2 text-center`}
                      >
                        {task.isImportant ? "Yes" : "No"}
                      </td>
                      <td className="border p-2">
                        {formatDateNoti(task.dateUpload)}
                      </td>
                      {user._id === task.user?._id ? (
                        <td className="border p-2 flex gap-2">
                          <button
                            onClick={() => {
                              setModelEdit(true);
                              setTask(task);
                            }}
                            className="bg-blue-500 text-white p-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (!loadingDel) {
                                handleDelete(task._id);
                              }
                            }}
                            disabled={loadingDel}
                            className="bg-red-500 text-white p-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      ) : (
                        <td className="border p-2 flex gap-2">
                          No Actions to do
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <h2 className="text-center mt-5 text-2xl text-accent font-bold">
                    No Tasks
                  </h2>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
};

export default AllTasks;
