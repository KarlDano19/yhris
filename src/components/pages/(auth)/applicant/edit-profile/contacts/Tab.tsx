"use client";
import Link from "next/link";
import useGetContact from "../hooks/useGetContact";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import usePatchContact from "../hooks/usePatchContact";

interface T_UserContact{
  id:number
  userId:number
  email:string
  mobileNo:string
  landLineNo:string,
  contactPerson:string
  address:string
  age:number
  contactPersonContactNumber: string
  relationship:string
}

const Tab = () => {
  const {data, isLoading} = useGetContact(93)
  const handleLinkClick = () => {
    sessionStorage.setItem("showSavedModal", "true");
  };
const router = useRouter()
const { register, handleSubmit, reset } = useForm<T_UserContact>()
const {mutate:mutateContact, isLoading:mutateIsLoading} = usePatchContact(93)
const onSubmit = (data: T_UserContact) => {
    
  const callBackReq = {
    onSuccess: (data: any) => {
       if(!data.error){
        toast.success("Contact Successfully Updated")
        router.push("/apply-for-a-job")
       }
    },
    onError: (err: any) => {
      //toast.error(String(err)) //uncooment this if backend is ready
     toast.success("Contact Successfully Updated") //remove this when backend is ready
     router.push("/apply-for-a-job") //remove this when backend is ready
    },
  }

  mutateContact(data, callBackReq)
}
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-x-12">
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="email"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="email"
                {...register("email")}
                id="email"
                disabled={isLoading}
                      defaultValue={isLoading ? "Loading...": data?.email}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="mobile-num"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("mobileNo")}
                id="mobile-num"
                disabled={isLoading}
                      defaultValue={isLoading ? "Loading...": data?.mobileNo}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0">
            <label
              htmlFor="landline-num"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Landline No.
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("landLineNo")}
                id="landline-num"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.landLineNo}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <h6 className="text-indigo-dye md:col-span-3 text-sm font-semibold mt-6 mb-3">
            Contact Person
          </h6>
          <div className="grid-item md:col-span-1">
            <label
              htmlFor="name"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("contactPerson")}
                id="name"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.contactPerson}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4 md:mt-0 md:col-span-2">
            <label
              htmlFor="address"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("address")}
                id="address"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.address}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="age"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Age <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="number"
               {...register("age")}
                id="age"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.age}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="contact-person-mobile"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Mobile No. <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="tel"
                {...register("contactPersonContactNumber")}
                id="contact-person-mobile"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.conteactPersonContactNumber}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="grid-item mt-4">
            <label
              htmlFor="relationship"
              className="text-sm text-indigo-dye font-medium leading-6 text-gray-900"
            >
              Relationship <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                {...register("relationship")}
                id="relationship"
                disabled={isLoading}
                defaultValue={isLoading ? "Loading...": data?.relationship}
                className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="mt-10 md:mt-12 w-full md:w-auto text-center float-right mb-7 rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {mutateIsLoading ? (
                          <div
                            className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "SAVE"
                        )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Tab;
