'use client'
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const LoginAction = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const email = e.currentTarget.email.value;
  const password = e.currentTarget.password.value;
  if(email === '' || password === '' ) return toast.error("You must fill in all fields");
  if (password.length < 6)return toast.error("Password must be at least 6 characters");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      const data = response.data;

      setTimeout(() => {
        const data = response.data;

        if (data && data.token) {
          toast.success("تم تسجيل الدخول بنجاح");
          Cookies.set("token", data.token);
          setTimeout(() => {
            window.location.replace("/");
          }, 1500);
        }
      }, 500);

      if (!response) {
        toast.error("Email or Password is wrong");
      }
    } catch (error: any) {
      console.log("Error fetching data:", error);
      if (error.response.data.message === "Email or password incorrect") {
        toast.error("Email or Password is wrong");
      } else {
        toast.error("Error please try again later");
      }
    }
};
