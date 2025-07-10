"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Controller } from "react-hook-form";

import CustomDatePicker from "@/components/CustomDatePicker";
import DrawSignatureModal from "../DrawSignatureModal";
import DrawNotedBySignatureModal from "../DrawNotedBySignature";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import ToggleSection from "./components/ToggleSection";
import ChemicalHazards from "./components/workplace-hazards/ChemicalHazards";
import PhysicalHazards from "./components/workplace-hazards/PhysicalHazards";
import ErgonomicHazards from "./components/workplace-hazards/ErgonomicHazards";
import BiologicalHazards from "./components/workplace-hazards/BiologicalHazards";

function WorkplaceSafetyCompliance({
  control,
  register,
  onSubmit,
  setSelectedTab,
  setValue,
  isLoading,
  watch,
}: {
  control: any;
  register: any;
  onSubmit: any;
  setSelectedTab: any;
  setValue: any;
  isLoading: boolean;
  watch: any;
}) {

  const [isChemicalHazardsOpen, setIsChemicalHazardsOpen] = useState(false);
  const [isPhysicalHazardsOpen, setIsPhysicalHazardsOpen] = useState(false);
  const [isErgonomicHazardsOpen, setIsErgonomicHazardsOpen] = useState(false);
  const [isBiologicalHazardsOpen, setIsBiologicalHazardsOpen] = useState(false);

  const toggleChemicalHazardsOpen = () =>
    setIsChemicalHazardsOpen(!isChemicalHazardsOpen);
  const togglePhysicalHazardsOpen = () =>
    setIsPhysicalHazardsOpen(!isPhysicalHazardsOpen);
  const toggleErgonomicHazardsOpen = () =>
    setIsErgonomicHazardsOpen(!isErgonomicHazardsOpen);
  const toggleBiologicalHazardsOpen = () =>
    setIsBiologicalHazardsOpen(!isBiologicalHazardsOpen);

  const [drawSignatureModal, setDrawSignatureModal] = useState(false);
  const [drawNotedBySignatureModal, setDrawNotedBySignatureModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [notedSignatureUrl, setNotedSignatureUrl] = useState<string>("");
  const [previousSignatureFile, setPreviousSignatureFile] = useState<string>("");
  const [previousNotedSignatureFile, setPreviousNotedSignatureFile] = useState<string>("");
  const [signatureSource, setSignatureSource] = useState<string>("");
  const [notedSignatureSource, setNotedSignatureSource] = useState<string>("");

  // Watch for existing signature URLs from form
  const existingSignatureUrl = watch("signature");
  const existingNotedSignatureUrl = watch("noted_signature");

  const toggleDrawSignatureModal = () => {
    setDrawSignatureModal(!drawSignatureModal);
  };

  const toggleDrawNotedBySignatureModal = () => {
    setDrawNotedBySignatureModal(!drawNotedBySignatureModal);
  };

  // Track current signature source and file
  useEffect(() => {
    const currentSignature = watch("signature");
    const currentSource = watch("signature_source");
    
    if (currentSignature && typeof currentSignature === "string") {
      setPreviousSignatureFile(currentSignature);
      return;
    }

    // Only show previews for unsaved signatures
    if (currentSource === "draw") {
    } else if (currentSource === "upload") {
    }
  }, [watch]);

  // Track current noted signature source and file
  useEffect(() => {
    const currentNotedSignature = watch("noted_signature");
    const currentSource = watch("noted_signature_source");
    
    if (currentNotedSignature && typeof currentNotedSignature === "string") {
      setPreviousNotedSignatureFile(currentNotedSignature);
      return;
    }

    // Only show previews for unsaved signatures
    if (currentSource === "draw") {
    } else if (currentSource === "upload") {
    }
  }, [watch]);

  const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("signature", file);
      setValue("previous_signature", previousSignatureFile);
      setValue("signature_source", "upload");
      setSignatureSource("upload");
      setSignatureUrl(URL.createObjectURL(file));
    }
  };

  const handleNotedSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("noted_signature", file);
      setValue("previous_noted_signature", previousNotedSignatureFile);
      setValue("noted_signature_source", "upload");
      setNotedSignatureSource("upload");
      setNotedSignatureUrl(URL.createObjectURL(file));
    }
  };

  // Handle drawn signature from modal
  const handleDrawnSignature = (drawnSignatureDataUrl: string) => {
    // Convert data URL to Blob
    fetch(drawnSignatureDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a File object from the Blob
        const file = new File([blob], "signature.png", { type: "image/png" });
        
        // Update form state with the File object
        setValue("signature", file);
        setValue("previous_signature", previousSignatureFile);
        setValue("signature_source", "draw");
        setSignatureSource("draw");
        setSignatureUrl(drawnSignatureDataUrl);
      });
  };

  // Handle drawn noted signature from modal
  const handleDrawnNotedSignature = (drawnSignatureDataUrl: string) => {
    // Convert data URL to Blob
    fetch(drawnSignatureDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // Create a File object from the Blob
        const file = new File([blob], "noted_signature.png", { type: "image/png" });
        
        // Update form state with the File object
        setValue("noted_signature", file);
        setValue("previous_noted_signature", previousNotedSignatureFile);
        setValue("noted_signature_source", "draw");
        setNotedSignatureSource("draw");
        setNotedSignatureUrl(drawnSignatureDataUrl);
      });
  };

  useEffect(() => {
    if (signatureUrl) {
      // If signatureUrl is a data URL from drawing
      if (signatureUrl.startsWith('data:')) {
        fetch(signatureUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "signature.png", { type: "image/png" });
            setValue("signature", file);
            setValue("previous_signature", previousSignatureFile);
            setValue("signature_source", "draw");
            setSignatureSource("draw");
          })
          .catch(err => {
            console.error("Error converting signature data URL to file:", err);
          });
      } else if (signatureUrl.startsWith('blob:')) {
        // Uploaded file preview
        setSignatureSource("upload");
      } else {
        setValue("signature", signatureUrl);
        setValue("previous_signature", signatureUrl);
        setValue("signature_source", "");
        setSignatureSource("");
      }
    }
  }, [signatureUrl, setValue, previousSignatureFile]);

  useEffect(() => {
    if (notedSignatureUrl) {
      // If notedSignatureUrl is a data URL from drawing
      if (notedSignatureUrl.startsWith('data:')) {
        fetch(notedSignatureUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "noted_signature.png", { type: "image/png" });
            setValue("noted_signature", file);
            setValue("previous_noted_signature", previousNotedSignatureFile);
            setValue("noted_signature_source", "draw");
            setNotedSignatureSource("draw");
          })
          .catch(err => {
            console.error("Error converting noted signature data URL to file:", err);
          });
      } else if (notedSignatureUrl.startsWith('blob:')) {
        // Uploaded file preview
        setNotedSignatureSource("upload");
      } else {
        setValue("noted_signature", notedSignatureUrl);
        setValue("previous_noted_signature", notedSignatureUrl);
        setValue("noted_signature_source", "");
        setNotedSignatureSource("");
      }
    }
  }, [notedSignatureUrl, setValue, previousNotedSignatureFile]);

  // Check if there are existing signature URLs (for edit mode)
  useEffect(() => {
    if (existingSignatureUrl && typeof existingSignatureUrl === 'string' && existingSignatureUrl.startsWith('http')) {
      setSignatureUrl(existingSignatureUrl);
      setSignatureSource("");
      // Ensure the existing signature is properly set in form state
      setValue("signature", existingSignatureUrl);
      setValue("previous_signature", existingSignatureUrl);
    }
  }, [existingSignatureUrl, setValue]);

  useEffect(() => {
    if (existingNotedSignatureUrl && typeof existingNotedSignatureUrl === 'string' && existingNotedSignatureUrl.startsWith('http')) {
      setNotedSignatureUrl(existingNotedSignatureUrl);
      setNotedSignatureSource("");
      // Ensure the existing signature is properly set in form state
      setValue("noted_signature", existingNotedSignatureUrl);
      setValue("previous_noted_signature", existingNotedSignatureUrl);
    }
  }, [existingNotedSignatureUrl, setValue]);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedByValue = watch("prepared_by");
    if (!preparedByValue || preparedByValue === "") {
      const el = document.getElementById("prepared_by");
      if (el) el.focus();
      return;
    }

    const notedByValue = watch("noted_by");
    if (!notedByValue || notedByValue === "") {
      const el = document.getElementById("noted_by");
      if (el) el.focus();
      return;
    }

    // Signature validation (drawn, uploaded, or existing)
    const signatureValue = watch("signature");
    const hasSignature =
      (signatureValue && typeof signatureValue === "string" && (signatureValue.startsWith("data:image/") || signatureValue.startsWith("http"))) ||
      (signatureValue && typeof signatureValue === "object" && signatureValue instanceof File);
    if (!hasSignature) {
      toast.dismiss();
      toast.custom(() => <CustomToast message="Submitted by signature is required (draw or upload)." type="error" />);
      return;
    }
    // Noted signature validation (drawn, uploaded, or existing)
    const notedSignatureValue = watch("noted_signature");
    const hasNotedSignature =
      (notedSignatureValue && typeof notedSignatureValue === "string" && (notedSignatureValue.startsWith("data:image/") || notedSignatureValue.startsWith("http"))) ||
      (notedSignatureValue && typeof notedSignatureValue === "object" && notedSignatureValue instanceof File);
    if (!hasNotedSignature) {
      toast.dismiss();
      toast.custom(() => <CustomToast message="Noted signature is required (draw or upload)." type="error" />);
      return;
    }
    // ...rest of your submit logic (e.g., setSelectedTab or actual submit)
    if (typeof onSubmit === 'function') onSubmit(e);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <>
        <div className="pr-8">
          <div className="hidden md:grid md:grid-cols-3 gap-4 pt-10">
            <div>{""}</div>
            <div>
              <h1 className="text-sm font-medium">Substances and Sources</h1>
            </div>
            <div>
              <h1 className="text-sm font-medium">No. of Workers Exposed</h1>
            </div>
          </div>

          {/* Chemical Hazards Section */}
          <ToggleSection
            title="a. Chemical Hazards:"
            isOpen={isChemicalHazardsOpen}
            onToggle={toggleChemicalHazardsOpen}
          >
            <ChemicalHazards register={register} setValue={setValue} watch={watch} />
          </ToggleSection>

          {/* Physical Hazards Section */}
          <ToggleSection
            title="b. Physical Hazards:"
            isOpen={isPhysicalHazardsOpen}
            onToggle={togglePhysicalHazardsOpen}
          >
            <PhysicalHazards register={register} setValue={setValue} watch={watch} />
          </ToggleSection>

          {/* Ergonomic Hazards Section */}
          <ToggleSection
            title="b. Ergonomic Stress:"
            isOpen={isErgonomicHazardsOpen}
            onToggle={toggleErgonomicHazardsOpen}
          >
            <ErgonomicHazards register={register} setValue={setValue} watch={watch} />
          </ToggleSection>

          {/* Biological Hazards Section */}
          <ToggleSection
            title="b. Biological Hazards:"
            isOpen={isBiologicalHazardsOpen}
            onToggle={toggleBiologicalHazardsOpen}
          >
            <BiologicalHazards register={register} setValue={setValue} watch={watch} />
          </ToggleSection>

          {/* Desktop layout - hidden on mobile: Submitted By, Draw/Upload Signature */}
          <div className="hidden md:grid grid-cols-3 gap-6 mt-4 pl-6 pr-6 mb-4">
            <div>
              <label
                htmlFor="prepared_by"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Submitted By
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("prepared_by", { required: true })}
                  id="prepared_by"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="draw_signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Draw Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <button
                  type="button"
                  className="w-full rounded-md bg-white border border-savoy-blue px-14 py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={toggleDrawSignatureModal}
                >
                  Draw
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  id="signature"
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureFileUpload}
                  className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                />
              </div>
            </div>
          </div>
          {/* Mobile layout - hidden on desktop: Submitted By, Draw/Upload Signature */}
          <div className="block md:hidden px-4 mb-4">
            <div className="mb-4">
              <label htmlFor="prepared_by" className="block text-sm font-medium leading-6 text-gray-900">
                Submitted By <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="prepared_by"
                value={watch("prepared_by") || ""}
                onChange={e => setValue("prepared_by", e.target.value)}
                className="mt-2 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="draw_signature" className="block text-sm font-medium leading-6 text-gray-900">
                Draw Signature <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                className="mt-2 w-full rounded-md bg-white border border-savoy-blue py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={toggleDrawSignatureModal}
              >
                Draw
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="signature" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Signature <span className="text-red-600">*</span>
              </label>
              <input
                id="signature"
                type="file"
                accept="image/*"
                onChange={handleSignatureFileUpload}
                className="mt-2 block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
            </div>
          </div>

          {/* Signature Preview - responsive */}
          {signatureUrl && (
            <div className="mt-4 flex flex-col items-center justify-center px-4 md:px-0">
              <div
                className={`text-center font-semibold mb-2 ${
                  signatureSource === "draw" || signatureSource === "upload"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {signatureSource === "draw" || signatureSource === "upload" ? "Preview" : "Existing Signature"}
              </div>
              <Image
                className="border-0 ring-1 ring-inset ring-gray-300 m-auto mb-6 max-w-full h-auto"
                src={signatureUrl}
                width={500}
                height={200}
                alt="signatureImage"
              />
            </div>
          )}

          {/* Desktop layout - hidden on mobile: Noted By, Draw/Upload Signature */}
          <div className="hidden md:grid grid-cols-3 gap-6 mt-4 pl-6 pr-6 mb-4">
            <div>
              <label
                htmlFor="noted_by"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Noted By
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  {...register("noted_by", { required: true })}
                  id="noted_by"
                  className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="draw_noted_signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Draw Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <button
                  type="button"
                  className="w-full rounded-md bg-white border border-savoy-blue px-14 py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={toggleDrawNotedBySignatureModal}
                >
                  Draw
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="noted_signature"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Upload Signature
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <input
                  id="noted_signature"
                  type="file"
                  accept="image/*"
                  onChange={handleNotedSignatureFileUpload}
                  className="block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
                />
              </div>
            </div>
          </div>
          {/* Mobile layout - hidden on desktop: Noted By, Draw/Upload Signature */}
          <div className="block md:hidden px-4 mb-4">
            <div className="mb-4">
              <label htmlFor="noted_by" className="block text-sm font-medium leading-6 text-gray-900">
                Noted By <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="noted_by"
                value={watch("noted_by") || ""}
                onChange={e => setValue("noted_by", e.target.value)}
                className="mt-2 rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="draw_noted_signature" className="block text-sm font-medium leading-6 text-gray-900">
                Draw Signature <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                className="mt-2 w-full rounded-md bg-white border border-savoy-blue py-1.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={toggleDrawNotedBySignatureModal}
              >
                Draw
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="noted_signature" className="block text-sm font-medium leading-6 text-gray-900">
                Upload Signature <span className="text-red-600">*</span>
              </label>
              <input
                id="noted_signature"
                type="file"
                accept="image/*"
                onChange={handleNotedSignatureFileUpload}
                className="mt-2 block w-full rounded-md border-0 py-1 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100"
              />
            </div>
          </div>

          {/* Noted Signature Preview - responsive */}
          {notedSignatureUrl && (
            <div className="mt-4 flex flex-col items-center justify-center px-4 md:px-0">
              <div
                className={`text-center font-semibold mb-2 ${
                  notedSignatureSource === "draw" || notedSignatureSource === "upload"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {notedSignatureSource === "draw" || notedSignatureSource === "upload" ? "Preview" : "Existing Signature"}
              </div>
              <Image
                className="border-0 ring-1 ring-inset ring-gray-300 m-auto mb-6 max-w-full h-auto"
                src={notedSignatureUrl}
                width={500}
                height={200}
                alt="notedSignatureImage"
              />
            </div>
          )}

          {/* Desktop layout - hidden on mobile: Date of Report */}
          <div className="hidden md:grid grid-cols-3 gap-6 mt-4 pl-6 pr-6 mb-4">
            <div>
              <label
                htmlFor="date_of_report"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date of Report
                <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-2">
                <Controller
                  control={control}
                  name="date_of_report"
                  render={({ field }) => (
                    <CustomDatePicker
                      id="date_of_report"
                      placeholder={"mm/dd/yyyy"}
                      className={
                        "block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none"
                      }
                      selected={field.value ? new Date(field.value) : null}
                      pickerOnChange={(date: any) => field.onChange(date)}
                      inputOnChange={(value: any) => field.onChange(value)}
                      required={true}
                    />
                  )}
                />
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
          {/* Mobile layout - hidden on desktop: Date of Report */}
          <div className="block md:hidden px-4 mb-4">
            <div className="mb-4">
              <label htmlFor="date_of_report" className="block text-sm font-medium leading-6 text-gray-900">
                Date of Report
              </label>
              <Controller
                control={control}
                name="date_of_report"
                render={({ field }) => (
                  <CustomDatePicker
                    id="date_of_report"
                    placeholder={"mm/dd/yyyy"}
                    className={
                      "mt-2 block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm appearance-none"
                    }
                    selected={field.value ? new Date(field.value) : null}
                    pickerOnChange={(date: any) => field.onChange(date)}
                    inputOnChange={(value: any) => field.onChange(value)}
                    required={true}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </>
      {drawSignatureModal && (
        <DrawSignatureModal
          isOpen={drawSignatureModal}
          setIsOpen={setDrawSignatureModal}
          setSignatureUrl={(url: any) => {
            setSignatureUrl(url);
            handleDrawnSignature(url);
          }}
        />
      )}
      {drawNotedBySignatureModal && (
        <DrawNotedBySignatureModal
          isOpen={drawNotedBySignatureModal}
          setIsOpen={setDrawNotedBySignatureModal}
          setNotedSignatureUrl={(url: any) => {
            setNotedSignatureUrl(url);
            handleDrawnNotedSignature(url);
          }}
        />
      )}
      <hr />
      <div className="py-4 px-4 flex justify-between">
      <button
          type="button"
          className="w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setSelectedTab(7)}
        >
          Back
        </button>
        <button
          type="submit"
          className="w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isLoading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          {!isLoading && "Submit"}
        </button>
      </div>
    </form>
  );
}

export default WorkplaceSafetyCompliance;
