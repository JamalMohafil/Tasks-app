import Footer from "@/Components/Footer";
import FriendsRequestsPage from "@/Components/FriendsComponents/FriendsRequestsPage";

export default function FriendsFirstPage() {
  return (
    <>
      <div
        className=" px-10 max-lg:px-2 max-lg:gap-0 max-sm:px-1 max-[360px]:px-1 py-4 justify-center max-h-[1620px]
      flex items-start gap-10"
      >
        <FriendsRequestsPage />
      </div>
      <Footer />
    </>
  );
}
