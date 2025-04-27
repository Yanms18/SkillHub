import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/laststep.css";
import { uploadImageToImgbb } from "../utils/imageUpload";

function Laststep() {
  const Navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("skilled");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [progressSteps] = useState([
    {
      id: 0,
      text: "Basic Details",
      longText: "Basic Details",
      completed: false,
    },
    {
      id: 1,
      text: "Profile Information",
      longText: "Profile Information",
      completed: false,
    },
    { id: 2, text: "Verification", longText: "Verification", completed: true },
  ]);

  // Get form data from previous step
  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData,
    bvn: "", 
    bvn_URL: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, bvn: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate("/getstarted");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerbtn");
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Final form data:", formData); // Log the form data here
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        { ...formData, role: "skilled" },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        setShowModal(true);
      } else {
        setError(response.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(
        (err.response?.data?.message || "Network error. Please try again.") +
          "\n" +
          err?.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    Navigate("/signin");
  };

  const triggerFileInput = () => {
    // Programmatically click the hidden file input
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL for the selected image
    const previewURL = URL.createObjectURL(file);
    setPreviewImage({
      file: file,
      previewURL: previewURL
    });
    
    // Show the preview modal
    setShowImagePreview(true);
  };
  
  const confirmImageUpload = async () => {
    if (!previewImage?.file) return;
    
    setLoading(true);
    setError("");
    
    try {
      const bvn_URL = await uploadImageToImgbb(previewImage.file);
      setFormData((prev) => ({
        ...prev,
        bvn_URL,
      }));
      setShowImagePreview(false);
    } catch (err) {
      setError("Image upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const cancelImageUpload = () => {
    // Clean up the object URL to avoid memory leaks
    if (previewImage?.previewURL) {
      URL.revokeObjectURL(previewImage.previewURL);
    }
    
    setPreviewImage(null);
    setShowImagePreview(false);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={`last-page ${showModal || showImagePreview ? "blur-background" : ""}`}>
        <h2>Create Account</h2>
        <h3>
          Already have an account? <a href="#">Sign In</a>
        </h3>

        {/* Switch buttons */}
        <div className="switch-buttons-container">
          <div className="button">
            <button
              className={`consumer-btn ${
                selectedOption === "consumer" ? "active" : ""
              }`}
              onClick={() => handleOptionChange1("consumer")}
            >
              Consumer
            </button>
            <button
              id="ski-btn"
              className={`skill-btn ${
                selectedOption === "skilled" ? "active" : ""
              }`}
              onClick={() => handleOptionChange2("skilled")}
            >
              Skilled Person
            </button>
          </div>
        </div>

        {/* form progression bar */}
        <div className="progressbar">
          <ul>
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <li>
                  <div className="progress-step">
                    <div
                      className={`step-circle ${
                        step.completed ? "active" : ""
                      }`}
                    >
                      {step.text}
                    </div>
                  </div>
                </li>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`connector-line ${
                      step.completed ? "active" : ""
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        
        <form onSubmit={handleCreateAccount}>
          <div className="image-upload-container">
            <div className="image-request-container">
              <div className="profile-pic-upload">
                {/* Clickable dotted border container */}
                <div 
                  className="dashed-border profile-image-icon-file-button-container"
                  onClick={triggerFileInput}
                >
                  <img
                    className="profile-image-icon"
                    src={formData.bvn_URL || "/images/camera.png"}
                    alt="Profile Image Upload"
                  />
                  {!formData.bvn_URL && (
                    <div className="upload-icon-overlay">
                      {/* <span>Click to upload</span> */}
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  className="profile-image-upload-button hidden"
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                  required
                />

                <div className="key-image-upload-guidlines">
                  <p>Click the icon above to upload an image of yourself.</p>
                  <p>
                    <strong>
                      (PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)
                    </strong>
                  </p>
                </div>
              </div>
             
             {/* Take Photo Button */}
          <div className="take-photo-request-container">
            <div className="profilepices">
              <div className="dashed-border">
                <img
                  src="/images/mobile.png"
                  alt="video camera"
                  className="take-photo-icon"
                />
              </div>
              <div className="text">
                <span>Click to take a photo of your face</span>
                <strong>ENSURE PHOTO IS TAKEN IN WELL LIT CONDITIONS</strong>
              </div>
            </div>

            {/* Why do we need this */}
            <strong>
              Why do we need this?
              <a href="" className="find-out-link">
                {" "}
                Find Out
              </a>
            </strong>
          </div>
            
            </div>

            
          </div>

          <div className="bvn-form-input-container">
            <label htmlFor="bvn">
              Bank Verification Number (BVN)
              <sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-field"
              type="number"
              id="bvn"
              placeholder="Enter your 11-digit BVN"
              required
              value={formData.bvn}
              onChange={handleInputChange}
            />
          </div>

          <div className="buttons-container">
            <button id="save-btn" className="buttons" type="button">
              Save information
            </button>
            <button
              id="create-btn"
              className="buttons"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </form>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="modal-overlay">
          <div className="image-preview-modal">
            <h3>Profile Image Preview</h3>
            <div className="preview-image-container">
              <img 
                src={previewImage?.previewURL} 
                alt="Profile Preview" 
                className="preview-image" 
              />
            </div>
            <p>Is this the image you want to use?</p>
            <div className="preview-buttons">
              <button 
                className="cancel-btn" 
                onClick={cancelImageUpload}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={confirmImageUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal/Popover */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>CONGRATULATIONS</h2>
            <h3>
              Your account has been set up and you are almost ready to start
              selling your skill! Your profile will be verified within 3 - 5
              working days.
            </h3>
            <button className="continue-btn" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* CSS for the modals and blur effect */}
      <style jsx>{`
        .blur-background {
          filter: blur(5px);
          pointer-events: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .modal-content h2 {
          color: #007bff;
          margin-bottom: 15px;
        }

        .modal-content h3 {
          font-weight: normal;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .continue-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .continue-btn:hover {
          background-color: rgb(35, 112, 194);
        }
        
        /* Hide the default file input */
        .hidden {
          display: none !important;
        }
        
        /* Make the dotted border clickable */
        .profile-image-icon-file-button-container {
          position: relative;
          cursor: pointer;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s;
        }
        
        .profile-image-icon-file-button-container:hover {
          background-color: rgba(0, 123, 255, 0.05);
        }
        
        /* Add upload text overlay */
        .upload-icon-overlay {
          position: absolute;
          bottom: 10px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        /* Image Preview Modal Styles */
        .image-preview-modal {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 600px;
          width: 90%;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .image-preview-modal h3 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .preview-image-container {
          width: 100%;
          height: 350px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid #ddd;
          background-color: #f8f8f8;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .preview-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }
        
        .cancel-btn {
          background-color: #f2f2f2;
          color: #333;
          border: 1px solid #ddd;
          padding: 10px 25px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .cancel-btn:hover {
          background-color: #e6e6e6;
        }
        
        .confirm-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .confirm-btn:hover {
          background-color: rgb(35, 112, 194);
        }
        
        .confirm-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .image-preview-modal {
            padding: 20px;
            width: 95%;
          }
          
          .preview-image-container {
            height: 250px;
          }
          
          .preview-buttons {
            flex-direction: column;
            gap: 10px;
          }
          
          .cancel-btn,
          .confirm-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default Laststep;