import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import "./search.css";

const TopTrades = () => {
  const [tradespeople, setTradespeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Ref for the scroll container
  const scrollContainerRef = useRef(null);
  // Track if we're in mobile view
  const [isMobileView, setIsMobileView] = useState(false);

  // Default placeholder image URL
  const defaultImageUrl =
    "https://static.vecteezy.com/system/resources/previews/020/765/399/large_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg";

  // Check for mobile view on component mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    // Clean up
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Fetch users data from API
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://skillhub-api-y3gi.onrender.com/api/users/")
      .then((response) => {
        console.log("User data:", response.data);
        setTradespeople(response.data);
        setFilteredPeople(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to load trades and artisans");
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  // Filter tradespeople based on search term
  useEffect(() => {
    setIsSearching(true);
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredPeople(tradespeople);
      } else {
        const filtered = tradespeople.filter(
          (person) =>
            (person.full_name &&
              person.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (person.profession &&
              person.profession
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (person.expertise &&
              person.expertise
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        );
        setFilteredPeople(filtered);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, tradespeople]);

  // Handle profile view click
  const handleViewProfile = (e, person) => {
    e.preventDefault(); // Prevent default link behavior
    sessionStorage.setItem("selectedTradesPerson", JSON.stringify(person));
    navigate(`/profile/${person.id || person._id}`); // Handle both id formats
  };

  // Navigation functions for mobile view
  const scrollPrevious = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Top trades section */}
      <section className="top-trades-section">
        {/* Section title */}
        <div className="section-title-container">
          <h2 className="section-title" data-aos="fade-up">
            Top Trades & Artisans
          </h2>

          <div className="arrow-icon-container">
            <FiArrowRight className="arrow-icon" />
          </div>
        </div>

        {/* Top trades container */}
        <div className="top-trade-container">
          {isLoading ? (
            <div className="loading">Loading Artisans...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : isSearching ? (
            <div className="loading">Searching...</div>
          ) : filteredPeople.length === 0 ? (
            <div className="no-results">No matching trades found</div>
          ) : (
            <div className="trades-container">
              <div
                ref={scrollContainerRef}
                className={`trades-scroll-container ${
                  isMobileView ? "mobile-view" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="trades-grid">
                  {filteredPeople.map((person) => (
                    <div
                      className="trade-card"
                      key={person.id || person._id || Math.random()}
                    >
                      {/* Trade image and info container */}
                      <div className="trade-image-and-info-container">
                        {/* Trade image */}
                        <div className="trade-image-container">
                          <img
                            className="img"
                            src={person.photoURL || defaultImageUrl}
                            alt={person.full_name || "Artisan"}
                          />
                        </div>

                        {/* trade info */}
                        <div className="trade-info-container">
                          <h3>
                            {person.full_name || "Unnamed Artisan"}{" "}
                            {person.verified && (
                              <span className="verified-badge">
                                <i className="fa-solid fa-circle-check verification-icon"></i>
                              </span>
                            )}{" "}
                          </h3>

                          <p className="ratings">
                            {person.ratings || "★★★★★"}
                          </p>
                          <p className="personP">
                            {person.skill || "Skilled Professional"}
                          </p>
                        </div>
                      </div>

                      {/* View profile button */}
                      <a
                        href={`/profile/${person.id || person._id}`}
                        className="view-profile-button"
                        onClick={(e) => handleViewProfile(e, person)}
                      >
                        View Profile
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation buttons */}
              {isMobileView && filteredPeople.length > 1 && (
                <div className="navigation-buttons">
                  <button
                    onClick={scrollPrevious}
                    className="nav-button prev-button"
                    aria-label="Previous profile"
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="nav-button next-button"
                    aria-label="Next profile"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export { TopTrades };