import React, { useState, useEffect } from "react";
import { useTrades } from "../TradesContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/hiringartisanPage.css";

function HiringartisanPage() {
  const { tradespeople } = useTrades();
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state to track input values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    startTime: "",
    notes: "",
    checkbox: "",
  });

  // Load user data from multiple sources
  useEffect(() => {
    let foundPerson =
      tradespeople && tradespeople.length > 0
        ? tradespeople.find(
            (p) => p.id === parseInt(id) || p.id === id || p._id === id
          )
        : null;

    if (!foundPerson) {
      try {
        const storedPerson = sessionStorage.getItem("selectedTradesPerson");
        if (storedPerson) {
          const parsedPerson = JSON.parse(storedPerson);
          if (
            parsedPerson.id === id ||
            parsedPerson.id === parseInt(id) ||
            parsedPerson._id === id
          ) {
            foundPerson = parsedPerson;
          }
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }
    }

    setPerson(foundPerson);
    setIsLoading(false);
  }, [id, tradespeople]);

  function hireArtisan() {
    navigate("/hirepage");
  }

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        artisanId: person?._id || person?.id || id,
        artisanName: `${person?.fname || ""} ${person?.lname || ""}`,
        action,
      };

console.log (payload)
      const response = await axios.post(
        "https://skillhub-api-y3gi.onrender.com/api/hiring/hire",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        // alert(
        //   `${action} for ${person?.fname} ${person?.lname} submitted successfully!`
        // );
        if (action === "Confirm & Hire") {
          hireArtisan();
        }
      } else {
        setError(response.data.message || "Submission failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Network error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="div-container">
        <h1>Loading...</h1>
        <p>Fetching tradesperson data...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="div-container">
        <h1>Person Not Found</h1>
        <p>Could not find tradesperson with ID: {id}</p>
<p>
          Debug info:{" "}
          {sessionStorage.getItem("selectedTradesPerson")
            ? "User exists in session storage"
            : "No user in session storage"}
        </p>
        <button onClick={() => navigate("/")} className="hire-button">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="">
        <div className="profile-header">
          <div className="image-profile-details-container">
            <img
              src={person.image}
              className="viewprofile-img"
              alt={person.fname}
            />
            <div className="profile-details">
              <h2 className="viewprofile-name">
                {person.fname} {person.lname}
                {person.verified && (
                  <i className="fa-solid fa-circle-check verification-icon"></i>
                )}
              </h2>
              <p className="viewprofile-expertise">
                <strong>Expertise:</strong> {person.expertise}
              </p>

              <p className="viewprofile-location">
                <strong>Service Area:</strong> {person.location}
              </p>

              {/* overall rating */}
              <div>
                <strong>Overall Rating: </strong>
                <span className="rating-stars">{person.ratings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => handleSubmit(e, "Confirm & Hire")}
        className="hiring-form-container"
      >
        {/* Name and Email in one row */}
        <div className="hire-page-form-row field-appear ">
          <div className="hiring-page-input-field-group">
            <label htmlFor="fullName">
              Full Name<sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-animated hire-form-input-field"
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="hiring-page-input-field-group">
            <label htmlFor="email">
              Email<sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-animated hire-form-input-field"
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Job Description on its own line with increased height */}
        <div className="form-row field-appear">
          <div className="form-group full-width">
            <label htmlFor="jobDescription">
              Job Description
              <sup className="mandatory-asterik">*</sup>
            </label>
            <textarea
              className="text-area-input input-animated "
              id="jobDescription"
              placeholder={`Give a detailed description of what you want ${person.fname} to do for you?`}
              value={formData.jobDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Three date fields in one row */}
        <div className="form-row field-appear">
          {/* start date */}
          <div className="hiring-page-input-field-group">
            <label htmlFor="startDate">
              Start date<sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-animated hire-form-input-field"
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* end date */}
          <div className="hiring-page-input-field-group">
            <label htmlFor="endDate">
              End date<sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-animated hire-form-input-field"
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* start time */}
          <div className="hiring-page-input-field-group">
            <label htmlFor="startTime">
              Preferred Start Time <sup className="mandatory-asterik">*</sup>
            </label>
            <input
              className="input-animated hire-form-input-field"
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Notes/Special Requests */}
        <div className="hire-form-text-area-input-container full-width field-appear">
          <label htmlFor="notes">Notes/Special Requests (Optional)</label>
          <textarea
            className="text-area-input input-animated"
            id="notes"
            placeholder={`Is there anything you would like ${person.fname} to know?`}
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox for terms and conditions */}
        <div className="field-appear">
          <div className="form-group full-width" id="chexkbox-container">
            <input
              id="checkbox"
              value={formData.checkbox}
              onChange={handleChange}
              type="checkbox"
              required
            />

            <label htmlFor="checkbox">
              By checking this box you agree to skillhub's{" "}
              <a href="">terms & condtions</a>
            </label>
          </div>
        </div>
        {/* Buttons */}
        <div className="button-group">
          <button
            className="quote-btn"
            type="button"
          
          >
            Request A Quote
          </button>
          <button
            className="hiring-btn"
            id="hire"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Confirm & Hire"}
          </button>
        </div>
        {/* {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Your request has been submitted successfully!
          </div>
        )} */}
      </form>
    </div>
  );
}

export default HiringartisanPage;
