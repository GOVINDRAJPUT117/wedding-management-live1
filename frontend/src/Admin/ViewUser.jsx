import { useEffect, useState } from "react";
import WebAPI from "../services/WebAPI";
import WebServices from "../services/WebServices";


function ViewUser() {
const[list,setUserList]=useState([])
console.log("list",list)

 useEffect(() => {
    WebServices.getAPICall(WebAPI.Viewuser)
      .then((response) => {
        console.log(response.data); 
        setUserList(response.data.user); 
        
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    console.log("id ye he "+id)
  if (window.confirm("Are you sure you want to delete this user?")) {
    const user = JSON.parse(localStorage.getItem("userData"));
    const token = user?.token;

    console.log("token=    "+token)
     console.log("id=    "+id)

    const url = `${WebAPI.deleteUser}/${id}`;

    WebServices.deleteAPIUsingToken(url, token)
      .then((res) => {
        if (res.data.status) {
          alert("User deleted successfully!");
         setUserList((prev) => prev.filter((u) => u._id.toString() !== id.toString()));

        } else {
          alert("Failed to delete user: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  }
};
    return <>
    <div className="container">
      <table className="table table-bordered">
        <thead>
            <tr>
                <th>_id</th>
                <th>name</th>
                <th>email</th>
                <th>mobile</th>
                <th>gender</th>
                <th>role</th>
                <th>info</th>
            </tr>
        </thead>
        <tbody>
            {list.map((value,index)=>
            {
           return<tr  key={value._id}>
            <td>{index+1}</td>
            <td>{value.name}</td>
            <td>{value.email}</td>
            <td>{value.mobile}</td>
            <td>{value.gender}</td>
            <td>{value.role}</td>
            <td>{value.info}</td>
            <td>  <input type="button" className="btn btn-danger" value="delete"  onClick={() => handleDelete(value._id)}/></td>
            
           </tr>
            })}
        </tbody>

      </table>
    </div>


    </>
}
export default ViewUser;

