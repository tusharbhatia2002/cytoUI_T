'use client'
import React, { useEffect, useRef } from 'react';

const ServerRenderedComponent = ({ imageData }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageData) {
      displayImage();
    }
  }, [imageData]);

  const displayImage = () => {
    const img = new Image();
    img.src = `data:image/png;base64,${imageData}`;
    img.onload = () => {
      imageRef.current.appendChild(img);
    };
  };

  return (
    <div>
      <h1>Generated Plot</h1>
      <div ref={imageRef} />
    </div>
  );
};

export default ServerRenderedComponent; 





