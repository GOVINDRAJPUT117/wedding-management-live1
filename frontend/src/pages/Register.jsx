import { useState, useEffect } from "react";
import WebService from "../services/WebServices";
import WebAPI from '../services/WebAPI';
import { useNavigate } from "react-router-dom";


function Register() {
  const navigate = useNavigate();

  const [store, setStore] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: ""
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
    try {
      const res = await WebService.postAPICall(WebAPI.registerAPI, store);
      console.log("response",res.data.message)
      setMessage(res.data.message || "OTP sent successfully");
      setShowOtp(true);
      setTimeLeft(300); // 5 minutes countdown
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const verifyOtp = async () => {
    try {
     const res = await WebService.postAPICall(WebAPI.verify, {
                 email: store.email,
                  otp
                     });
       console.log("response==",res.data.message)

      setMessage(res.data.message || "Verified successfully");
      setShowOtp(false);
      setTimeLeft(0);
      navigate("/login"); // navigate after OTP verification
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="container mb-4">
      <center>
        <div style={{ width: '400px' }} className="form-control mt-2">
          <h1 style={{ color: 'red', textAlign: 'center' }}>Create Account</h1>

          {/* Form and OTP in same place */}
          {!showOtp ? (
            <form onSubmit={submitForm} className="mt-4">
              <input
                type="text"
                className="form-control mt-4"
                placeholder="Enter Name"
                name="name"
                value={store.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                className="form-control mt-4"
                placeholder="Enter Email"
                name="email"
                value={store.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              <input
                type="password"
                className="form-control mt-4"
                placeholder="Enter Password"
                name="password"
                value={store.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <input
                type="tel"
                className="form-control mt-4"
                placeholder="Enter Mobile Number"
                name="mobile"
                value={store.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
              />
              <select
                className="form-control mt-4"
                name="gender"
                value={store.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input type="submit" value="Submit" className="btn btn-danger mt-4" />
            </form>
          ) : (
            <div className="mt-4">
              <h5>Enter OTP sent to your email</h5>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={verifyOtp}
                className="btn btn-success mt-2"
                disabled={timeLeft <= 0}
              >
                Verify OTP
              </button>
              <p className="mt-1">OTP expires in: {formatTime(timeLeft)}</p>
            </div>
          )}

          {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
        </div>
      </center>
    </div>
  );
}

export default Register;
