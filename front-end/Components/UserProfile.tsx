'use client'
import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // استيراد مكتبة للنافذة المنبثقة
import { useAuth } from "@/contexts/AuthContext"; // استيراد السياق للحصول على معلومات المستخدم
import axios from "axios"; // استيراد axios للتواصل مع الخادم
import { useModelContext } from "@/contexts/ModelContext";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useChangeAuth } from "@/contexts/ChangeContext";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const UserProfile = () => {
  const { user, setUser } = useAuth()!; // استخدام السياق للوصول إلى معلومات المستخدم
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000/";

  const imageUri = user?.image;
  const userImage = user?.image?.startsWith("uploads/")
    ? `${backendUrl}${user.image}`
    : user?.image?.startsWith("http")
    ? user.image
    : "/assets/user/jamal.webp";
  const [name, setName] = useState(user?.name || ""); // حالة لاسم المستخدم
  const [email, setEmail] = useState(user?.email || ""); // حالة لبريد المستخدم
  const [imageFile, setImageFile] = useState(null); // حالة لملف الصورة
  const [imagePreview, setImagePreview] = useState(userImage); // حالة لملف الصورة
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const modelCon = useModelContext();
    const [changeAuth,setChangeAuth] = useChangeAuth()
  const [modalIsOpen, setModalIsOpen] = modelCon!;
  const [loadingModel,setLoadingModel] = useState(false)
  const [desc,setDesc] = useState('')
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    if (file) {
           if (file.size > 1024 * 1024) {
             // 1 MB (1 MB = 1024 KB)
             toast.error("Image too large. Please choose a smaller image.");
             return;
           }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // تنظيف URL المؤقت عند تغيير الصورة
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }
  };
  // دالة لإرسال طلب التحديث إلى الخادم
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  setLoadingModel(true)
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("newPassword", newPassword);
  if(desc){

    formData.append("description", desc);
  }
  formData.append("role", user?.role || "user");
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await axios.put(
      `${backendUrl}api/users/${user?._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    const { success, data, error } = response.data;

    if (success) {
      // تحديث حالة الـ user بعد النجاح
      setTimeout(()=>{

        NotificationManager.success("Profile updated successfully");
        setChangeAuth('temrk'+Math.floor(Math.random() * 12).toString())
              setLoadingModel(false);
              setTimeout(()=>{
                        setModalIsOpen(false);

              },1000)

      },2500)
    } else {
      toast.error(error || "Something went wrong");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
  }
};


  const openModal = () => {
    setModalIsOpen(true);
  };

  // دالة لإغلاق النافذة
  const closeModal = () => {
    setModalIsOpen(false);
  };
  // استخدام useEffect لإعادة تعيين القيم عند إغلاق النافذة
  useEffect(() => {
    if (!modalIsOpen) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setImageFile(null);
      setImagePreview(userImage);
      setDesc(user?.description || "")
      setPassword("");
      setNewPassword("");
    }
  }, [modalIsOpen]);
  // دالة لفتح النافذة
  return (
    <div
      className={` duration-300 transition-all bg-black/35 z-[51] h-screen w-screen justify-center items-center flex fixed top-0
        ${modalIsOpen ? "opacity-100 left-0" : "opacity-0 left-[-150%]"}`}
    >
      <div className="relative w-3/5 overflow-y-auto max-h-[90vh] max-md:w-[90%] h-max bg-primary rounded-lg flex flex-col p-4 justify-between py-8 items-center">
        <span
          className={`absolute top-3 left-3 text-sm ${
            user?.role === "user" ? "bg-accent" : "bg-yellow-500"
          } px-2 py-1 rounded-xl cursor-pointer`}
        >
          Role:
          {user?.role}
        </span>
        <form
          onSubmit={handleSubmit}
          className="w-full flex justify-center items-center flex-col mt-4"
        >
          <div className="flex flex-col gap-y-2 items-center">
            <label className="text-white cursor-pointer flex flex-col gap-y-2 items-center justify-center">
              <Image
                width={150}
                height={150}
                src={imagePreview}
                className="rounded-full"
                alt={user?.name || ""}
              />
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
            <div>
              <label htmlFor="name" className="block text-accent mb-2">
                name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30} // تحديد الحد الأقصى للأحرف
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-accent mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="desc" className="block text-accent mb-2">
                Description
              </label>
              <textarea
                id="desc"
                className="w-full max-h-[150px] p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                maxLength={150}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-accent mb-2">
                Old Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-accent mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between w-full mt-4">
            <button
              disabled={loadingModel}
              type="submit"
              className="bg-accent text-white px-4 py-2 rounded hover:bg-accentHover transition duration-300"
            >
              {loadingModel ? (
                <div className="w-[100%] flex justify-center items-center">
                  <div className="w-[25px] h-[25px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
