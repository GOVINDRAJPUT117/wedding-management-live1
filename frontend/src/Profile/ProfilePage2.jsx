import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebServices from "../services/WebServices";
import WebAPI from "../services/WebAPI";

const ProfilePage2 = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  console.log("user="+JSON.stringify(user))
 

  

  
  const uname = useRef();
  const uemail = useRef();
  const umobile = useRef();
  const ugender = useRef();

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  
  useEffect(() => {
    if (isEditing && user) {
      uname.current.value = user.name || "";
      uemail.current.value = user.email || "";
      umobile.current.value = user.mobile || "";
      ugender.current.value = user.gender || "";
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
    localStorage.removeItem("token");
    navigate("/login");
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = uname.current.value;
    const email = uemail.current.value;
    const mobile = umobile.current.value;
    const gender = ugender.current.value;

    const updatedData = { name, email, mobile, gender };
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const token = storedUser?.token;

    try {
      
      const resp = await WebServices.updateAPIUsingToken(
        `${WebAPI.updateuser}/${storedUser._id}`,
        updatedData,
        token
      );

      if (resp?.status === 200 || resp?.success) {
        const updatedUser = { ...storedUser, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        alert("Profile updated successfully");
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <h4 className="text-center mb-3">Edit Profile</h4>

            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Name" ref={uname} />
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" placeholder="Email" ref={uemail} />
            </div>
            <div className="mb-3">
              <input type="tel" className="form-control" placeholder="Mobile Number" ref={umobile} />
            </div>
            <div className="mb-3">
              <select className="form-control" ref={ugender}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success w-45">Save</button>
              <button type="button" className="btn btn-secondary w-45" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="text-center mb-3">
              <img
                src="https://as1.ftcdn.net/v2/jpg/02/01/33/54/1000_F_201335438_CNpY0iWaXXAV95Gj8BPB0tEJlMcxWeaZ.jpg"
                alt="Profile"
                className="rounded-circle"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <h4 className="text-center mb-3">{user.name}</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
            <p><strong>Gender:</strong> {user.gender}</p>

            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-primary w-45" onClick={handleEditProfile}>Edit Profile</button>
              <button className="btn btn-danger w-45" onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage2;
