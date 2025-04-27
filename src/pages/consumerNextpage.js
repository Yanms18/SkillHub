import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/getstarted.css"
import { uploadImageToImgbb } from "../utils/imageUpload";

function ConsumerNextPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [selectedOption, setSelectedOption] = useState("skilled");
  
  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData, 
    role: "consumer",
    full_name: "",
    address: "",
    bio: "",
    photoURL: "",
    videoURL: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // New states for image preview
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
      completed: true,
    },
  ]);

  function changeStep() {
    navigate("/laststep");
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let key = id;
    if (id === "fullname") key = "full_name";
    if (id === "technical-skills") key = "consumer";
   
    setFormData({ ...formData, [key]: value });
  };

  const handleTextAreaChange = (e) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    navigate("/getstarted");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    navigate("/consumerbtn");
  };

  // Modified to show preview first
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError("");
    setSelectedFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setShowImagePreview(true);
    };
    reader.readAsDataURL(file);
  };
  
  // New function to confirm the selected image
  const confirmImage = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const photoURL = await uploadImageToImgbb(selectedFile);
      setFormData((prev) => ({
        ...prev,
        photoURL,
      }));
      setShowImagePreview(false);
    } catch (err) {
      setError("Image upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // New function to cancel the image selection
  const cancelImageSelection = () => {
    setShowImagePreview(false);
    setPreviewImage(null);
    setSelectedFile(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Final form data:", formData); // Log the form data here
    setError("");
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        { ...formData, role: "consumer" }, 
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
    navigate("/signin");
  };

  return (
    <div className="consumer-verification-container">
      <h2>Create Account</h2>
      <h3>
        Already have an account? <a href="/signin">sign in</a>
      </h3>
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
      
      <div className="progressbar">
        <ul>
          {progressSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <li>
                <div className="progress-step">
                  <div
                    className={`step-circle ${step.completed ? "active" : ""}`}
                  >
                    {step.text}
                  </div>
                </div>
              </li>
              {index < progressSteps.length - 1 && (
                <div
                  className={`connector-line ${step.completed ? "active" : ""}`}
                />
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="image-preview-overlay">
          <div className="image-preview-container">
            <h3>Preview Profile Image</h3>
            <div className="image-preview">
              <img src={previewImage} alt="Profile Preview" />
            </div>
            <div className="image-preview-actions">
              <button 
                className="confirm-image-btn" 
                onClick={confirmImage}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Confirm Image"}
              </button>
              <button 
                className="cancel-image-btn" 
                onClick={cancelImageSelection}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateAccount}>
        <div className="profile-pic-upload">
          <div 
            className="dashed-border profile-image-icon-file-button-container"
            onClick={triggerFileInput}
          >
            <img 
              className="profile-image-icon"
              src={formData.photoURL || "/images/camera.png"}
              alt="Profile Image Upload"
            />
          </div>

          <input
            className="profile-image-upload-button"
            type="file"
            id="profile-photo"
            accept="image/*"
            onChange={handlePhotoChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            required
          />

          <div className="key-image-upload-guidlines">
            <p>Drag & drop or choose file to upload an image of yourself.</p>
            <p>
              <strong>
                (PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)
              </strong>
            </p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullname">
              Full Name{" "}
              <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <input
              type="text"
              id="fullname"
              required
              value={formData.full_name}
              onChange={handleInputChange}
              className="fullname"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">
              Address{" "}
              <span>
                (only visible to you)
                <sup className="mandatory-asterik">*</sup>
              </span>
            </label>
            <input
              type="text"
              id="address"
              required
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">
              Bio<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
            </label>
            <textarea
              id="bio"
              required
              maxLength={200}
              value={formData.bio}
              onChange={handleTextAreaChange}
            />
          </div>
          
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
        
        /* Image preview styles */
        .image-preview-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .image-preview-container {
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          width: 90%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .image-preview-container h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #333;
        }

        .image-preview {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          max-height: 350px;
          overflow: hidden;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 350px;
          object-fit: contain;
          border-radius: 4px;
        }

        .image-preview-actions {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .confirm-image-btn, .cancel-image-btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .confirm-image-btn {
          background-color: #4a90e2;
          color: white;
        }

        .confirm-image-btn:hover {
          background-color: #357abD;
        }

        .confirm-image-btn:disabled {
          background-color: #a0c0e8;
          cursor: not-allowed;
        }

        .cancel-image-btn {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .cancel-image-btn:hover {
          background-color: #e5e5e5;
        }

        .cancel-image-btn:disabled {
          color: #999;
          cursor: not-allowed;
        }

        .error-message {
          color: red;
          margin-top: 12px;
          text-align: center;
        }
        
        /* Make the profile upload area clickable */
        .profile-image-icon-file-button-container {
          cursor: pointer;
          transition: all 0.2s ease;
          height : 200px;
          width:200px
        }

        .profile-image-icon-file-button-container:hover {
          opacity: 0.8;
        }
          .profile-image-icon{
          height:198px;
          width:199px;
          border-radius:100%;
        
          }
      `}</style>
    </div>
  );
}

export default ConsumerNextPage;