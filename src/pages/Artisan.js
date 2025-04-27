import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Artisan.css";

function Artisan() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  function searchOnChange(e) {
    setSearchTerm(e.target.value);
  }

  // Default placeholder image URL
  const defaultImageUrl =
    "https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  const handleViewProfile = (e, user) => {
    e.preventDefault(); // Prevent default link behavior
    sessionStorage.setItem("selectedTradesPerson", JSON.stringify(user));
    navigate(`/profile/${user.id || user._id}`); // Handle both id formats
  };

  // Fetch users data
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://skillhub-api-y3gi.onrender.com/api/users/")
      .then((response) => {
        console.log("User data:", response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // Handle search filtering
  useEffect(() => {
    setIsSearching(true);
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(
          (user) =>
            (user.full_name &&
              user.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (user.profession &&
              user.profession
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (user.expertise &&
              user.expertise.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, users]);

  if (loading)
    return <div className="loading-container">Loading Artisans...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  // const [isOpen, setIsOpen] = useState(false);
  
  // const openModal = () => setIsOpen(true);
  // const closeModal = () => setIsOpen(false);
  return (
    <div className="artisan-container">
      {/* <h1 className="artisan-heading">Artisans List</h1> */}

      {/* Search Bar */}
      <div className="artisan-page-search-container">
        <div className="artisan-page-search-bar">
          <input
            className="artisan-search-input-field"
            type="text"
            onChange={searchOnChange}
            value={searchTerm}
            placeholder="What skill are you looking for?"
          />

          {/* Search Button */}
          <button className="artisan-page-search-button">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Filter Button */}
        <button className="artisan-page-filter-button">
          
          <div className="filter-icon-container">
            <svg
              className="filter-icon"
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33997 15.5V13H14.34V15.5H9.33997ZM4.33997 9.25V6.75H19.34V9.25H4.33997ZM0.589966 3V0.5H23.09V3H0.589966Z"
                fill="#0575E6"
              />
            </svg>
          </div>
          FILTER
        </button>
      
      </div>
      

      {/* Lazy loading */}
      {isSearching ? (
        <div className="loading-container">Searching...</div>
      ) : filteredUsers.length === 0 ? (
        <p className="no-artisans">No artisans found</p>
      ) : (
        // Artisan scrollable grid
        <>
          <div className="scroll-section">
            {/* Profile Cards */}
            <div className="artisan-grid">
              {filteredUsers.map((user) => (
                <div
                  key={user.id || user._id || Math.random()}
                  className="artisan-page-trade-card"
                >
                  <div className="artisan-page-trade-image">
                    <img
                      className="img"
                      src={user.photoURL || defaultImageUrl}
                      alt={user.full_name || "Artisan"}
                    />
                    {user.verified && (
                      <span className="verified-badge">
                        <i className="fa-solid fa-circle-check verification-icon"></i>
                      </span>
                    )}
                  </div>

                  {/* Trade info */}
                  <div className="artisan-page-trade-info">
                    <h3 className="artisan-page-trade-name">
                      {user.full_name}
                    </h3>
                    <p className="artisan-page-ratings">
                      {user.ratings || "No ratings yet"}
                    </p>
                    <p className="artisan-page-personP">
                      {user.skill || "Not specified"}
                    </p>

                    {/* View profile button */}
                    <a
                      href={`/profile/${user.id || user._id}`}
                      className="artisan-page-view-profile-btn"
                      onClick={(e) => handleViewProfile(e, user)}
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Artisan;
