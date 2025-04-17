import React, { useState } from "react";
import "../styles/getstarted.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Getstarted() {
  const Navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("consumer");
  const [formData, setFormData] = useState({
    role: "consumer",
    full_name: "",
    email: "",
    password: "",
    bio: "",
    address: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerpages");
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate("/consumerbtn");
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map form field ids to API field names
    let key = id;
    if (id === "fullname") key = "full_name";
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  // Handle textarea changes
  const handleTextAreaChange = (e) => {
    setFormData({
      ...formData,
      bio: e.target.value,
    });
  };

  // Handle photo change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      // Convert file to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });
      const base64 = await toBase64(file);

      // Upload to imgbb
      const form = new FormData();
      form.append("key", "f2acfbbcda824f11f3a15bdd6ffd9414");
      form.append("image", base64);

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          photoURL: data.data.url,
        }));
      } else {
        setError("Image upload failed.");
      }
    } catch (err) {
      setError("Image upload failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/auth/signup",
        formData,
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
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    Navigate("/signin");
  };

  return (
    <div className="getstarted">
      <br />222
      <div className="content-container">
        <div className="title-section">
          <h2>Create Account</h2>
          <br />
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
        </div>

        <div
          className="profilepice"
          style={{ width: "1200px", maxWidth: "100%" }}
        >
          <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
          <div className="dotted-border" style={{ flexDirection: "column" }}>
            <img
              src={formData.photoURL || "/images/camera.png"}
              alt="Profile pic"
            />
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              style={{ display: "block", marginTop: 10 }}
              onChange={handlePhotoChange}
            />
          </div>
          <div className="text">
            <span>
              Drag & drop or click to upload an image of your choice.
            </span>
            <span>
              (PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)
            </span>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* First row - 3 fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullname">
                Full Name <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Enter your full name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password<sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Second row - 3 fields */}
          <div className="form-row">
            {/* Skill, not required for consumer, so leave out of formData */}
            <div className="form-group">
              <label
                style={{ marginLeft: "-320px" }}
                htmlFor="technical-skills"
              >
                Skill <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <select id="technical-skills">
                <option value="">Please select your skill</option>
                <option value="Artist">Artist</option>
                <option value="Builder">Builder</option>
                <option value="Decorator">Decorator</option>
                <option value="Electrician">Electrician</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label
                style={{ marginLeft: "-150px" }}
                htmlFor="address"
              >
                Address{" "}
                <span>
                  (only visible to you)
                  <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
                </span>
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter your address"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="service-area">
                Service Area <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <select id="service-area">
                <option value="">Select your area of coverage</option>
                <option value="1km">1km</option>
                <option value="5km">5km</option>
                <option value="10km">10km</option>
                <option value="20km">20km</option>
                <option value="Custom distance">Custom distance</option>
              </select>
            </div>
          </div>

          {/* Fourth row - 2 fields */}
          <div className="form-row">
            <div className="form-group bio-group">
              <label
                style={{ marginLeft: "-510px" }}
                htmlFor="bio"
              >
                Bio <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
              </label>
              <textarea
                id="bio"
                placeholder="Write a short bio about yourself"
                required
                maxLength={200}
                value={formData.bio}
                onChange={handleTextAreaChange}
              />
            </div>

            <div className="form-group video-group">
              <label
                style={{ marginLeft: "-335px" }}
                htmlFor="intro-video"
              >
                Introductory Video{" "}
                <span>
                  (optional)
                  <sup style={{ color: "red", fontSize: "10px" }}>*</sup>
                </span>
              </label>
              <div className="video-upload">
                <div className="dotted-border-video">
                  <img src="/images/videocam.png" alt="video camera" />
                  {/* <input type="file" id="intro-video" accept="video/*" /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </form>
      </div>

      {/* Congratulations Modal/Popover for consumers */}
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h2>CONGRATULATIONS</h2>
                  <h3>Your account has been created successfully! You can now start exploring skilled professionals and services..</h3>
                  <button className="continue-btn" onClick={handleContinue}>Continue</button>
                </div>
              </div>
            )}
      
            {/* CSS for the modal and blur effect */}
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
                color:  #007bff;
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
                background-color:rgb(35, 112, 194);
              }
            `}</style>
    </div>
  );
}

export default Getstarted;
