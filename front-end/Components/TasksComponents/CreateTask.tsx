import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useChangeWorkSpaces } from "@/contexts/Workspaces/ChangeWorkSpaces";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "next/navigation";

const CreateTask = ({ setModelTask, modelTask, user, setChangeTasks }: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { workId } = useParams();
  const [isImportant, setIsImportant] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dateUpload, setDateUpload] = useState(new Date());
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState("Pending");

  const [loadingModel, setLoadingModel] = useState(false);

  const closeModal = () => {
    setModelTask(false);
  };

  const createTask = async () => {
    try {
      if (!name || !description  || !user.name) {
        return toast.error("Please fill all the fields");
      }
      setLoadingModel(true);
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          name,
          description,
          workspace: workId,
          isImportant,
          isCompleted,
          dateUpload,
          dueDate,
          status,
          user: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (res && res.data.success === true) {
        setModelTask(false);
        toast.success("Task created successfully");
        setChangeTasks("test" + Date.now());
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingModel(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[99vw] bg-black/60 flex justify-center items-center z-[620] overflow-hidden">
      <div className="min-w-[450px] max-h-[90vh] overflow-y-auto bg-primary rounded-xl flex flex-col justify-start items-center px-4 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTask();
          }}
          className="w-full flex justify-center items-center flex-col"
        >
          <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
            <h2 className="text-2xl text-accent my-3 text-center font-bold">
              Create New Task
            </h2>
            <div>
              <label htmlFor="name" className="block text-accent mb-2">
                Task Name
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
              <label htmlFor="description" className="block text-accent mb-2">
                Task Description
              </label>
              <textarea
                id="description"
                className="w-full max-h-[150px] p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={400}
              />
            </div>
          
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
              <label htmlFor="isImportant" className="text-accent">
                Important
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCompleted"
                checked={isCompleted}
                onChange={(e) =>{
                   setIsCompleted(!isCompleted);
                }}
              />
              <label htmlFor="isCompleted" className="text-accent">
                Completed
              </label>
            </div>
            <div>
              <label htmlFor="dateUpload" className="block text-accent mb-2">
                Date Upload
              </label>
              <DatePicker
                selected={dateUpload}
                onChange={(date) => setDateUpload(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-accent mb-2">
                Due Date
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-accent mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
                <option value="Failed">Failed</option>
              </select>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
