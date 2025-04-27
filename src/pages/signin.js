import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInUser } from "../services/authService";
import { applyAnimationDelay } from "../utils/animationUtils";
import "../styles/signin.css";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    applyAnimationDelay(".input-field-container", 0.2);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await signInUser(formData);
      console.log("Login successful:", response.data);
       // Save user info to localStorage
    localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-content">
      {/* form */}
      <div className="sign-in-container">
        <div className="sign-in-image-form-wrapper">
          <img
            className="sign-in-image"
            src="./images/image.png"
            alt="Login Illustration"
          />

          <form className="signin-form" onSubmit={handleSubmit}>
            {/* titlling */}
            <p className="welcome-title">
              <span className="skillhub">
                Log<span className="hub"> {""} into</span>
              </span>
              {" "} your account
            </p>

            <div className="field-container">
              <div className="sign-in-input-field-container">
                <label className="input-label">
                  Email<sup className="mandatory-asterisk">*</sup>
                </label>

                <input
                  className="sign-in-input-field"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="sign-in-input-field-container">
                <label className="input-label">
                  Password<sup className="mandatory-asterisk">*</sup>
                </label>

                <input
                  className="sign-in-input-field"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
              <button className="google-signin-button" type="button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.2 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.182a4.386 4.386 0 01-1.909 2.835v2.409h3.09c1.808-1.636 2.837-4.045 2.837-7.067z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 19.455c2.586 0 4.75-.841 6.36-2.273l-3.09-2.331a6.214 6.214 0 01-3.27.914c-2.432 0-4.533-1.613-5.33-3.97H1.545v2.4A9.545 9.545 0 0010 19.456z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.682 11.796a5.611 5.611 0 010-3.593V5.893H1.545a9.382 9.382 0 000 8.213l3.137-2.31z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 5.773c1.321 0 2.512.445 3.451 1.339l2.75-2.682C14.463 2.818 12.309 2 10 2 6.386 2 3.276 4.041 1.545 7.103l3.137 2.4C5.466 7.386 7.568 5.773 10 5.773z"
                    fill="#EA4335"
                  />
                </svg>
                Sign In with Google
              </button>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <div className="new-user-prompt">
              New to{" "}
              <span className="skillhub">
                Skill<span className="hub">Hub</span>
              </span>
              ?{" "}
              <Link to="/consumerpages" className="signup-link">
                Sign Up
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
