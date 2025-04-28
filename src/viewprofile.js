import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./viewProfile.css";
import axios from "axios";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultImageUrl =
    "https://tse1.mm.bing.net/th/id/OIP.yyVZtJgcX_k4j10PaEadSgHaHa?rs=1&pid=ImgDetMain";
  // const defaultVideoUrl = "https://tse1.mm.bing.net/th/id/OIP.0v2r3Xk4a5bq6c7x8g9Y0wHaEK?pid=ImgDet&w=300&h=300&rs=1";

  // Alternative method to get ID from URL
  const location = window.location.pathname;
  console.log("Current path:", location);
  // Try to extract ID from the URL if params.id is undefined
  const pathParts = location.split("/");
  const potentialId = pathParts[pathParts.length - 1];

  const effectiveId = id || potentialId;
  console.log("All URL params:", useParams());
  console.log("ID from params:", id);
  console.log("Using ID:", effectiveId);

  useEffect(() => {
    // Check if effectiveId exists and is valid before making the API call
    if (!effectiveId || effectiveId === "undefined") {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    console.log("Fetching user with ID:", effectiveId);

    // If your API doesn't support getting single users by ID, fetch all and filter
    axios
      .get(`https://skillhub-api-y3gi.onrender.com/api/users/`)
      .then((response) => {
        console.log("All users data:", response.data);
        // Find the user with the matching ID
        const foundUser = response.data.find(
          (u) =>
            u.id === parseInt(effectiveId) ||
            u.id === effectiveId ||
            u._id === effectiveId
        );

        if (foundUser) {
          console.log("Found user:", foundUser);
          setUser(foundUser);
          // Format the user data to match what HiringartisanPage expects
          const formattedUser = {
            id: foundUser.id || foundUser._id,
            fname: foundUser.full_name ? foundUser.full_name.split(" ")[0] : "",
            lname: foundUser.full_name
              ? foundUser.full_name.split(" ").slice(1).join(" ")
              : "",
            image: foundUser.photoURL || defaultImageUrl,
            expertise: foundUser.areas_of_expertise || "Not specified",
            location: foundUser.address || "Not specified",
            ratings: foundUser.ratings || "No ratings yet",
            verified: foundUser.verified || false,
          };

          // Store the formatted user in sessionStorage for use in HiringartisanPage
          sessionStorage.setItem(
            "selectedTradesPerson",
            JSON.stringify(formattedUser)
          );
        } else {
          setError("User not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      });
  }, [effectiveId]);

  function hireArtisanPage() {
    // Make sure we have a valid user before navigating
    if (!user) {
      console.error("Cannot navigate to hiring page: No user data available");
      return;
    }

    // Get the ID from the user object
    const userId = user.id || user._id;
    console.log("Navigating to hiring page with user:", user);
    console.log("User ID for navigation:", userId);

    // Navigate to the hiring page
    navigate(`/hiringartisanPage/${userId}`);
  }

  if (loading) return <div>Loading Profile...</div>;

  if (error || !user) {
    setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    return <p>{error || "Profile not found"}. Redirecting...</p>;
  }

  return (
    <div className="main-container">
      {/* Profile Header */}
      <div className="profile-heading">
        <div className="image-profile-details-container">
          <img
            src={user.photoURL || defaultImageUrl}
            className="viewprofile-img"
            alt={user.full_name}
          />

          <div className="profile-details">
            <h2 className="viewprofile-name">
              {user.full_name}
              {user.verified && (
                <i className="fa-solid fa-circle-check verification-icon"></i>
              )}
            </h2>

            {/* expertise */}
            <p className="viewprofile-expertise">
              <strong>Expertise:</strong>
              {user.skill || "Not specified"}
            </p>

            {/* service area */}
            <p className="viewprofile-location">
              <strong>Service Area:</strong>
              {user.address || "Not specified"}
            </p>

            {/* ratings */}
            <div className="">
              <strong>Overall Rating: </strong>
              <span className="rating-stars">
                {user.ratings || "No ratings yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile actions */}
        <div className="profile-action-button-container">
          {/* Hire button */}
          <button className="artisan-hire-button" onClick={hireArtisanPage}>
            Hire
          </button>

          {/* Message button */}
          <button
            onClick={() => navigate("/chatbox")}
            className="message-button"
          >
            Message
          </button>

          {/* Favourites button */}
          <button className="favourites-button">
            <i className="fa-regular fa-heart"></i>
          </button>

          {/* View Portfolio button */}
          <button className="view-portfolio-button">View Portfolio</button>
        </div>
      </div>

      {/* Biography and video Section */}
      <section className="biography-and-video-section">
        <div className="biography-section">
          {/* Bio title */}
          <h2 className="biography-title">BIOGRAPHY</h2>
          {/* Bio content */}
          <div className="biography-content">
            <p className="viewprofile-biography">
              {user.bio || "No biography available."}
            </p>
          </div>
        </div>

        {/* Bio Video */}
        <div className="biography-media-container">
          <div className="video-container">
            <video
              className="bio-video"
              src={user.videoURL || defaultImageUrl}
              alt="An introductory video"
              controls
            ></video>
            <p className="video-caption">
              {user.caption ||
                `Get to know ${user.full_name} via this short introductory video`}
            </p>
          </div>
        </div>
      </section>

      {/* Service Area and Availability Section */}
      <section className="service-area-section">
        <h2 className="section-heading">SERVICE AREA (MAP)</h2>

        <div className="service-area-content">
          {/* Service Area and availability */}
          <div className="map-container">
            <iframe
              title="Service Area Map"
              src={
                user.serviceArea ||
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.3231686058723!2d7.044031874795928!3d4.891650295369944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cc25ef06d95d%3A0xf8743fbd94c6b3fa!2sRivers%20State%20University!5e0!3m2!1sen!2sng!4v1718716654675!5m2!1sen!2sng"
              }
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          {/* Availability Section */}
          <div className="service-availability-container">
            <div className="availability-container">
              <div className="user-availability">
                <div className="availability-status">
                  <div className="availability-title">
                    <h2
                      className={`status-text ${
                        user.isOnline ? "online" : "offline"
                      }`}
                    >
                      {user.full_name.split(" ")[0]} is{" "}
                      {user.isOnline ? "Available" : "Unavailable"}
                    </h2>
                    <span
                      className={`status-indicator ${
                        user.isOnline ? "online" : "offline"
                      }`}
                    ></span>
                  </div>
                  <p
                    className={`status-description ${
                      user.isOnline ? "available" : "fully-booked"
                    }`}
                  >
                    {user.isOnline ? "Available for hire" : "Fully Booked"}
                  </p>
                </div>

                {/* Availability actions */}
                <div className="availability-actions">
                  {user.isOnline ? (
                    <>
                      {/* Enabled Hire button */}
                      <button className="hire-button" onClick={hireArtisanPage}>
                        Hire {user.full_name.split(" ")[0]}
                      </button>

                      <button className="availability-button">
                        Check Availability
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Disabled Hire button */}
                      <button className="disabled-button" disabled>
                        Hire {user.full_name.split(" ")[0]}
                      </button>

                      {/* Waitlist button */}
                      <button className="waitlist-button">
                        Join Waiting List
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewProfile;
