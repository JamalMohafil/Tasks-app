  import React from 'react'

const Footer = () => {
  return (
    <div
      className="w-[100%] bg-primary border-t mt-10 border-accent flex justify-center 
    items-center font-arabic p-5 z-0 overflow-hidden"
    >
      Developed By: {" "}
      <a
        href="https://www.instagram.com/jamal_goving1/"
        className="text-accent ml-1"
      >
        {" "}
         Jamal Mohafil{" "}
      </a>{" "}
    </div>
  );
}

export default Footer