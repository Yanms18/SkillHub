import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/laststep.css"; // Reuse your existing modal/theme styles

function PaymentCallback() {
  const navigate = useNavigate();

  // Extract details from URL query params
  const params = new URLSearchParams(window.location.search);
  const reference = params.get("reference") || "N/A";
  const customer = params.get("customer") || "Customer";
  const service = params.get("service") || "Service";
  const artisan = params.get("artisan") || "Artisan";

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="last-page">
      <div className="modal-overlay" style={{ zIndex: 1000 }}>
        <div className="modal-content">
          <h2 style={{ color: "#0575E6", marginBottom: "10px" }}>Payment Complete</h2>
          <div style={{ margin: "20px 0", fontSize: "1.1rem" }}>
            <p>
              <strong>Reference:</strong> <span style={{ color: "#333" }}>{reference}</span>
            </p>
            <p>
              <strong>Customer:</strong> <span style={{ color: "#333" }}>{customer}</span>
            </p>
            <p>
              <strong>Service Paid For:</strong> <span style={{ color: "#333" }}>{service}</span>
            </p>
            <p>
              <strong>Artisan:</strong> <span style={{ color: "#333" }}>{artisan}</span>
            </p>
          </div>
          <h3 style={{ color: "#28a745", marginBottom: "20px" }}>
            Thank you! Your payment was processed.
          </h3>
          <button className="continue-btn" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCallback;