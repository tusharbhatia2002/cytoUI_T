// store.js
import create from 'zustand';

const usePlotStore = create((set) => ({
  handlePlotClick: null,
  setHandlePlotClick: (handlePlotClick) => set({ handlePlotClick }),
}));

export default usePlotStore;
