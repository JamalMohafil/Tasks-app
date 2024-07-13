import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Sidebar from "@/Components/Sidebar";
import { GlobalProvider } from "@/contexts/GlobalContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/Components/Footer";
import { ModelProvider } from "@/contexts/ModelContext";
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});
import { QueryClient, QueryClientProvider } from "react-query";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
import dotenv from "dotenv"; // لـ .ts
import { ChangeAuthProvider } from "@/contexts/ChangeContext";
import { NotiProvider } from "@/contexts/Notifications/NotiContext";
import { ChangeNotiProvider } from "@/contexts/Notifications/ChangeNotiContext";
import { ChangeFriendsProvider } from "@/contexts/Friends/ChangeFriendsContext";
import { FriendsProvider } from "@/contexts/Friends/FriendsContext";
import { SendMessageChangeProvider } from "@/contexts/Chats/SendMessageChangeContext";
import { LimitChatChangeProvider } from "@/contexts/Chats/LimitChatChangeContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SocketProvider } from "@/contexts/SocketContext";
import { ChangeWorkpacesProvider } from "@/contexts/Workspaces/ChangeWorkSpaces";
import { WorkSpacesProvider } from "@/contexts/Workspaces/GetWorkSpacesContext";
import { LimitNotiProvider } from "@/contexts/Notifications/UpdateLimitNotiContext";
dotenv.config(); // لـ .ts
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} relative x-no`}>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <ChangeAuthProvider>
            <SocketProvider>
              <ChangeNotiProvider>
                <AuthProvider>
                  <LimitNotiProvider>
                    <NotiProvider>
                      <ChangeFriendsProvider>
                        <FriendsProvider>
                          <SendMessageChangeProvider>
                            <ModelProvider>
                              <GlobalProvider>
                                <LimitChatChangeProvider>
                                  <ChangeWorkpacesProvider>
                                    <WorkSpacesProvider>
                                      <>
                                        {" "}
                                        <div className="w-full h-full bg-black/90 absolute left-0 top-0 z-[-49]" 
                                        ></div>
                                        <img
                                          src={"/palestine.jpg"}
                                          className="absolute left-0 w-full top-0 z-[-50] h-full object-cover"
                                        />
                                        {children}
                                      </>
                                    </WorkSpacesProvider>
                                  </ChangeWorkpacesProvider>
                                </LimitChatChangeProvider>
                              </GlobalProvider>
                            </ModelProvider>
                          </SendMessageChangeProvider>
                        </FriendsProvider>
                      </ChangeFriendsProvider>
                    </NotiProvider>
                  </LimitNotiProvider>
                </AuthProvider>
              </ChangeNotiProvider>
            </SocketProvider>
          </ChangeAuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
