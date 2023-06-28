"use client";
import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import ZoomSlider from './ZoomSlider';
import PlotCreator from '@/app/functionalComponents/Plotcreator';
import ServerRenderedComponent from '@/app/functionalComponents/PlotDisplayer';
import LoadingIndicator from '@/app/functionalComponents/LoadingIndicator';


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
  const [showCreatePlotButton, setShowCreatePlotButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const imageObject = useRef(null);

  const handleZoomChange = (newZoomLevel) => {
    // Limit the zoom range between 1 and 2
    if (newZoomLevel < 1) {
      newZoomLevel = 1;
    } else if (newZoomLevel > 2) {
      newZoomLevel = 2;
    }
    setZoomLevel(newZoomLevel);
    fabricCanvas.current.setZoom(newZoomLevel);
    fabricCanvas.current.renderAll();
  };

  const handleCreatePlot = () => {
    // Call the plot creation function here
    handlePlotCreation();
  };

  const handleCanvasDoubleClick = (event) => {
    const { target } = event;
    if (target && target.type === 'image') {
      setShowDeleteButton(true);
      setButtonPosition({ x: event.pointer.x, y: event.pointer.y });
    }
    else {
      setShowCreatePlotButton(true);
      setButtonPosition({ x: event.pointer.x, y: event.pointer.y });
    }
  };

  const handleDeleteImage = () => {
    fabricCanvas.current.remove(imageObject.current);
    setShowDeleteButton(false);
  };

  const handleCanvasClick = () => {
    setShowCreatePlotButton(false);
    setShowDeleteButton(false);
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

    fabricCanvas.current.on('mouse:dblclick', handleCanvasDoubleClick);
    fabricCanvas.current.on('mouse:down', handleCanvasClick);

    return () => {
      fabricCanvas.current.off('mouse:dblclick', handleCanvasDoubleClick);
      fabricCanvas.current.off('mouse:down', handleCanvasClick);
      fabricCanvas.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (imageData) {
      fabric.Image.fromURL(`data:image/png;base64,${imageData}`, (img) => {
        imageObject.current = img;
        fabricCanvas.current.add(imageObject.current);
        fabricCanvas.current.renderAll();

        // Enable controls for the image
        imageObject.current.set({
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockScalingFlip: true,
          lockRotation: true
        });

        // Set initial position of the image in the canvas center
        imageObject.current.center();
        fabricCanvas.current.renderAll();
      });
    }
  }, [imageData]);

  return (
    <div className="canvas-container w-full overflow-hidden bg-white">
      <div
        className="relative"
        style={{ cursor: showCreatePlotButton || showDeleteButton ? 'auto' : 'crosshair' }}
      >
        <canvas ref={canvasRef} className="mb-4" />
        {showCreatePlotButton && (
          <div
            className="absolute left-0 top-0 bg-blue-500 text-white rounded"
            style={{
              left: buttonPosition.x,
              top: buttonPosition.y,
              padding: '4px',
              zIndex: 1,
            }}
          >
            <PlotCreator
              selectedPlotParams={selectedPlotParams}
              setSelectedPlotParams={setSelectedPlotParams}
              channelNames={channelNames}
              handlePlotCreation={handlePlotCreation}
            />
          </div>
        )}
        {showDeleteButton && (
          <button
            className="absolute left-0 top-0 bg-red-500 text-white rounded"
            style={{
              left: buttonPosition.x,
              top: buttonPosition.y,
              padding: '4px',
              zIndex: 1,
            }}
            onClick={handleDeleteImage}
          >
            Delete
          </button>
        )}
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
              <ServerRenderedComponent resetPlot={resetPlot} />
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
