import React from 'react';

const PlotCreator = ({  channelNames,
    selectedPlotParams,
    setSelectedPlotParams,
    handlePlotCreation}) => {
    const { xParam, yParam, xScale, yScale } = selectedPlotParams;
    console.log(channelNames);
    console.log(selectedPlotParams);
    console.log(setSelectedPlotParams);
    console.log(handlePlotCreation);
    return(
    <div className="container mx-auto mt-8">
    <h2 className="text-2xl font-bold mb-4">Create Plots</h2>
    <label htmlFor="xParam">X Parameter:</label>
    <select
        id="xParam"
        className="ml-2 black-text"
        value={xParam}
        onChange={(e) => setSelectedPlotParams(prevParams => ({
            ...prevParams,
            xParam: e.target.value
        }))}
    >
    <option value="">-- Select X-axis parameter --</option>
    {channelNames.map((name, index) => (
        <option key={index} value={name}>
            {name}
        </option>
        ))}
    </select>
    <select value={xScale} onChange={(e) =>setSelectedPlotParams(prevParams => ({
            ...prevParams,
            xScale: e.target.value
          }))} className='ml-2 black-text'>
        <option value="linear">Linear</option>
        <option value="log">Logarithmic</option>
        <option value="logicle">Logicle</option>
        </select>
    <label htmlFor="yParam">Y Parameter:</label>
    <select
        id="yParam"
        className='ml-2 black-text'
        value={yParam}
        onChange={(e) => setSelectedPlotParams(prevParams => ({
            ...prevParams,
            yParam: e.target.value
          }))}
    >
    <option value="">-- Select Y-axis parameter --</option>
    {channelNames.map((name, index) => (
        <option key={index} value={name}>
            {name}
        </option>
    ))}
    </select>
    <select value={yScale} onChange={(e) => setSelectedPlotParams(prevParams => ({
            ...prevParams,
            yScale: e.target.value
          }))} className='ml-2 black-text'>
        <option value="linear">Linear</option>
        <option value="log">Logarithmic</option>
        <option value="logicle">Logicle</option>
        </select>
    <button
        className="btn ml-4"
        disabled={!xParam || !yParam}
        onClick={handlePlotCreation}
    >
    Plot
    </button>
</div>
    )};

export default PlotCreator;
