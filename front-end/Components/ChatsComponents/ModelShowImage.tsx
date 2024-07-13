import React, { useRef, useEffect } from "react";

const ModelShowImage = ({ previewImg, setActiveModel }:any) => {
  const modelRef = useRef<any>(null);

  const handleClickOutside = (event:any) => {
    if (modelRef.current && !modelRef.current.contains(event.target)) {
      setActiveModel(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen w-[98vw] fixed left-0 z-[602] top-0 bg-black/35 flex justify-center items-center">
      <div
        ref={modelRef}
        className="min-w-[400px] max-sm:min-w-[200px] max-sm:max-w-[400px] max-sm:min-h-max max-w-[500px] max-h-[500px] border-accent border min-h-[400px] bg-primary p-2 rounded-lg flex justify-center items-center"
      >
        <img
          src={
            previewImg.startsWith("http")
              ? previewImg
              : `http://localhost:5000/${previewImg}`
          }
          className="w-full h-full max-h-[450px] object-contain rounded-lg"
          alt="previewImg"
        />
      </div>
    </div>
  );
};

export default ModelShowImage;
