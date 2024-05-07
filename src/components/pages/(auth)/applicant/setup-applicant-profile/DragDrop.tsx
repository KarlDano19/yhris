"use client";
import formatBytes from "@/helpers/formatBytes";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDrop = ({ setValue }: { setValue?: Function }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: any) => {
      const droppedFiles = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles([
        ...files,
        ...droppedFiles.filter((file: any) => file.size <= 5000000),
      ]);
    },
  });

  const thumbs = files.map((file: any, index: number) => (
    <div key={file.name} className="flex flex-col gap-2">
      <div className="rounded-md border-[1px] border-[#eaeaea] mr-2 p-2 min-w-fit max-w- box-border shadow-md">
        <div className="bg-gray-100 w-auto h-12"></div>
        <h4 className="text-center mt-2 text-xs">{file.name}</h4>
        <h4 className="text-center mt-2 text-xs">
          {formatBytes(file.size, 1)}
        </h4>
      </div>
      <button
        type="button"
        className="underline text-blue-500 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          const removedItem = files.filter((_, index2) => index2 !== index);
          setFiles([...removedItem]);
        }}
      >
        Remove
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    if (setValue) {
      setValue(files);
    }
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files, setValue]);

  return (
    <section className="container">
      <div
        {...getRootProps({
          className: `${
            files.length > 0 && "p-4"
          } min-h-fit h-56 border-2 border-[#D1DEEF] border-dashed rounded-lg`,
        })}
      >
        <input {...getInputProps()} />
        {files.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <span className="font-medium text-[#D1DEEF] text-2xl">
              Drop file to Upload
            </span>
            <span className="text-xl font-medium text-[#D1DEEF]">
              Maximum file size: 5MB
            </span>
          </div>
        ) : (
          <aside className="flex items-center justify-center h-full flex-wrap gap-2">
            {thumbs}
          </aside>
        )}
      </div>
    </section>
  );
};

export default DragDrop;
