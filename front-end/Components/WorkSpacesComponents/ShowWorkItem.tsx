import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";

const ShowWorkItem = ({ id, setShowModal }: any) => {
  const [workSpace, setWorkSpace] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const workRef = useRef<any>();

  useEffect(() => {
    const fetchData = async () => {
      if(id){

        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/workspaces/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        const data = await res.json();
        setWorkSpace(data.workspace);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  // Handler to close the modal when clicking outside workRef
  const handleClickOutside = (event: any) => {
    if (workRef.current && !workRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-[100vw] h-[100vh] fixed z-[622] left-0 top-0 bg-black/50 flex justify-center items-center">
        <div
          ref={workRef}
          className="lg:min-w-[650px] max-h-[90vh] xl:min-w-[700px] relative md:min-w-[500px] sm:min-w-[300px] overflow-x-auto max-w-[850px] gap-y-2 min-h-[300px] border border-white/40 bg-primary p-5 flex flex-col justify-start items-center overflow-y-auto"
        >
          {loading ? (
            <div className="w-[100%] flex justify-center items-center">
              <div className="w-[25px] h-[25px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Link
                href={`/all-workspaces/${workSpace?._id}`}
                className="absolute right-2 top-3 bg-purple-400 px-2 py-1.5 rounded-lg text-xs"
              >
                Go to workspace
              </Link>
              <div className="flex flex-col gap-4 items-center">
                <Image
                  src={
                    workSpace?.image && workSpace?.image.startsWith("http")
                      ? workSpace?.image
                      : `http://localhost:5000/${workSpace?.image}`
                  }
                  alt="image"
                  className="rounded-lg"
                  width={150}
                  height={150}
                />
                <h2 className="text-2xl">{workSpace?.name}</h2>
                <p className="font-arabic text-center">{workSpace?.description}</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="w-[45%] mt-4">
                  <h3 className="text-lg font-bold mb-2">Members:</h3>
                  <div className="flex overflow-auto max-h-[300px] flex-col gap-4 justify-start items-start">
                    {workSpace?.members &&
                      workSpace.members.length > 0 &&
                      workSpace?.members
                        .slice(0, 4)
                        .map((member: any, index: number) => (
                          <Link href={`/friends/${member?._id}`}
                            key={index}
                            className="flex justify-start gap-1 items-start"
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={
                                  member?.image.startsWith("http")
                                    ? member?.image
                                    : `http://localhost:5000/${member.image}`
                                }
                                alt=""
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div>
                              <p className="font-medium max-w-[85%] overflow-hidden overflow-ellipsis max-h-[20px]">
                                {member?.name}
                              </p>
                              <p className="max-w-[100%] text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                                {member?.email}
                              </p>
                            </div>
                          </Link>
                        ))}
                    {workSpace &&
                      workSpace.members &&
                      workSpace.members.length > 0 &&
                      workSpace?.members.length > 4 && (
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-200 flex justify-center items-center rounded-full">
                            +{workSpace?.members.length - 4}
                          </div>
                          <p className="text-sm">More</p>
                        </div>
                      )}
                  </div>
                </div>

                <div className="w-[45%] mt-4">
                  <h3 className="text-lg font-bold mb-2">Admins:</h3>
                  <div className="flex overflow-x-auto gap-4 justify-start items-start py-4">
                    {workSpace &&
                      workSpace.admins &&
                      workSpace.admins.length > 0 &&
                      workSpace?.admins
                        .slice(0, 4)
                        .map((admin: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <Image
                              src={
                                admin.image.startsWith("http")
                                  ? admin.image
                                  : `http://localhost:5000/${admin.image}`
                              }
                              alt={`Admin ${index}`}
                              className="rounded-full"
                              width={80}
                              height={80}
                            />
                            <p className="text-sm">{admin.name}</p>
                            <p className="text-xs">{admin.email}</p>
                          </div>
                        ))}
                    {workSpace && workSpace.members &&
                      workSpace.members.length > 0 &&
                      workSpace?.admins.length > 4 && (
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-200 flex justify-center items-center rounded-full">
                            +{workSpace?.admins.length - 4}
                          </div>
                          <p className="text-sm">More</p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowWorkItem;
