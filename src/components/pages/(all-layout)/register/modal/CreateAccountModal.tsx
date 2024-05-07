import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import DropDownArrow from "@/svg/DropDownArrow";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Confetti from "@/svg/Confetti";



interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateAccountModal = ({ open, onClose }: CreateAccountModalProps) => {
  const [signedUp, setSignUp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const renderConfirmation = () => {
    return (
      <div>
        <h3 className="text-indigo-dye text-xl md:text-3xl font-bold text-center">
          Email Confirmation Sent!
        </h3>
        <EnvelopeIcon className="h-20 w-20 text-savoy-blue mx-auto mt-3" />
        <p className="text-center text-indigo-dye px-9 font-medium">
          We have sent an email confirmation to{" "}
          <span className="text-savoy-blue font-semibold">
            henrymalinawon@gmail.com.
          </span>{" "}
          Please check your email to validate your account. Thank you and GOD
          bless!
        </p>
        <button
          type="button"
          className="mt-6 inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
          onClick={() => {
            setEmailVerified(true);
            setSignUp(false);
          }}
        >
          OKAY
        </button>
      </div>
    );
  };

  const renderSuccess = () => {
    return (
      <>
        <div>
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full">
            <Confetti />
          </div>
          <div className="mt-3 text-center sm:mt-3">
            <Dialog.Title
              as="h3"
              className="text-2xl font-semibold text-green-500"
            >
              Awesome!
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-indigo-dye font-bold">
                Well done, Henry!
                <br />
                You have succesfully validated your email.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              setEmailVerified(false);
              onClose();
            }}
          >
            CONTINUE
          </button>
        </div>
      </>
    );
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-10 `}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-10">
                {signedUp ? (
                  renderConfirmation()
                ) : emailVerified ? (
                  renderSuccess()
                ) : (
                  <form>
                    <div>
                      <div>
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-bold text-indigo-dye"
                        >
                          Create Account
                        </Dialog.Title>
                        <p className="text-indigo-dye">
                          You&apos;re almost there!
                        </p>
                      </div>

                      <div className="relative mt-6">
                        <label
                          htmlFor="role"
                          className="text-sm text-indigo-dye leading-6 text-gray-900"
                        >
                          Register As
                        </label>
                        <select
                          id="role"
                          name="role"
                          tabIndex={-1}
                          className="rounded-md appearance-none mt-1 w-full border-0 px-3 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                          defaultValue="Select..."
                        >
                          <option disabled className="text-gray-400">
                            Select...
                          </option>
                          <option>Employer</option>
                          <option>Applicant</option>
                        </select>
                        <div className="absolute right-4 top-[46px]">
                          <DropDownArrow />
                        </div>
                      </div>
                      <div className="relative flex items-start mt-5">
                        <div className="flex h-6 items-center">
                          <input
                            id="checkbox-agree"
                            aria-describedby="checkbox-agree"
                            name="checkbox-agree"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <p id="checkbox-agree">
                            I have read and agree with{" "}
                            <Link
                              href="#"
                              className="text-savoy-blue underline"
                            >
                              Terms of Service
                            </Link>
                            ,{" "}
                            <Link
                              href="#"
                              className="text-savoy-blue underline"
                            >
                              Privacy Notice
                            </Link>
                            , and{" "}
                            <Link
                              href="#"
                              className="text-savoy-blue underline"
                            >
                              Personal Data Collection and Disclosure Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="mt-6 inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300"
                        onClick={() => setSignUp(true)}
                      >
                        SIGN UP
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateAccountModal;
