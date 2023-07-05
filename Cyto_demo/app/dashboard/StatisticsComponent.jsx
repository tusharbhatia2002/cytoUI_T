import React from 'react'

const StatisticsComponent = () => {
    // You can replace the dummy data with actual user statistics
    const userStatistics = {
      totalFCSFilesLoaded: 3,
      visualization: 6,
      averageParameters: 2,
      graphsPlotted: 8,
    };
  
    return (
      <div className="shadow-lg rounded-xl h-1/3 md:w-4/12 mt-8 md:ml-2 p-4 bg-white bg-white text-gray-700 relative overflow-hidden">
        <div className="w-full">
          <p className="text-black text-bold text-2xl font-light mb-4">
            Task Progress
          </p>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <p>Total FCS Files Loaded</p>
            <p>{userStatistics.totalFCSFilesLoaded}/8</p>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full mb-4">
            <div
              className="w-1/3 h-full text-center text-xs text-white bg-green-400 rounded-full"
              style={{
                width: `${(userStatistics.totalFCSFilesLoaded / 8) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <p>Visualization</p>
            <p>{userStatistics.visualization}/10</p>
          </div>
          <div className="w-full h-2 bg-indigo-100 rounded-full mb-4">
            <div
              className="w-2/3 h-full text-center text-xs text-white bg-indigo-400 rounded-full"
              style={{
                width: `${(userStatistics.visualization / 10) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <p>Average Parameters</p>
            <p>{userStatistics.averageParameters}/8</p>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full mb-4">
            <div
              className="w-1/4 h-full text-center text-xs text-white bg-blue-400 rounded-full"
              style={{
                width: `${(userStatistics.averageParameters / 8) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between text-gray-400 text-sm">
            <p>Graphs Plotted</p>
            <p>{userStatistics.graphsPlotted}/8</p>
          </div>
          <div className="w-full h-2 bg-pink-100 rounded-full">
            <div
              className="w-full h-full text-center text-xs text-white bg-pink-400 rounded-full"
              style={{
                width: `${(userStatistics.graphsPlotted / 8) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

export default StatisticsComponent