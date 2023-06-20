"use client"
import React, { useState } from "react";

const CompensationSection = ({ onClose }) => {
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      // Process the FCS file contents and extract the necessary information
      // For simplicity, let's assume you extract the column names and descriptions as an array of objects
      const parsedData = parseFCSFile(contents);
      setFileData(parsedData);
    };

    reader.readAsText(file);
  };

  const parseFCSFile = (fileContents) => {
    // Parse the FCS file and extract the necessary information
    // Here, you can use FCS parsing libraries or implement your own logic
    // Let's assume you extract the column names and descriptions as an array of objects
    // Each object contains 'name' and 'description' properties
    const parsedData = [];

    // Perform parsing and populate 'parsedData' array

    return parsedData;
  };

  const closeParametersSection = () => {
    onClose();
  };

  return (
    <div className="border border-gray-700 flex flex-col rounded bg-gray-200 p-4 mx-0 my-0 py-0 px-0 h-full">
      <div className="flex justify-between items-center bg-gradient-to-b from-gray-400 to-gray-500 p-0 mx-0 my-0">
        <h6 className="text-xs font-semibold text-white flex-grow">Compenastion</h6>
        <button
          className="text-l text-white hover:bg-yellow-300 focus:outline-none px-2"
          onClick={closeParametersSection}
        >
          X
        </button>
      </div>
      <h6 className="text-xs font-semibold mt-4">Load FCS File</h6>
      <input
        type="file"
        accept=".fcs"
        onChange={handleFileUpload}
        className="mt-1 py-1 px-1 text-xs"
      />

      {fileData && fileData.length > 0 ? (
        <table className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {fileData.map((column, index) => (
              <tr key={index}>
                <td>{column.name}</td>
                <td>{column.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-xs">No file data loaded</p>
      )}
      <div className="flex mt-4">
        <button className="flex items-center mr-4">
          <img
            className="custom-icon mr-2"
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/align-cell-content-left.png"
            alt="align-cell-content-left"
          />
        </button>
        <button className="flex items-center mr-4">
          <img
            className="custom-icon mr-2"
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/align-cell-content-left.png"
            alt="align-cell-content-left"
          />
        </button>
        <button className="flex items-center mr-4">
          <img
            className="custom-icon mr-2"
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/align-cell-content-left.png"
            alt="align-cell-content-left"
          />
        </button>
        <button className="flex items-center">
          <img
            className="custom-icon mr-2"
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/align-cell-content-left.png"
            alt="align-cell-content-left"
          />
        </button>
      </div>
    </div>
  );
};

export default CompensationSection;