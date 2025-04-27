import React, { useState } from "react";
import Footer from "../footer";
import PaymentService from "../services/paymentService";
import "../styles/hirepage.css";

const user = JSON.parse(localStorage.getItem("user"));

function Hire() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  // Handler for Continue to Payment
  const handleContinueToPayment = async () => {
    setLoading(true);
    try {
      const paymentService = new PaymentService();
      // Demo values - replace with real user/job data as needed
      const amount = 5000; // Amount in NGN
      const email = user.email; // Replace with user's email
      const reference = "SKILLHUB_" + Math.floor(Math.random() * 1000000000 + 1);

      const authUrl = await paymentService.initiatePayment(amount, email, reference);
      window.location.href = authUrl; // Redirect to Paystack payment page
    } catch (err) {
      alert("Failed to initiate payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hirepage">
        <div className="header">
          <h1>Payment Option</h1>
          <p>How do you want to pay?</p>
        </div>

        <div className="radios">
          <div
            className={`radiogroup ${
              paymentMethod === "creditCard" ? "active" : ""
            }`}
            onClick={() => handlePaymentChange("creditCard")}
          >
            <img src="./icons/cc.png" alt="Credit card" />
            <label htmlFor="creditCard">Debit/credit card</label>
            <input
              className="radio-button"
              id="creditCard"
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={() => handlePaymentChange("creditCard")}
            />
          </div>

          <div
            className={`radiogroup ${paymentMethod === "bank" ? "active" : ""}`}
            onClick={() => handlePaymentChange("bank")}
          >
            <img src="./icons/bank.png" alt="Bank" />
            <label htmlFor="bank">Bank Transfer</label>
            <input
              className="radio-button"
              id="bank"
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={() => handlePaymentChange("bank")}
            />
          </div>

          <div
            className={`radiogroup ${paymentMethod === "ussd" ? "active" : ""}`}
            onClick={() => handlePaymentChange("ussd")}
          >
            <img src="./icons/ussd.png" alt="USSD" />
            <label htmlFor="ussd">USSD</label>
            <input
              className="radio-button"
              id="ussd"
              type="radio"
              name="paymentMethod"
              value="ussd"
              checked={paymentMethod === "ussd"}
              onChange={() => handlePaymentChange("ussd")}
            />
          </div>

          <div
            className={`radiogroup ${paymentMethod === "qr" ? "active" : ""}`}
            onClick={() => handlePaymentChange("qr")}
          >
            <img src="./icons/QR.png" alt="QR code" />
            <label htmlFor="qr">QR Code</label>
            <input
              className="radio-button"
              id="qr"
              type="radio"
              name="paymentMethod"
              value="qr"
              checked={paymentMethod === "qr"}
              onChange={() => handlePaymentChange("qr")}
            />
          </div>
        </div>

        <div className="button-container">
          <button
            className="cont-btn"
            disabled={!paymentMethod || loading}
            onClick={handleContinueToPayment}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </>
  );
}

export default Hire;



// import React, { useState } from "react";
// import Footer from "../footer";
// import PaymentService from "../services/paymentService";
// import "../styles/hirepage.css";

// function Hire() {
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handlePaymentChange = (method) => {
//     setPaymentMethod(method);
//   };

//   // Get logged-in user's email from localStorage (or adjust as needed)
//   const getUserEmail = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.email || "";
//   };

//   // Handler for Continue to Payment
//   const handleContinueToPayment = async () => {
//     setLoading(true);
//     try {
//       const paymentService = new PaymentService();
//       const amount = 5000; // Amount in NGN
//       const email = getUserEmail(); // Use logged-in user's email
//       if (!email) {
//         alert("No user email found. Please log in.");
//         setLoading(false);
//         return;
//       }
//       const reference = "SKILLHUB_" + Math.floor(Math.random() * 1000000000 + 1);

//       const authUrl = await paymentService.initiatePayment(amount, email, reference);
//       window.location.href = authUrl; // Redirect to Paystack payment page
//     } catch (err) {
//       alert("Failed to initiate payment: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="hirepage">
//         {/* ...existing code... */}
//         <div className="button-container">
//           <button
//             className="cont-btn"
//             disabled={!paymentMethod || loading}
//             onClick={handleContinueToPayment}
//           >
//             {loading ? "Processing..." : "Continue to Payment"}
//           </button>
//         </div>
//       </div>
//       {/* <Footer /> */}
//     </>
//   );
// }

// export default Hire;
