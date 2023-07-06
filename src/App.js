import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import plupload from 'plupload';
import axios from 'axios'
const App = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('user');

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const switchCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === 'user' ? 'environment' : 'user'
    );
  };

  const handleUpload = () => {
  
    if (capturedImage) {
      const blobUrl = capturedImage;
      const filename = 'capturedImage.png';

      fetch(blobUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], filename);

          const formData = new FormData();
          formData.append('file', file);
          formData.append('name', 'capturedImage.png');
          formData.append('empName', 'akash');
          formData.append('empId', 'SI006423');
          formData.append('category', 'bowl');
          formData.append('chunks', 1);
          formData.append('chunk', 0);

          return axios.post('http://10.175.206.38:3038/api/image-upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        })
        .then((response) => {
          console.log('Image uploaded successfully:', response.data);
          // Perform any additional actions after successful upload
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
          // Handle upload error
        });
    }
  };



  return (
    <div>
      <Webcam audio={false} ref={webcamRef} mirrored={facingMode === 'user'} />

      <button onClick={captureImage}>Capture Image</button>
      <button onClick={switchCamera}>Switch Camera</button>

      {capturedImage && (
        <div>
          <h2>Captured Image:</h2>
          <img src={capturedImage} alt="Captured" />
          <button id="upload-button" onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default App