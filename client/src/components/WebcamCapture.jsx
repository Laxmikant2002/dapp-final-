import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture, disabled }) => {
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setShowCamera(false);
      if (onCapture) {
        onCapture(imageSrc);
      }
    }
  };

  const retakePhoto = () => {
    setShowCamera(true);
    setCapturedImage(null);
  };

  if (showCamera) {
    return (
      <div className="space-y-2">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full rounded-md"
          videoConstraints={{
            width: 720,
            height: 480,
            facingMode: "user"
          }}
        />
        <button
          type="button"
          onClick={capturePhoto}
          disabled={disabled}
          className="w-full !rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90 disabled:bg-gray-400"
        >
          Capture Photo
        </button>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="space-y-2 w-full">
        <img
          src={capturedImage}
          alt="Captured"
          className="w-full rounded-md"
        />
        <button
          type="button"
          onClick={retakePhoto}
          disabled={disabled}
          className="w-full !rounded-button bg-gray-500 text-white px-4 py-2 text-sm font-medium hover:bg-gray-600 disabled:bg-gray-400"
        >
          Retake Photo
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowCamera(true)}
      disabled={disabled}
      className="w-full !rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90 disabled:bg-gray-400"
    >
      Take Photo
    </button>
  );
};

export default WebcamCapture; 