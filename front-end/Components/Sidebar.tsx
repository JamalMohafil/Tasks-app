'use client'
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LINKS } from "@/data/data";
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ContentLoader from "react-content-loader"; // استيراد مكتبة react-content-loader
import { useActiveSidebar } from "@/contexts/GlobalContext";
import { useModelContext } from "@/contexts/ModelContext";
import UserProfile from "./UserProfile";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser } from "react-icons/fa6";
import ShowImage from "./ShowImage";
import { IoIosNotifications } from "react-icons/io";
import { useNoti } from "@/contexts/Notifications/NotiContext";
import Notifications from "./Notifications";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { AiOutlineDownCircle, AiOutlineUpCircle } from "react-icons/ai"; // استخدام رموز السهم

import "react-notifications/lib/notifications.css";
import { CiCirclePlus } from "react-icons/ci";
import CreateWork from "./CreateWork";
import { useWorkspaces } from "@/contexts/Workspaces/GetWorkSpacesContext";
import { useChangeWorkSpaces } from "@/contexts/Workspaces/ChangeWorkSpaces";


const Sidebar = ({ User }: { User: any }) => {
  const pathname = usePathname();
  const [activeSidebar, setActiveSidebar] = useActiveSidebar();
  const router = useRouter();
  const { loading } = useAuth();
  const { notifics, setNotifics, loading: loadingNot } = useNoti();
  const [notis, setNotis] = useState(false);
  const modelCon = useModelContext();
  const [modalIsOpen, setModalIsOpen] = modelCon!;
  const [showImageS, setShowImage] = useState(false);
  const handleSignOut = () => {
    Cookies.remove("token");
    window.location.reload();
  };
  const handleSignIn = () => {
    router.push("/sign-in");
  };
  const userImage = User?.image?.startsWith("uploads/")
    ? `http://localhost:5000/${User.image}`
    : User?.image?.startsWith("http")
    ? User.image
    : "/assets/user/jamal.webp";

  const NotisActionClick = async () => {
    setModalIsOpen(false);
    setNotis(true);
    setActiveSidebar(false);
  };
  const countsNotis =
    notifics &&
    notifics?.notifications && (
        Array.isArray(notifics?.notifications) ? notifics.notifications : []
      )
      .map((noti: any) => noti.seen)
      .filter((seen: boolean) => seen === false).length;
  let userName = User?.name ? User.name : "User";

  // تحويل المسافات الفارغة إلى علامات <br>
  userName = userName.split("").join("<wbr>");
  const [modelWork, setModelWork] = useState(false);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const workSpaces = useWorkspaces()
  const [works, setWorks] = useState([])
  const [changeWorkSpaces, setChangeWorkSpaces] = useChangeWorkSpaces()
  useEffect(()=>{
    setChangeWorkSpaces('test'+Math.random())
  },[])
  useEffect(()=>{
    if (
      workSpaces &&
      workSpaces.workSpaces &&
      workSpaces.workSpaces.workspaces
    ) {
      setWorks(workSpaces.workSpaces.workspaces);
    }
  },[workSpaces])
  const [arrowDown, setArrowDown] = useState(true); // حالة السهم
const toggleWorkspaces = () => {
  setShowWorkspaces(!showWorkspaces);
  setArrowDown(!arrowDown);
};
  return (
    <>
      {modelWork && User && Cookies.get("token") && (
        <CreateWork
          setModelWork={setModelWork}
          user={User}
          modelWork={modelWork}
        />
      )}
      {User && Cookies.get("token") && <UserProfile />}
      <ToastContainer />
      <NotificationContainer />
      {notifics && (
        <Notifications setNotis={setNotis} notis={notis} notifics={notifics} loading={loadingNot} />
      )}
      {User && Cookies.get("token") && (
        <ShowImage
          image={User?.image}
          setShowImage={setShowImage}
          showImageS={showImageS}
        />
      )}
      <article
        className={`fixed top-0 left-0 h-screen w-screen lg:relative lg:h-max lg:w-[20%] min-[2500px]:w-[10%] overflow-auto transition-all z-50 ${
          activeSidebar ? "max-lg:left-0" : "max-lg:left-[-150%]"
        }`}
      >
        <div className="relative h-full w-full max-w-[250px] xl:max-w-[100%] bg-primary border-2 border-accent rounded-xl flex flex-col justify-between max-lg:overflow-y-auto">
          <span
            className="lg:hidden absolute top-[2%] right-[6%] cursor-pointer"
            onClick={() => setActiveSidebar(false)}
          >
            <MdOutlineClose className="text-3xl" />
          </span>

          {User && (
            <>
              <span
                className=" absolute top-[2%] left-[6%] text-accent cursor-pointer"
                onClick={() => {
                  setModalIsOpen(true);
                  setNotis(false);
                  setActiveSidebar(false);
                }}
              >
                <FaUser className="text-xl" />
              </span>
              <span
                className=" absolute top-[7%] left-[5.5%] text-accent cursor-pointer"
                onClick={() => {
                  NotisActionClick();
                }}
              >
                <IoIosNotifications className="text-2xl" />
                <span className="bg-accent text-white rounded-full w-[12px] flex justify-center items-center h-[12px] absolute right-[-25%] top-[-2%] text-[10px]">
                  {countsNotis}
                </span>
              </span>
            </>
          )}
          <div className="flex flex-col items-center justify-center h-max py-10 px-2">
            {/* Skeleton or User Info */}
            {loading && loadingNot ? (
              <ContentLoader
                speed={2}
                width={100}
                height={100}
                viewBox="0 0 100 100"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <circle cx="50" cy="50" r="50" />
              </ContentLoader>
            ) : (
              <>
                {/* Here goes your actual user info */}

                <Image
                  src={userImage}
                  width={100}
                  height={100}
                  className="rounded-full cursor-pointer z-[50]"
                  alt="User Image"
                  onClick={() => {
                    setShowImage(true);
                  }}
                />
                <h2
                  className="font-n text-white mt-2 cursor-pointer"
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                  dangerouslySetInnerHTML={{ __html: userName }}
                />
              </>
            )}
          </div>

          <div className="flex-grow px-4 mb-4">
            <ul className="w-[100%] flex list-none flex-col gap-4">
              {LINKS.map((item, i) => {
                const ItemIcon = item.icon;
                if(item.name === "Chats" && !User) return null
                if (item.add) {
                  return (
                    <div key={i}>
                      <li
                        className={`${
                          pathname === item.link &&
                          item.link !== "/all-workspaces"
                            ? "bg-accent"
                            : ""
                        } p-2 rounded flex items-center gap-2 ${
                          item.add && "justify-between "
                        }`}
                      >
                        {item.add ? (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center">
                              <Link
                                href={item.link}
                                className="flex items-center gap-2"
                              >
                                <ItemIcon className="text-white" />
                                <span className="text-white">{item.name}</span>
                              </Link>
                              {/* سهم التبديل بين الأسفل والأعلى */}
                              {User && (
                                <span
                                  className="text-white text-xl cursor-pointer"
                                  onClick={toggleWorkspaces}
                                >
                                  {arrowDown ? (
                                    <AiOutlineDownCircle />
                                  ) : (
                                    <AiOutlineUpCircle />
                                  )}
                                </span>
                              )}
                            </div>
                            {/* عنوان القائمة */}

                            {/* قائمة الأسماء */}
                            {User && (
                              <div
                                className={`${
                                  !arrowDown
                                    ? "max-h-0 mt-[-5px] transition-all overflow-hidden"
                                    : "max-h-[400px] transition-all overflow-hidden"
                                }`}
                              >
                                <ul
                                  className={`mt-2 ${
                                    (works &&
                                      works.length &&
                                      works.length < 1) ||
                                    (!User && "mt-[-10px]")
                                  } pl-2 flex flex-col gap-y-2.5`}
                                >
                                  {workSpaces.loading && User ? (
                                    <div className="w-[100%] flex justify-center items-center">
                                      <div className="w-[25px] h-[25px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  ) : works && works.length > 0 ? (
                                    works.map((itema: any, index: any) => (
                                      <li key={index}>
                                        <Link
                                          href={`/all-workspaces/${itema._id}`}
                                          className="hover:text-accent transition-all"
                                        >
                                          {itema.name}{" "}
                                          {itema.admins.some(
                                            (admin: any) => admin === User?._id
                                          ) && (
                                            <span className="text-white bg-accent rounded-xl text-sm ml-2 px-1 py-0.5">
                                              Admin
                                            </span>
                                          )}
                                        </Link>
                                      </li>
                                    ))
                                  ) : (
                                    User && (
                                      <div className="flex flex-col items-center justify-center">
                                        <h2 className="mb-2">
                                          You have no workspaces
                                        </h2>
                                        <span
                                          onClick={() => setModelWork(true)}
                                          className="cursor-pointer bg-accent text-white
                                       py-1.5 px-3 rounded-lg shadow-md hover:bg-accent-dark 
                                       transition-colors duration-300 text-sm"
                                        >
                                          Add Workspaces
                                        </span>
                                      </div>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <ItemIcon className="text-white" />
                            <span className="text-white">{item.name}</span>
                          </>
                        )}
                      </li>
                    </div>
                  );
                } else {
                  return (
                    <Link href={item?.link} key={i}>
                      <li
                        className={`${
                          pathname === item.link ? "bg-accent" : ""
                        } p-2 rounded flex items-center gap-2 ${
                          item.add && "justify-between "
                        }`}
                      >
                        <ItemIcon className="text-white" />
                        <span className="text-white">{item.name}</span>
                      </li>
                    </Link>
                  );
                }
              })}
            </ul>
          </div>

          {User ? (
            <button
              className="text-white flex gap-2 justify-center items-center rounded-lg px-2 py-3 bg-accent mx-4 cursor-pointer mb-4"
              onClick={handleSignOut}
              disabled={loading}
            >
              <FaSignOutAlt />
              <span>Sign out</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-4 w-full p-4">
              <button
                className="text-white flex-1 flex gap-2 justify-center items-center rounded-lg px-2 py-3 bg-accent cursor-pointer"
                onClick={handleSignIn}
                disabled={loading}
              >
                <IoMdLogIn />
                <span>Sign in</span>
              </button>
              <Link
                className="text-white flex-1 flex gap-2 justify-center items-center rounded-lg px-2 py-3 bg-accent cursor-pointer"
                href={"/login"}
              >
                <IoMdLogIn />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default Sidebar;
