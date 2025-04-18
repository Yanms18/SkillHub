import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/laststep.css";

function Laststep() {
  const Navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("skilled");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressSteps] = useState([
    { id: 0, text: "Basic Details", longText: "Basic Details", completed: false },
    { id: 1, text: "Profile Information", longText: "Profile Information", completed: false },
    { id: 2, text: "Verification", longText: "Verification", completed: true }
  ]);

  // Get form data from previous step
  const prevFormData = location.state?.formData || {};
  const [formData, setFormData] = useState({
    ...prevFormData,
    bvn: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, bvn: e.target.value });
  };

  const handleOptionChange1 = (option) => {
    setSelectedOption(option);
    Navigate('/getstarted');
  };

  const handleOptionChange2 = (option) => {
    setSelectedOption(option);
    Navigate('/consumerbtn');
  };

  const handleCreateAccount = async (e) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    Navigate("/signin");
  };

  return (
    <>
      <div className={`last-page ${showModal ? 'blur-background' : ''}`}>
        <br></br><br></br>
        <h2>Create Account</h2> <br />
        <h3>Already have an account? <a href="#">sign in</a></h3> <br />

        <div className="button">
          <button
            className={`consumer-btn ${selectedOption === 'consumer' ? 'active' : ''}`}
            onClick={() => handleOptionChange1('consumer')}
          >
            Consumer
          </button>
          <button
            id="ski-btn"
            className={`skill-btn ${selectedOption === 'skilled' ? 'active' : ''}`}
            onClick={() => handleOptionChange2('skilled')}
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
                    <div className={`step-circle ${step.completed ? 'active' : ''}`}>
                      {step.text}
                    </div>
                  </div>
                </li>
                {index < progressSteps.length - 1 && (
                  <div className={`connector-line ${step.completed ? 'active' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="lastdiv">
          <div className="profilepices">
            <div className="dotted-border">
              <img src="/images/cam.png" alt="video camera" />
            </div>
            <div className="text">
              <span>Drag & drop or click to upload an image of your choice.</span>
              <span>(PLEASE ENSURE IMAGE IS CLEAR AND SHOWS YOUR FACE)</span>
            </div>
          </div>

          <div className="profilepices">
            <div className="dotted-border">
              <img src="/images/mobile.png" alt="video camera" />
            </div>
            <div className="text">
              <span>Click to take a photo of your face</span>
              <span>ENSURE PHOTO IS TAKEN IN WELL LIT CONDITIONS</span>
            </div>
          </div>

          <div className="captions">
            <h3>Acceptable forms of ID - Passport, Drivers License, etc..</h3>
            <h3 style={{ marginLeft: "80px" }}>Why do we need this? <a href="" style={{ color: "blue" }}>Find Out</a></h3>
          </div>
          <div className="form-input">
            <form className="lastform" onSubmit={handleCreateAccount}>
              <label htmlFor="bvn">BVN (X-digits) <sup style={{ color: "red", fontSize: "10px" }}>*</sup></label> <br />
              <input
                className="input-bar"
                type="number"
                id="bvn"
                placeholder="Enter your BVN"
                required
                value={formData.bvn}
                onChange={handleInputChange}
              />
              <div className="last-btn">
                <button id="save-btn" className="btns" type="button">Save information</button>
                <button id="create-btn" className="btns" type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
              {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            </form>
          </div>
        </div>
      </div>

      {/* Congratulations Modal/Popover */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>CONGRATULATIONS</h2>
            <h3>Your account has been set up and you are almost ready to start selling your skill! Your profile will be verified within 3 - 5 working days.</h3>
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
    </>
  );
}

export default Laststep;