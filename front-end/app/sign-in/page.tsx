import SignInPage from '@/Components/SignInComponents/SignInPage';
import React from 'react'

const page = () => {
  return (
    <div className=" px-10 max-sm:px-1 max-[360px]:px-1 py-4 justify-center max-h-[1620px]  flex items-start gap-10">
      <SignInPage />
    </div>
  );
}

export default page