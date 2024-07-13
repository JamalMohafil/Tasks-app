"use server";
import Cookies from "js-cookie";

const fetcher = async (url: string, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  return response.json();
};

export const getUserData = async (userId: string, token: string) => {
  return await fetcher(`http://localhost:5000/api/users/${userId}`, token);
};

export const setChatId = async (userId: string) => {
  const response = await fetch(
    `http://localhost:5000/api/users/setChatId/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ chatId: "no-id" }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to set chat ID");
  }

  return response.json();
};
