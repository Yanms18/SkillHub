import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/nextstep.css";
import { uploadImageToImgbb } from "../utils/imageUpload";
import { uploadVideoToCloudinary } from "../utils/videoUpload"; // Update: now Cloudinary

function Nextstep() {
  const Navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState("skilled");
  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData,
    role: "skilled",
    full_name: "",
    areas_of_expertise: "",
    skill: "",
    address: "",
    service_area: "",
    bio: "",
    photoURL: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
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
    { id: 2, text: "Verification", longText: "Verification", completed: false },
  ]);

  function changeStep() {
    Navigate("/laststep", { state: { formData } });
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let key = id;
    if (id === "fullname") key = "full_name";
    if (id === "technical-skills") key = "skill";
    if (id === "service-area") key = "service_area";
    if (id === "areas_of_expertise") key = "areas_of_expertise";
    setFormData({ ...formData, [key]: value });
  };

  const handleTextAreaChange = (e) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerpages");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerbtn");
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    changeStep();
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

  // New state for video
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [videoURL, setVideoURL] = useState(formData.videoURL || "");

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoError("");
  };

  // Upload video to Cloudinary
  const uploadVideo = async () => {
    if (!videoFile) return;
    setVideoUploading(true);
    setVideoError("");
    try {
      const result = await uploadVideoToCloudinary(
        videoFile,
        formData.full_name || "intro_video",
        "Introductory video"
      );
      setVideoURL(result.secure_url);
      setFormData((prev) => ({
        ...prev,
        videoURL: result.secure_url,
      }));
    } catch (err) {
      setVideoError("Video upload failed. " + err.message);
    } finally {
      setVideoUploading(false);
    }
  };

  return (
    <>
      <h2>Create Account</h2>
      <h3>
        Already have an account? <a href="#">sign in</a>
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

        {/* Hidden file input */}
        <input
          className="profile-image-upload-button"
          type="file"
          id="profile-photo"
          accept="image/*"
          onChange={handlePhotoChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
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
      <br></br> <br></br>

      <div className="form-container">
        <form className="signup-form" onSubmit={handleNextStep}>
          {/* First row */}
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
                className="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="technical-skills">
                Please select your skill<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <select
                id="technical-skills"
                required
                value={formData.skill}
                onChange={handleInputChange}
              >
                <option value="">Please select your skill</option>
                <option value="Artist">Artist</option>
                <option value="Builder">Builder</option>
                <option value="Decorator">Decorator</option>
                <option value="Electrician">Electrician</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="areas_of_expertise">
              Areas of expertise?<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <input
                type="text"
                id="areas_of_expertise"
                required
                value={formData.areas_of_expertise}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Second row */}
          <div className="form-row">
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
              <label htmlFor="service-area">
                Service Area
                <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <select
                id="service-area"
                required
                value={formData.service_area}
                onChange={handleInputChange}
              >
                <option value="">Select area of coverage </option>
                <option value="1km">1km</option>
                <option value="5km">5km</option>
                <option value="10km">10km</option>
                <option value="20km">20km</option>
                <option value="Custom distance">Custom distance</option>
              </select>
            </div>
          </div>
          {/* Fourth row */}
          <div className="form-row">
            <div className="form-group bio-group">
              <label style={{ marginLeft: "-510px" }} htmlFor="bio">
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
            <div className="form-group video-group">
              <label htmlFor="intro-video">
                Introductory Video{" "}
                <span>
                  (optional)
                  <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
                </span>
              </label>
              <div className="video-upload">
                <div className="dotted-border-video" onClick={() => document.getElementById("intro-video").click()}>
                  <img src="/images/videocam.png" alt="video camera" />
                </div>
                <input
                  type="file"
                  id="intro-video"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={handleVideoChange}
                />
                {videoFile && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      type="button"
                      className="confirm-image-btn"
                      onClick={uploadVideo}
                      disabled={videoUploading}
                    >
                      {videoUploading ? "Uploading..." : "Upload Video"}
                    </button>
                  </div>
                )}
                {videoURL && (
                  <div style={{ marginTop: 10 }}>
                    <a href={videoURL} target="_blank" rel="noopener noreferrer">
                      View Uploaded Video
                    </a>
                  </div>
                )}
                {videoError && <p className="error-message">{videoError}</p>}
              </div>
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" onClick={changeStep} className="submit-btn">
              Next Step
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Nextstep;