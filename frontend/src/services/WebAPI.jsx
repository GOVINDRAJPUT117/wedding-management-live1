// export default {
//     registerAPI: 'http://localhost:3000/user/saveUser',
//           verify:'http://localhost:3000/user/verifyOtp',
//     loginAPI: 'http://localhost:3000/user/loginUser',
//     Viewuser: 'http://localhost:3000/user/userList',
//     AddService: 'http://localhost:3000/service/saveService',
//     fetchservice: 'http://localhost:3000/service/fetchAllServices',
//      booknow:'http://localhost:3000/cart/cartService',  
//     fetchCart:'http://localhost:3000/cart/fetchCart',    
//       RemoveCartItems: 'http://localhost:3000/cart/removeCartItem',
//   ConfirmBook:'http://localhost:3000/cart/ConfirmBookings',
//    fetchPendingBookings:'http://localhost:3000/cart/fetchPendingBookings',
//     fetchConfirmedBookings: 'http://localhost:3000/booking/confirmed',
//     deleteUser: 'http://localhost:3000/user/deleteUser',
//     deleteservice: 'http://localhost:3000/service/deleteServices',
//     updateService: 'http://localhost:3000/service/updateService',
//     fetchcategory: 'http://localhost:3000/service/category',
//     updateuser: 'http://localhost:3000/user/editprofile',
//     withouttokenfetchcategory: 'http://localhost:3000/service/cat',
// }



const BASE_URL = "https://wedding-management-backend-9wms.onrender.com";
// const BASE_URL = "http://localhost:3000";

export default {
  registerAPI: `${BASE_URL}/user/saveUser`,
  verify: `${BASE_URL}/user/verifyOtp`,
  loginAPI: `${BASE_URL}/user/loginUser`,
  Viewuser: `${BASE_URL}/user/userList`,
  AddService: `${BASE_URL}/service/saveService`,
  fetchservice: `${BASE_URL}/service/fetchAllServices`,
  booknow: `${BASE_URL}/cart/cartService`,
  fetchCart: `${BASE_URL}/cart/fetchCart`,
  RemoveCartItems: `${BASE_URL}/cart/removeCartItem`,
  ConfirmBook: `${BASE_URL}/cart/ConfirmBookings`,
  fetchPendingBookings: `${BASE_URL}/cart/fetchPendingBookings`,
  fetchConfirmedBookings: `${BASE_URL}/booking/confirmed`,
  deleteUser: `${BASE_URL}/user/deleteUser`,
  deleteservice: `${BASE_URL}/service/deleteServices`,
  updateService: `${BASE_URL}/service/updateService`,
  fetchcategory: `${BASE_URL}/service/category`,
  updateuser: `${BASE_URL}/user/editprofile`,
  withouttokenfetchcategory: `${BASE_URL}/service/cat`,
};
