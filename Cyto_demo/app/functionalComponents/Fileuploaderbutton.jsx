'use client'
import React from "react";
import { useDropzone } from 'react-dropzone';
const FileUploaderButton = ({ onFileDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileDrop });

    return (
        <div className={`dropzone ${isDragActive ? 'active' : ''}`} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
            <p>Drop the FCS file here</p>
        ) : (
            <button className="btn">Add FCS File</button>
        )}
        </div>
    );
};

export default FileUploaderButton;