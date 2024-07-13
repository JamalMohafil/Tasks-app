import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

interface TASK {
  name: string;
  description: string;
  isImportant: boolean;
  isCompleted: boolean;
  date: string;
}

const Task = ({ name, description, isImportant, isCompleted, date }: TASK) => {

  return (
    <div className="bg-[#3a3a3a] border h-[100%] justify-between px-3
     border-gray-400 rounded-xl py-4 flex flex-col gap-1">
   
    </div>
  );
};

export default Task;
