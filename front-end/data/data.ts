import { FaHome } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaCircleQuestion } from "react-icons/fa6";
import { MdOutlineNotificationImportant } from "react-icons/md";
import { IoMdChatbubbles } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";

export const LINKS = [
  {
    icon: FaHome,
    name: "Home",
    link: "/",
  },
  {
    icon: FaTasks,
    name: "All Workspaces",
    link: "/all-workspaces",
    add: "addWorkspace",
  },
  {
    icon: FaUserFriends,
    name: "Friends",
    link: "/friends/all-friends",
  },
  {
    icon: IoMdChatbubbles,
    name: "Chats",
    link: "/chats",
  },
  {
    icon: FaCircleQuestion,
    name: "About Us",
    link: "/about-us",
  },
];

export const TASKS = [
  {
    name: "TEst1",
    description: "test2",
    isImportant: false,
    isCompleted: false,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: false,
    isCompleted: true,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: true,
    isCompleted: true,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: true,
    isCompleted: false,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: true,
    isCompleted: false,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: true,
    isCompleted: true,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: false,
    isCompleted: false,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description:
      "test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2test2",
    isImportant: false,
    isCompleted: false,
    date: "2024/4/3",
  },
  {
    name: "TEst1",
    description: "test2",
    isImportant: false,
    isCompleted: false,
    date: "2024/4/3",
  },
];
