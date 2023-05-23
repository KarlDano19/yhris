"use client"
import formatBytes from '@/helpers/formatBytes';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const DragDrop = ({ setValue }: { setValue?: Function }) => {
    const [files, setFiles] = useState<File[]>([]);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: any) => {
            const droppedFiles = acceptedFiles.map((file: any) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setFiles([...files, ...droppedFiles]);
        }
    });

    const thumbs = files.map((file: any, index: number) => (
        <div key={file.name} className="flex flex-col gap-2">
            <div className="rounded-md border-[1px] border-[#eaeaea] mr-2 p-2 min-w-fit max-w- box-border shadow-md">
                <div className="bg-gray-100 w-auto h-12">
                </div>
                <h4 className="text-center mt-2 text-xs">{file.name}</h4>
                <h4 className="text-center mt-2 text-xs">{formatBytes(file.size, 1)}</h4>
            </div>
            <button type="button" className="underline text-blue-500 text-sm" onClick={(e) => {
                e.stopPropagation();
                const removedItem = files.filter((_, index2) => index2 !== index);
                setFiles([...removedItem]);
            }}>Remove</button>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        if(setValue) {
            setValue(files);
        }
        return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, [files, setValue]);

    return (
        <section className="container">
            <div {...getRootProps({ className: `${files.length > 0 && "p-4"} min-h-fit border-[1px] border-[#ACB9CB] rounded-lg` })}>
                <input {...getInputProps()} />
                {files.length === 0 ? <p className="text-center my-12 text-[#CCD8EA] font-bold">Drop files to upload</p> : (
                    <aside className="flex flex-wrap gap-2">
                        {thumbs}
                    </aside>
                )}
            </div>
        </section>
    );
}

export default DragDrop