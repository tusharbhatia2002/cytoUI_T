"use client"
import React, { useState,useEffect } from "react";
import axios from "axios";

const CompensationSection = ({ onClose,fileId }) => {
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    fetchSpilloverMatrix();
  }, []);

  // Function to fetch the spillover matrix from the backend
  async function fetchSpilloverMatrix() {
    try {
      const response = await axios.get(`http://localhost:8000/api/get-spillover-matrix?file_id=${fileId}`);
      const spilloverMatrix = response.data.spilloverMatrix;
      const formattedMatrix = Object.keys(spilloverMatrix).map((channel) => {
        return [channel, ...Object.values(spilloverMatrix[channel])];
      });
      setMatrixData(formattedMatrix);
    } catch (error) {
      console.error("Error fetching spillover matrix:", error);
      throw error;
    }
  }

  return (
    <div className="p-4 overflow-y-auto">
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-black">Channel</th>
            {matrixData[0] &&
              matrixData[0].slice(1).map((columnHeader, index) => (
                <th className="py-2 px-4 border-b text-black" key={index}>
                
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {matrixData.map((row, index) => (
            <tr className="hover:bg-gray-100" key={index}>
              {row.map((value, idx) => (
                <td className="py-2 px-4 border-b border-r text-black" key={idx}>
                  {idx === 0 ? value : value.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompensationSection;