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
import { useChangeAuth } from "./ChangeContext";
import { useChangeFriends } from "./Friends/ChangeFriendsContext";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { useSocket } from "./SocketContext";
const jwt = require("jsonwebtoken");

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  description:string;
  blockList: any;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  onlineUsers:any;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [changeAuth, setChangeAuth] = useChangeAuth();

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

  const userId = token ? jwt.decode(token).userId : null;
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { data, error, mutate } = useSWR(
    userId ? `http://localhost:5000/api/users/${userId}` : null,
    (url) => fetcher(url, token!),
    {
      onSuccess: (data) => {
        setUser(data);
        setLoading(false);
      },
      onError: () => {
        setUser(null);
        setLoading(false);
      },
    }
  );
  useEffect(() => {
    if (changeAuth && userId) {
      mutate();
    }
   
  }, [changeAuth, userId, mutate]);
  const params = useParams()

 useEffect(() => {
   const fet = async () => {
     if (!params.chatId && user) {
       const res2 = await fetch(
         "http://localhost:5000/api/users/setChatId/"+user?._id,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${Cookies.get("token")}`,
           },
           body: JSON.stringify({
             chatId: "no-id",
           }),
         }
       );
       const data = await res2.json();
     }
     
   };
   fet();
 }, [params,user]);
 const [socket,setSocket] = useSocket()
 useEffect(()=>{
    if(user){
      const socket:any = io('http://localhost:5000',{
        query:{
          userId:user?._id
        }
      })
      setSocket(socket)
      socket.on('getOnlineUsers',(onlineUsers:any)=>{
        setOnlineUsers(onlineUsers)
      })
      socket.on('newMessage',(newMessage:any)=>{
        console.log(newMessage)
      })
      return ()=> socket.close()
    }else {
      if(socket){
        socket?.close()
        setSocket(null)
      }
    }
 },[user,user?._id])
  return (
    <AuthContext.Provider value={{ user, setUser, loading,onlineUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
