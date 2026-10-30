
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const ProfilePage2 = ({ setUserData }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const uname = useRef();
  const uemail = useRef();
  const umobile = useRef();
  const ugender = useRef();

  const headingStyle = {
    color: "#7d263f",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: "600",
  };

  const primaryButtonStyle = {
    backgroundColor: "#7d263f",
    borderColor: "#7d263f",
    color: "#fff",
  };

  const secondaryButtonStyle = {
    backgroundColor: "#b65b72",
    borderColor: "#b65b72",
    color: "#fff",
  };

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("userData")
      );

      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditing && user) {
      if (uname.current) uname.current.value = user.name || "";
      if (uemail.current) uemail.current.value = user.email || "";
      if (umobile.current) umobile.current.value = user.mobile || "";
      if (ugender.current) ugender.current.value = user.gender || "";
    }
  }, [isEditing, user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");

    window.dispatchEvent(new Event("userLogout"));

    localStorage.removeItem("token");

    setUserData({
      isLoginStatus: false,
      role: undefined,
      token: null,
    });

    setUser({});
    navigate("/login", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = uname.current.value;
    const email = uemail.current.value;
    const mobile = umobile.current.value;
    const gender = ugender.current.value;

    const updatedData = { name, email, mobile, gender };

    let storedUser;

    try {
      storedUser = JSON.parse(localStorage.getItem("userData"));
    } catch (error) {
      alert("Please log in again.");
      return;
    }

    const token = storedUser?.token;

    if (!storedUser?._id || !token) {
      alert("Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const resp = await WebServices.updateAPIUsingToken(
        `${WebAPI.updateuser}/${storedUser._id}`,
        updatedData,
        token
      );

      if (resp?.status === 200 || resp?.success) {
        const updatedUser = { ...storedUser, ...updatedData };

        setUser(updatedUser);
        localStorage.setItem(
          "userData",
          JSON.stringify(updatedUser)
        );

        alert("Profile updated successfully");
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "75vh",
        padding: "40px 15px",
        background: "transparent",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          maxWidth: "500px",
          width: "100%",
          border: "1px solid #eadde0",
          borderRadius: "16px",
          backgroundColor: "#fff",
        }}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <h4
              className="text-center mb-4"
              style={headingStyle}
            >
              Edit Profile
            </h4>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                ref={uname}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                ref={uemail}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                placeholder="Mobile Number"
                ref={umobile}
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-control"
                ref={ugender}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="d-flex justify-content-between mt-4 gap-3">
              <button
                type="submit"
                className="btn w-50"
                style={primaryButtonStyle}
              >
                Save
              </button>

              <button
                type="button"
                className="btn w-50"
                style={{
                  backgroundColor: "#786c70",
                  borderColor: "#786c70",
                  color: "#fff",
                }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="text-center mb-3">
              <img
                src="https://as1.ftcdn.net/v2/jpg/02/01/33/54/1000_F_201335438_CNpY0iWaXXAV95Gj8BPB0tEJlMcxWeaZ.jpg"
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  border: "3px solid #eadde0",
                }}
              />
            </div>

            <h4
              className="text-center mb-4"
              style={headingStyle}
            >
              {user.name}
            </h4>

            <p>
              <strong style={{ color: "#7d263f" }}>Email:</strong>{" "}
              {user.email}
            </p>

            <p>
              <strong style={{ color: "#7d263f" }}>Mobile:</strong>{" "}
              {user.mobile}
            </p>

            <p>
              <strong style={{ color: "#7d263f" }}>Gender:</strong>{" "}
              {user.gender}
            </p>

            <div className="d-flex justify-content-between mt-4 gap-3">
              <button
                className="btn w-50"
                style={primaryButtonStyle}
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>

              <button
                className="btn w-50"
                style={secondaryButtonStyle}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage2;
