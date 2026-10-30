import { useState } from "react";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ setUserData }) {
  const navigate = useNavigate();

  const [store, setStore] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const sub = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const result = await WebServices.postAPICall(
        WebAPI.loginAPI,
        store,
        { withCredentials: true }
      );

      if (result.data.status === true) {
        const user = {
          isLoginStatus: true,
          role: result.data.data.user.role,
          token: result.data.data.token,
          _id: result.data.data.user._id,
          name: result.data.data.user.name,
          email: result.data.data.user.email,
          mobile: result.data.data.user.mobile,
          gender: result.data.data.user.gender,
        };

        setUserData(user);
        localStorage.setItem("userData", JSON.stringify(user));

        window.dispatchEvent(new Event("userLogin"));

        if (user.role === "admin") {
          navigate("/Admin");
        } else if (user.role === "user") {
          navigate("/services");
          alert("Login success");
        }
      } else {
        setMsg("Login failed. Please check your details.");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">♥</div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Login to continue your beautiful wedding journey.
        </p>

        <form onSubmit={sub} autoComplete="off">
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={store.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={store.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        {msg && <p className="auth-message">{msg}</p>}

        <p className="auth-footer-text">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
