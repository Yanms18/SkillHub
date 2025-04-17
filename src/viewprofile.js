// ViewProfile.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./viewProfile.css";
import { useTrades } from './TradesContext'; // Import the context hook


const ViewProfile = () => {
  
  const { tradespeople } = useTrades(); // Use context instead of props
  const { id } = useParams();
  const navigate = useNavigate();
  const person = tradespeople.find(p => p.id === parseInt(id));

  if (!person) {
    setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    return <p>Profile not found. Redirecting...</p>;
  }
  function hireArtisanpage(){
    navigate(`/hiringartisanPage/${id}`)
  }

  return ( 
    <div className="div">
      <br></br> <br></br>
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src={person.image}
          className="viewprofile-img"
          alt={person.fname}
        />
        
        <div className="profile-details">
          <h2 className="viewprofile-name">
            {person.fname} {person.lname}
            {person.verified && <i className="fa-solid fa-circle-check verification-icon"></i>}
          </h2>
          
          <p className="viewprofile-expertise">
            <strong>Expertise:</strong> {person.expertise}
          </p>
          
          <p className="viewprofile-location">
            <strong>Service Area:</strong> {person.location}
          </p>
          
          <div className="ratings">
            <strong>Overall Rating:</strong> 
            <span className="rating-stars">{person.ratings}</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button className="hire-btn" onClick={hireArtisanpage}>Hire</button>
          <button className="viewPort-btn">View Portfolio</button>
          <button     onClick={() => navigate("/chatbox")}  className="message-btn">Message</button>
          <button className="emoji-btn">
            <i className="fa-regular fa-heart"></i>
          </button>
        </div>
      </div>

      {/* Biography Section */}
      <div className="biography-section">
        <h2 className="biography-text">BIOGRAPHY</h2>
        <div className="biography-content">
          <div className="biography-text-content">
            <p className="viewprofile-biography">{person.biography}</p>
          </div>
          
          <div className="biography-media">
            <div className="video-container">
              <img className="bio-video" src={person.video} alt="An introductory video"/>
              <p className="video-caption">{person.caption}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Area and Availability Section */}
      <div className="service-availability-section">
        <h2 className="section-heading">Service Area & Availability</h2>
        <div className="service-availability-container">
          {/* Service Area */}
          <div className="service-area-container">
            <h3 className="subsection-heading">Service Area</h3>
            <div className="map-container">
              <iframe 
                title="Service Area Map"
                src={person.serviceArea}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Availability */}
          <div className="availability-container">
            <h3 className="subsection-heading">Availability</h3>
            <div className="user-availability">
              <div className="availability-status">
                <div className="availability-title">
                  <h2 className={`status-text ${person.isOnline ? 'online' : 'offline'}`}>
                    {person.fname} is {person.isOnline ? 'Available' : 'Unavailable'}
                  </h2>
                  <span className={`status-indicator ${person.isOnline ? 'online' : 'offline'}`}></span>
                </div>
                <p className={`status-description ${person.isOnline ? 'available' : 'fully-booked'}`}>
                  {person.isOnline ? 'Available for hire' : 'Fully Booked'}
                </p>
              </div>

              <div className="availability-actions">
                {person.isOnline ? (
                  <>
                    <button className="hire-button">Hire {person.fname}</button>
                    <button className="availability-btn">Check Availability</button>
                  </>
                ) : (
                  <>
                    <button className="disabled-btn" disabled>
                      Hire {person.fname} (Unavailable)
                    </button>
                    <button className="availability-btn">Join Waiting List</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ViewProfile;