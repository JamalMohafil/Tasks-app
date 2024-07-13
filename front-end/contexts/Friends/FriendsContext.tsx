'use client'
import React, { useEffect, useState } from "react";
import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { useChangeFriends } from "./ChangeFriendsContext";
const jwt = require("jsonwebtoken");

interface Friend {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  friends: Friend[] | null;
  setFriends: React.Dispatch<React.SetStateAction<Friend[] | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const FriendsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [changeFriends, setChangeFriends] = useChangeFriends();

  useEffect(() => {
    // Run only in the client
    const getCookie = (name: string) => {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
          return cookie[1];
        }
      }
      return null;
    };

    const token = getCookie("token");
    if (token) {
      setToken(token);
    } else {
      setLoading(true);
    }
  }, []);

  const userId = token ? jwt.decode(token).userId : null;

  const { data, error, mutate } = useSWR(
    userId
      ? `http://localhost:5000/api/users/getFriendRequests/${userId}`
      : null,
    (url) => fetcher(url, token!),
    {
      onSuccess: (data) => {
        setFriends(data.friendRequests);
        setLoading(true);
      },
      onError: () => {
        setFriends(null);
        setLoading(true);
      },
    }
  );

  useEffect(() => {
    if (changeFriends) {
      mutate();
    }
  }, [changeFriends, userId, mutate]);

  return (
    <AuthContext.Provider value={{ friends, setFriends, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useFriends = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
