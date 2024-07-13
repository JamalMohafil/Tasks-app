import Footer from "@/Components/Footer";
import LoginPage from "@/Components/LoginComponents/LoginPage";

export default function LoginFirstPage() {
  return (
    <>
      <div className=" px-10 max-sm:px-1 max-[360px]:px-1 py-4 justify-center max-h-[1620px]  flex items-start gap-10">
        <LoginPage />
      </div>
      <Footer />
    </>
  );
}
