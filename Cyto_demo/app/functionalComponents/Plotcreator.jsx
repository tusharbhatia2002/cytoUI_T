import React, { useState } from 'react';

const PlotCreator = ({ channelNames, selectedPlotParams, setSelectedPlotParams, handlePlotCreation }) => {
  const { xParam, yParam, xScale, yScale } = selectedPlotParams;
  const [isPlotCreatorVisible, setIsPlotCreatorVisible] = useState(true);

  const hidePlotCreator = () => {
    setIsPlotCreatorVisible(false);
  };

  return (
    <>
      {isPlotCreatorVisible && (
        <div className="absolute left-8 top-4 bg-white p-4 rounded-lg shadow z-10 text-black">
          <h2 className="text-lg font-bold mb-4">Create Plots</h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="xParam">X Parameter:</label>
            <select
              id="xParam"
              className="p-2 border rounded text-sm text-black"
              value={xParam}
              onChange={(e) =>
                setSelectedPlotParams((prevParams) => ({
                  ...prevParams,
                  xParam: e.target.value,
                }))
              }
            >
              <option value=""> Select X-axis parameter </option>
              {channelNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={xScale}
              onChange={(e) =>
                setSelectedPlotParams((prevParams) => ({
                  ...prevParams,
                  xScale: e.target.value,
                }))
              }
              className="p-2 border rounded text-sm"
            >
              <option value="linear">Linear</option>
              <option value="log">Logarithmic</option>
              <option value="logicle">Logicle</option>
            </select>
            <label htmlFor="yParam">Y Parameter:</label>
            <select
              id="yParam"
              className="p-2 border rounded text-sm"
              value={yParam}
              onChange={(e) =>
                setSelectedPlotParams((prevParams) => ({
                  ...prevParams,
                  yParam: e.target.value,
                }))
              }
            >
              <option value="">  Select Y-axis parameter  </option>
              {channelNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={yScale}
              onChange={(e) =>
                setSelectedPlotParams((prevParams) => ({
                  ...prevParams,
                  yScale: e.target.value,
                }))
              }
              className="p-2 border rounded text-sm"
            >
              <option value="linear">Linear</option>
              <option value="log">Logarithmic</option>
              <option value="logicle">Logicle</option>
            </select>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!xParam || !yParam}
              onClick={() => {
                handlePlotCreation();
                hidePlotCreator();
              }}
            >
              Plot
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PlotCreator;

  