import Footer from '@/Components/Footer';
import AllTasksPage from '@/Components/TasksComponents/AllTasksPage';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react'

const page = () => {
   

  return (
    <>
      <div className=" px-10 max-sm:px-3 max-[360px]:px-1 py-10 justify-center max-h-[1920px]  flex items-start gap-10">
        <AllTasksPage />
      </div>
      <Footer />
    </>
  );
}

export default page