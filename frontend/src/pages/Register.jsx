import { useState, useEffect } from "react";
import WebService from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { useNavigate,Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [store, setStore] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await WebService.postAPICall(WebAPI.registerAPI, store);

      setMessage(res.data.message || "OTP sent successfully");
      setShowOtp(true);
      setTimeLeft(300);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const verifyOtp = async () => {
    setMessage("");

    try {
      const res = await WebService.postAPICall(WebAPI.verify, {
        email: store.email,
        otp,
      });

      setMessage(res.data.message || "Verified successfully");
      setShowOtp(false);
      setTimeLeft(0);
      navigate("/login");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "OTP verification failed. Please try again."
      );
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-icon">♥</div>

        <h1 className="auth-title">
          {showOtp ? "Verify Your Email" : "Create Account"}
        </h1>

        <p className="auth-subtitle">
          {showOtp
            ? "Enter the OTP sent to your email address."
            : "Join ShaadiVibes and plan your special celebration."}
        </p>

        {!showOtp ? (
          <form onSubmit={submitForm} autoComplete="off">
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={store.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={store.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                name="password"
                value={store.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                name="mobile"
                value={store.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div className="auth-field">
              <label>Gender</label>
              <select
                name="gender"
                value={store.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>
        ) : (
          <div className="otp-section">
            <div className="auth-field">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              className="auth-button"
              disabled={timeLeft <= 0}
            >
              Verify OTP
            </button>

            <p className="otp-timer">
              OTP expires in: <strong>{formatTime(timeLeft)}</strong>
            </p>
          </div>
        )}

        {message && <p className="auth-message">{message}</p>}

        {!showOtp && (
          <p className="auth-footer-text">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;

