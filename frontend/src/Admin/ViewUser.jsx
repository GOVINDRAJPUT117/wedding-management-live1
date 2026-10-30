
import { useEffect, useState } from "react";
import WebAPI from "../services/WebAPI";
import WebServices from "../services/WebServices";

function ViewUser() {
  const [list, setUserList] = useState([]);

  useEffect(() => {
    WebServices.getAPICall(WebAPI.Viewuser)
      .then((response) => {
        setUserList(response.data.user);
      })
      .catch((error) => {
        alert("Unable to fetch user data. Please try again.");
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const user = JSON.parse(localStorage.getItem("userData"));
      const token = user?.token;

      const url = `${WebAPI.deleteUser}/${id}`;

      WebServices.deleteAPIUsingToken(url, token)
        .then((res) => {
          if (res.data.status) {
            alert("User deleted successfully!");
            setUserList((prev) =>
              prev.filter((u) => u._id.toString() !== id.toString())
            );
          } else {
            alert("Unable to delete user. Please try again.");
          }
        })
        .catch((err) => {
          alert("Something went wrong. Please try again.");
        });
    }
  };

  return (
    <div
      className="container my-5"
      style={{
        backgroundColor: "#fbf6f1",
        padding: "30px",
        borderRadius: "14px",
      }}
    >
      <h2
        className="text-center mb-4"
        style={{
          color: "#7d263f",
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "36px",
          fontWeight: "600",
        }}
      >
        User Management
      </h2>

      <p
        className="text-center mb-4"
        style={{
          color: "#786c70",
          fontSize: "14px",
        }}
      >
        Manage and view registered users
      </p>

      <div
        className="table-responsive"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 5px 20px rgba(125, 38, 63, 0.08)",
          border: "1px solid #ead9dc",
        }}
      >
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr style={{ backgroundColor: "#7d263f", color: "#ffffff" }}>
              {[
                "ID",
                "Name",
                "Email",
                "Mobile",
                "Gender",
                "Role",
                "Info",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    backgroundColor: "#7d263f",
                    color: "#ffffff",
                    padding: "16px 12px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {list.map((value, index) => (
              <tr key={value._id}>
                <td style={{ color: "#786c70" }}>{index + 1}</td>
                <td style={{ color: "#302329", fontWeight: "600" }}>
                  {value.name}
                </td>
                <td style={{ color: "#786c70" }}>{value.email}</td>
                <td style={{ color: "#786c70" }}>{value.mobile}</td>
                <td style={{ color: "#786c70" }}>{value.gender}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: "#f8e9ed",
                      color: "#7d263f",
                      padding: "5px 11px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {value.role}
                  </span>
                </td>
                <td style={{ color: "#786c70" }}>{value.info}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#7d263f",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "7px 15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                    onClick={() => handleDelete(value._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-5"
                  style={{ color: "#786c70" }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewUser;
