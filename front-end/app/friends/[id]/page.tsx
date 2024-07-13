import Footer from "@/Components/Footer";
import AllFriendsPage from "@/Components/FriendsComponents/AllFriendsPage";
import FriendProfilePage from "@/Components/FriendsComponents/FriendProfilePage";
import FriendsRequestsPage from "@/Components/FriendsComponents/FriendsRequestsPage";
import WorkspaceRequestsPage from "@/Components/WorkSpacesComponents/WorkspaceRequestsPage";

export default function AllFriendsFirstPage() {
  return (
    <div className="flex flex-col h-max gap-y-2 ">
      <div
        className=" px-10 max-lg:px-2 max-lg:gap-0 max-sm:px-1
         max-[360px]:px-1 py-4 justify-center max-h-[1620px]
      flex items-start gap-10"
      >
        <FriendProfilePage />
      </div>
      <Footer />
    </div>
  );
}
