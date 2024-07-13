"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useChangeNoti } from "./ChangeNotiContext";
import { useLimitNoti } from "./UpdateLimitNotiContext";
const jwt = require("jsonwebtoken");

interface Noti {
  notifications: Noti | null;
  _id: string;
  reciver: string;
  title: string;
  content: string;
  seen: boolean;
  link: string;
}

interface AuthContextType {
  notifics: Noti | null;
  setNotifics: React.Dispatch<React.SetStateAction<Noti | null>>;
  loading: boolean;
  loadNotis: () => void;
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

export const NotiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifics, setNotifics] = useState<Noti | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [changeNoti, setChangeNoti] = useChangeNoti();
  const [limitNoti, setLimitNoti] = useLimitNoti();

  useEffect(() => {
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
      setLoading(false);
    }
  }, []);

  const userId = token ? jwt.decode(token).userId : null;
  const { data, error, mutate } = useSWR(
    userId
      ? `http://localhost:5000/api/notifications/getMe?limit=${limitNoti}`
      : null,
    (url) => fetcher(url, token!),
    {
      onSuccess: (data) => {
        setNotifics(data);
        setLoading(false);
      },
      onError: () => {
        setNotifics(null);
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    if (changeNoti && userId) {
      setLoading(true);
      mutate().then(() => {
        setLoading(false);
      });
    }
  }, [changeNoti, userId, mutate, limitNoti]);

  const loadNotis = () => {
    setLoading(true);
    setLimitNoti((prevLimit:any) => prevLimit + 10); // أو أي قيمة مناسبة
    globalMutate(
      `http://localhost:5000/api/notifications/getMe?limit=${limitNoti + 10}`
    ).then(() => {
      setLoading(false);
    });
  };

  return (
    <AuthContext.Provider value={{ notifics, setNotifics, loading, loadNotis }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useNoti = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
