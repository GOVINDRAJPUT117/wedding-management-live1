import { useState } from "react";
 import WebServices from "../services/WebServices";
 import WebAPI from "../services/WebAPI";
import { Link, useNavigate } from "react-router-dom";

function Login({setUserData}) {
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
    try {
     const result = await WebServices.postAPICall(WebAPI.loginAPI, store, {
         withCredentials: true
      });

      console.log("Login Response:", result.data.data);

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
         console.log("userrolee",user.role)
        if (user.role === "admin") {
          navigate("/Admin");
        } else if (user.role === "user") {
          navigate("/services");
          alert("Login success");
        }
      } else {
        setMsg("Login failed");
      }
    } catch (err) {
      console.log("Error:", err);
      setMsg("Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: "red", textAlign: "center" }}>Login Page</h1>
      <center>
        <div style={{ width: "400px" }} className="form-control mt-3">
          <form onSubmit={sub} autoComplete="off">
            <input
              type="email"
              name="email"
              value={store.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-control mt-4"
              required
            />
            <input
              type="password"
              name="password"
              value={store.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="form-control mt-4"
              required
            />
            <button type="submit" className="btn btn-success mt-4">
              Login
            </button>
          </form>

          {msg && <p style={{ color: "red", marginTop: "10px" }}>{msg}</p>}

          <p>
            If you are not registered, <span><Link to="/register">click here!</Link></span>
          </p>
        </div>
      </center>
    </div>
  );
}

export default Login;

