"use client"
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import ZoomSlider from './ZoomSlider';
import PlotCreator from '../functionalComponents/Plotcreator';
import ServerRenderedComponent from '../functionalComponents/PlotDisplayer';
import LoadingIndicator from '../functionalComponents/LoadingIndicator';

const Canvas = ({
  channelNames,
  selectedPlotParams,
  setSelectedPlotParams,
  handlePlotCreation,
  showPlotCreator,
  imageData,
  resetPlot,
  isLoadingPlot
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const handleZoomChange = (newZoomLevel) => {
    // Limit the zoom range between 1 and 2
    if (newZoomLevel < 1) {
      newZoomLevel = 1;
    } else if (newZoomLevel > 2) {
      newZoomLevel = 2;
    }
    setZoomLevel(newZoomLevel);
  };

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#ffffff'
    });

    // Background Grid Lines
    const gridWidth = Math.ceil(fabricCanvas.current.width / 20);
    const gridHeight = Math.ceil(fabricCanvas.current.height / 20);
    const gridFill = '#eeeeee';
    const gridStroke = '#ccc';

    for (let i = 0; i < gridWidth; i++) {
      const line = new fabric.Rect({
        left: i * 20,
        top: 0,
        width: 1,
        height: fabricCanvas.current.height,
        fill: gridStroke,
        selectable: false,
        evented: false
      });
      fabricCanvas.current.add(line);
    }

    for (let i = 0; i < gridHeight; i++) {
      const line = new fabric.Rect({
        left: 0,
        top: i * 20,
        width: fabricCanvas.current.width,
        height: 1,
        fill: gridStroke,
        selectable: false,
        evented: false
      });
      fabricCanvas.current.add(line);
    }

    fabricCanvas.current.renderAll();

    return () => {
      fabricCanvas.current.dispose();
    };
  }, []);

  return (
    <div className="canvas-container w-full overflow-hidden bg-white">
      {/* <div className="menubar h-16 bg-gray-300">Menubar</div> */}
      <div className="relative">
        <canvas ref={canvasRef} className="mb-4" />
        {showPlotCreator && (
          <div className="absolute top-5 left-4 w-90 h-150 bg-gray-200 bg-opacity-40 z-10 mx-4 my-5 px-10 py-10 ">
            <PlotCreator
              selectedPlotParams={selectedPlotParams}
              setSelectedPlotParams={setSelectedPlotParams}
              channelNames={channelNames}
              handlePlotCreation={handlePlotCreation}
            />
          </div>
        )}
        {isLoadingPlot ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <LoadingIndicator />
          </div>
        ) : (
          imageData && (
            <div className="absolute bottom-2 left-4 w-82 h-82 bg-gray-200 bg-transparent z-10 mx-4 my-2 px-6 py-2">
  {/* <h2 className="text-2xl font-bold mb-4">Plot</h2> */}
  <ServerRenderedComponent imageData={imageData} resetPlot={resetPlot} />
</div>

          )
        )}
      </div>
      <div className="bg-gray-800 py-2">
        <ZoomSlider zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      </div>
    </div>
  );
};

export default Canvas;

