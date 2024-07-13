"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import io from "socket.io-client";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { useChangeWorkSpaces } from "./ChangeWorkSpaces";
import { useAuth } from "../AuthContext";

const jwt = require("jsonwebtoken");




const AuthContext = createContext<any>(undefined);

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

export const WorkSpacesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [workSpaces, setWorkSpaces] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  // const auth = useAuth()
  // const user = auth ? auth.user : null
    const [changeWorkSpaces, setChangeWorkSpaces] = useChangeWorkSpaces()
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
      setLoading(false);
    }
  }, []);

  const { data, error, mutate } = useSWR(
    `http://localhost:5000/api/workspaces`,
    (url) => fetcher(url, token!),
    {
      onSuccess: (data) => {
        setWorkSpaces(data);
        setLoading(false);
      },
      onError: () => {
        setWorkSpaces(null);
        setLoading(false);
      },
    }
  );
  useEffect(() => {
    if (changeWorkSpaces) {
      mutate();
    }
  }, [changeWorkSpaces, mutate]);

 
  return (
    <AuthContext.Provider value={{ workSpaces, setWorkSpaces, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useWorkspaces = (): any => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
