import React, { useState } from "react";
  import "../styles/hirepage.css"
  import Footer from "../footer";
function Hire() {
    const [paymentMethod, setPaymentMethod] = useState("");
    
    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
    };
    
    return (
     <>
        <div className="hirepage">
            <br></br>
         <div className="header">
         <h1>Payment Option</h1>
         <h3>How do you want to pay</h3> 
         </div>
            
            <div className="radios">
                
                <div 
                    className={`radiogroup ${paymentMethod === "creditCard" ? "active" : ""}`}
                    onClick={() => handlePaymentChange("creditCard")}
                >
                    <img src="./icons/cc.png" alt="Credit card" />
                    <label htmlFor="creditCard">Debit/credit card</label>
                    <input 
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
                    disabled={!paymentMethod}
                >
                    Continue to Payment
                </button>
            </div>
            
        </div>
        <br></br> <br></br> <br></br> <br></br> <br></br>
        <Footer />
     </>
    );
}

export default Hire;