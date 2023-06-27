"use client"
  import React, { useState,useEffect } from "react";
  import Canvas from "./Canvas";
  import Navbar from "./Navbar";
  import MenuBar from "./MenuBar";
  import Sidebar from "./Sidebar";
  import usePlotStore from "@/app/store";

  // import PlotCreator from "../functionalComponents/Plotcreator";
  // import ServerRenderedComponent from "../functionalComponents/PlotDisplayer";

  // import LoadingIndicator from "../functionalComponents/LoadingIndicator";
  import axios from 'axios';

  const CanvasPage = () => {
    
    const [showMenuBar, setShowMenuBar] = useState(false);
    const [showPlotCreator, setShowPlotCreator] = useState(false);
    const [channelNames, setChannelNames] = useState([]);
    const [selectedPlotParams, setSelectedPlotParams] = useState({ xParam: "", yParam: "", xScale: "linear", yScale: "linear" });
    const [isLoadingPlot, setLoadingPlot] = useState(false);
    const [channelNamesFetched, setChannelNamesFetched] = useState(false); 
    const [imageData, setImageData] = useState("");
    useEffect(() => {
      getChannelnames();
    },[])
    const getChannelnames = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-column-names');
        if (response.status === 200) {
          console.log(response.data.columnNames);
          setChannelNames(response.data.columnNames);
          setChannelNamesFetched(true);
          // setIsLoading(false);
        } else {
          console.error('Error fetching column names');
        }
      } catch (error) {
        console.error('Error fetching column names', error);
      }
    };
    const onPlotsTablesClick = () => {
      setShowMenuBar(true);
    };

    const sendPlotData = async () => {
      const { xParam, yParam, xScale, yScale } = selectedPlotParams;
      const sendData = {
        x_column: xParam,
        y_column: yParam,
        x_scale: xScale,
        y_scale: yScale
      };


      try {
        setLoadingPlot(true);
        const response = await axios.post('http://localhost:8000/api/generate-plots', sendData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.status === 200) {
          const imageData = response.data.imageData;
          setImageData(imageData);
          console.log(imageData);
        } else {
          console.error('Error generating plots');
        }
      } catch (error) {
        console.error('Error generating plots', error);
      } finally {
        setLoadingPlot(false);
      }
    };

    const handlePlotCreation = () => {
      setLoadingPlot(true);
      sendPlotData();
    };

    const resetPlot = () => {
      setImageData('');
    };
    const setHandlePlotClick = usePlotStore((state) => state.setHandlePlotClick);

    const handleDotPlotClick = () => {
      setShowPlotCreator(true);
      console.log("Dot Plot clicked");
    };

    // console.log(showPlotCreator)
    useEffect(() => {
      setHandlePlotClick(handleDotPlotClick);
    }, [setHandlePlotClick, handleDotPlotClick]);
  

    return (
      <div className="bg-gray-100 flex flex-col h-screen">
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex flex-col flex-grow">
            <Navbar onPlotsTablesClick={onPlotsTablesClick} handleDotPlotClick={handleDotPlotClick} />
            <div className="border border-2 border-black flex-grow">
              {showMenuBar && (
                <MenuBar handleDotPlotClick={handleDotPlotClick}  /> 
              )}
              {channelNamesFetched && ( // Render the components when channel names are fetched
              <Canvas
                channelNames={channelNames}
                selectedPlotParams={selectedPlotParams}
                setSelectedPlotParams={setSelectedPlotParams}
                handlePlotCreation={handlePlotCreation}
                showPlotCreator={showPlotCreator}
                imageData={imageData}
                resetPlot={resetPlot}
                isLoadingPlot={isLoadingPlot}
              />
            )}

              {/* {isLoadingPlot ? (
                <LoadingIndicator />
              ) : (
                <>
                  {imageData && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4">Plot</h2>
                      <ServerRenderedComponent
                        imageData={imageData}
                        resetPlot={resetPlot}
                      />
                    </div>
                  )}
                </>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CanvasPage;
