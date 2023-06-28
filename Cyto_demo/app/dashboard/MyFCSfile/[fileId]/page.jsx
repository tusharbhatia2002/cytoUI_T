"use client";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import HeaderProfileNav from "@/app/HeaderProfileNav";
import axios from "axios";
import LoadingIndicator from "../../../functionalComponents/LoadingIndicator";
import { useRouter } from "next/router";
// import { useRouter } from 'next/router'

const SpilloverMatrix = ({params}) => {
  console.log(params);
  // const router = useRouter();
  const fileId = params.fileId;
  // const { fileId } = useGlobalContext();
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

const FileAnalysis = ({params}) => {
  const { data: session,status } = useSession();

  useEffect(() => {
    if (!session) {
      window.location.href = '/login'; // Redirect to login page if not authenticated
    }
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }); // Sign out and redirect to home page
  };

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const [columnNames, setColumnNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileId =params.fileId;
  useEffect(() => {
    getColumnNames();
  }, []);
  const getColumnNames = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get-column-names?file_id=${fileId}`);
      if (response.status === 200) {
        setColumnNames(response.data.columnNames);
        setIsLoading(false);
      } else {
        console.error("Error fetching column names");
      }
    } catch (error) {
      console.error("Error fetching column names", error);
    }
  };

  const parameterData = [
    { name: "Time", description: "Description for Time" },
    { name: "Cell_length", description: "Description for Cell_length" },
    { name: "DNA1", description: "Description for DNA1" },
    { name: "CD45RA", description: "Description for CD45RA" },
    { name: "CD133", description: "Description for DNA1" },
    { name: "CD19", description: "Description for DNA1" },
    { name: "CD22", description: "Description for DNA1" },
    { name: "CD11b", description: "Description for DNA1" },
    { name: "CD4", description: "Description for DNA1" },
    { name: "CD8", description: "Description for DNA1" },
    { name: "CD34", description: "Description for DNA1" },
    { name: "fit3", description: "Description for DNA1" },
    { name: "CD20", description: "Description for DNA1" },
    { name: "CXCR4", description: "Description for DNA1" },
    { name: "CD235ab", description: "Description for CD235ab" },
    // Add more parameter objects as needed
  ];
  // const router = useRouter();
  // const { channelNames } = router.query;

  // // Check if channelNames is defined and parse it if necessary
  // const parsedChannelNames = channelNames ? JSON.parse(channelNames) : [];
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white">
        <div className="flex items-center justify-between p-4 text-3xl font-extrabold ...">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
            CytoUI
          </span>
        </div>
        <nav className="mt-8">
          <div className="px-4">
            <h2 className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  <FaHome className="mr-2" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/MyFCSfile"
                  className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  <FaFileAlt className="mr-2" />
                  My FCS File
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-8 px-4">
            <h2 className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Admin
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/"
                  className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  <FaUsers className="mr-2" />
                  Members
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  <FaCog className="mr-2" />
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="flex items-center text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="bg-white shadow">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold text-black">File.fcs</h1>
            {/* Profile button */}
            <HeaderProfileNav />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-gradient-to-r from-cyan-100 to-blue-300">
          {/* Section 1: Open in Canvas */}
          <div className="mb-6 flex items-center">
            <img
              className="mr-4"
              width="80"
              height="80"
              src="https://img.icons8.com/external-line-colors-royyan-wijaya/80/external-canvas-cryp-finance-line-colors-royyan-wijaya.png"
              alt="external-canvas-cryp-finance-line-colors-royyan-wijaya"
            />
            <button>
              <a
                href={`/dashboard/MyFCSfile/${fileId}/canvasComponent`}
                className="text-white hover:text-cyan-300 text-lg font-medium bg-blue-700 rounded-lg px-3"
              >
                Open in Canvas
              </a>
            </button>
          </div>

          {/* Section 2: Parameters */}
          <div className="mb-6 text-black border-b">
            <h2 className="text-2xl font-bold mb-4">Parameters</h2>
            <div className="max-h-[calc(100vh/3)] overflow-y-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b text-black">
                      Channel Name
                    </th>
                    <th className="py-2 px-4 border-b text-black">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {columnNames.map((channelName, index) => (
                    <tr className="hover:bg-gray-100" key={index}>
                      <td className="py-2 px-4 border-b border-r text-black">
                        {channelName}
                      </td>
                      <td className="py-2 px-4 border-b text-black">
                        Description of {channelName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Compensation */}
          <div className="flex flex-col h-1/3">
            <h2 className="text-2xl font-bold mb-4 text-black">Compensation</h2>
            <div className="flex-1 h-2/3 bg-white rounded-lg overflow-y-auto shadow-md">
              <SpilloverMatrix params={params} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileAnalysis;
