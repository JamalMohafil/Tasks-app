import axios from "axios";
import cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
export const SigninAction = async (e: React.FormEvent<HTMLFormElement>) => {
  e?.preventDefault();

  const username = e.currentTarget.username.value;
  const email = e.currentTarget.email.value;
  const password = e.currentTarget.password.value;
  const imageFile = e.currentTarget?.image?.files[0] || ''; // Get the selected image file
  if (password.length < 6)
    return toast.error("Password must be at least 6 characters");

  if (username === "" || email === "" || password === "") {
    return toast.error("You must fill in all fields");
  }
  const formData = new FormData();
  formData.append("name", username);
  formData.append("email", email);
  formData.append("password", password);
  if(imageFile){

    formData.append("image", imageFile);
  }

  try {
    setTimeout(async () => {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.token) {
        cookies.set("token", response.data.token);
        toast.success("Sign up successfull");
        setTimeout(() => {
          window.location.replace("/");
        }, 2500);
      }
    }, 2000);
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    toast.error("Error please try again later");
  }
};
