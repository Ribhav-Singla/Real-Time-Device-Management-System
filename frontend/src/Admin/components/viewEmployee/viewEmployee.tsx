import { useEffect, useState } from "react";
import Spinner from "../../../Common/Spinner";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewEmployee() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/employee/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployee(response.data.employee);
        await new Promise((r) => setTimeout(r, 500));
        setLoading(false);
      } catch (error) {
        console.log("error in view employee: ", error);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-center items-center w-full pt-[100px]">
        <div className="flex-col justify-center items-center w-fit">
          <div className="bg-eerieBlack h-[250px] w-[250px] rounded-xl flex justify-center items-center">
            {
              //@ts-ignore
              employee.image ? (
                <img
                  //@ts-ignore
                  src={`${import.meta.env.VITE_BACKEND_URL}/${employee.image}`}
                  alt="Employee Image"
                  className="object-contain rounded-xl max-h-[250px]"
                />
              ) : (
                <img
                  src="/user.png"
                  alt="Employee Image"
                  className="object-contain rounded-xl max-h-[200px]"
                />
              )
            }
          </div>
          <div className="flex justify-center items-center gap-28">
            <div>
              <div className="mt-10 w-fit">
                <h1 className="text-blue-500">Model:</h1>
                {/* @ts-ignore */}
                <p className="text-4xl font-extrabold mt-1 text-floralWhite">{employee.name}</p>
              </div>
              <div className="mt-6 w-fit">
                <h1 className="text-blue-500">Company:</h1>
                {/* @ts-ignore */}
                <p className="text-4xl font-extrabold mt-1 text-floralWhite">{employee.email}</p>
              </div>
            </div>
            <div>
              <div className="mt-10 w-fit">
                <h1 className="text-blue-500">CreatedAt:</h1>
                {/* @ts-ignore */}
                <span className="text-4xl font-extrabold mt-1 text-floralWhite">
                  {
                    //@ts-ignore
                  new Date(employee.createdAt)
                    .toDateString()
                    .replace(/^\S+\s/, "")}{" "}
                  at {
                    //@ts-ignore
                  new Date(employee.createdAt).toLocaleTimeString()}
                </span>
                <span className="text-4xl font-extrabold mt-1"></span>
              </div>
              <div className="mt-6 w-fit">
                <h1 className="text-blue-500">Devices:</h1>
                {/* @ts-ignore */}
                <p className="text-4xl font-extrabold mt-1 text-floralWhite">
                  {
                    //@ts-ignore
                    employee.devices.length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
