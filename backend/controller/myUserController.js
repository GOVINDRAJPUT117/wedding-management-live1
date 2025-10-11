import '../connection/dbconfig.js'
import sendDataOnMail from '../mailcontroller/mailcontroller.js';
import userSchemaModel from '../model/userModel.js'
import rs from 'randomstring'; 
import jwt_auth from '../auth/auth.js'
import APIResponse from '../response/APIResponse.js';
import bcrypt from 'bcrypt';
import generateOTP from "../otpgenrate/otp.js"


//Save User
// export var saveUser = async(req,res,next)=>{
//  var userdetail = req.body;
//  console.log("user detail="+userdetail)
//  console.log("user detail="+JSON.stringify(userdetail))
// var userlist = await userSchemaModel.find()
// var len = userlist.length;
// console.log("len="+len)
// var _id = len==0?1:userlist[len-1]._id+1
// userdetail={...userdetail,'_id':_id,'role':'user','info':Date()}
//  console.log("user detail="+JSON.stringify(userdetail))
//  try
//  {
// var result =  await userSchemaModel.create(userdetail);
// console.log("data insert successfully");

//  var otp = rs.generate({
//     length:6,
//     charset:'numeric'
//  })
//  console.log("otp="+otp)
// var msg = 'your otp is'+otp;
// sendDataOnMail(result.email,msg)
// req.session.server_otp=otp;
// req.session.save();
// res.status(200).json({ success: true, message: 'hdfsuhdfh' });
//  }
//  catch(err)
//  {
// console.log("data not successfully"+err);
// res.status(200).json({ success: false, message: 'hdfsuhdfh' });
//  }
// }
// export var saveUser = async (req, res, next) => {
//   try {
//     var userdetail = req.body;
//     var userlist = await userSchemaModel.find();
//     var len = userlist.length;
//     var _id = len == 0 ? 1 : userlist[len - 1]._id + 1;

//     // ✅ Hash password using bcrypt
//     const hashedPassword = await bcrypt.hash(userdetail.password, 10);

//     userdetail = {
//       ...userdetail,
//       _id,
//       role: 'user',
//       info: Date(),
//       password: hashedPassword, // save hashed password
//     };

//     const result = await userSchemaModel.create(userdetail);

//     // OTP generate
//     var otp = rs.generate({ length: 6, charset: 'numeric' });
//     var msg = 'Your OTP is ' + otp;
//     sendDataOnMail(result.email, msg);

//     req.session.server_otp = otp;
//     req.session.save();

//     res.status(200).json({ success: true, message: 'OTP sent to your email' });
    
//   } catch (err) {
//     console.log("Error saving user:", err);
//     res.status(500).json({ success: false, message: 'User not saved' });
//   }
// };

  let fakeDB = []


 export const saveUser = async (req, res) => {
  try {
    const { name, email, password, mobile, gender } = req.body;

    console.log("data",req.body)

    const existingUser = await userSchemaModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    
    if (fakeDB.find(u => u.email === email)) {
      return res.status(400).json({ message: "OTP already sent. Please verify." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    console.log("pass"+hashedPassword)

    // Generate OTP
    const otp = generateOTP();
    console.log("otp is here "+otp)
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Save in fakeDB
    fakeDB.push({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender,
      otp,
      otpExpiresAt,
      role:"user"
    });

    console.log("data"+fakeDB)

    // Send OTP
     sendDataOnMail(email, otp);

    res.json({ message: "OTP sent to your email. Please verify to complete registration.",otpd:otpExpiresAt });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
}

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user in fakeDB
    const index = fakeDB.findIndex(u => u.email === email);
    if (index === -1) return res.status(400).json({ message: "User not found or OTP expired" });

    const user = fakeDB[index];

    // OTP check
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiresAt < new Date()) {
      // Remove expired OTP from fakeDB
      fakeDB.splice(index, 1);
      return res.status(400).json({ message: "OTP expired" });
    }

    //  OTP verified → save in real DB
    const newUser = new userSchemaModel({
      name: user.name,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
      gender: user.gender,
      role:user.role,
      info:Date()
      
    });

    await newUser.save();

    // Remove from fakeDB
    fakeDB.splice(index, 1);

    res.json({ message: "OTP verified successfully. Registration complete!" });

  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
}
 

// export var loginUser = async (req, res, next) => {
//   try {
//     var { email, password } = req.body;
//     var userlist = await userSchemaModel.findOne({ email: email });

//     if (userlist != null) {
//       //  Compare password using bcrypt
//       const isMatch = await bcrypt.compare(password, userlist.password);
//       if (!isMatch) {
//         return res.status(401).json(new APIResponse(false, null, "Invalid credentials"));
//       }

//       // Token generate
//       var token = jwt_auth.generatetoken(userlist._id);
//       res.status(200).json(new APIResponse(true, { user: userlist, token }, "Login Success"));
//     } else {
//       res.status(401).json(new APIResponse(false, null, "Invalid credentials"));
//     }
//   } catch (err) {
//     console.log("Login Exception:", err);
//     res.status(500).json(new APIResponse(false, null, "Internal Server Error"));
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`email: ${email}, password: ${password}`);

    // check if user exists
    const user = await userSchemaModel.findOne({ email });
    console.log("DB result:", user);

    if (!user) {
      // User not found
      return res.status(200).json(new APIResponse(false, null, "User not found"));
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json(new APIResponse(false, null, "Invalid credentials"));
    }

    // generate token
    const token = jwt_auth.generatetoken(user._id);
    console.log("token:", token);

    // successful login
    return res.status(200).json(
      new APIResponse(true, { user, token }, "Login Success")
    );

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json(
      new APIResponse(false, null, "Server error")
    );
  }
};



//View All Product
export var fetchUserList = async(req,res,next)=>{
    try
    {
var userlist = await userSchemaModel.find({
    _id:{$ne:req.user}
});
console.log(userlist)
var len = userlist.length;
if(len!=0)
{
res.status(200).json({ status: true, user: userlist, message: "Record Found" });

}
else
{
res.status(200).json({ status:false,Message:"Record Found"});
}
    }
    catch(err)
    {
console.log("error kyu ayi he bhai"+err)
    }

}


//delete user

export var deleteUser = async (req, res, next) => {
  try {
    const userId = req.params._id;
    console.log("id="+userId)

    const result = await userSchemaModel.findByIdAndDelete(userId);
     console.log("result="+result)
    

    if (!result) {
      console.log("User not found for deletion.");
      return res
        .status(403)
        .json(new APIResponse(false, null, "User not found"));
    }

    console.log("User deleted successfully");
    res
      .status(200)
      .json(new APIResponse(true, result, "User deleted successfully"));
  } catch (err) {
    console.error("Delete error: " + err);
    res
      .status(500)
      .json(new APIResponse(false, null, "Internal Server Error"));
  }
};



export const editprofile = async (req,res,next)=>
{

try
{
    var userid = req.params._id
var{name,email,mobile,gender}=req.body;
console.log("userid="+name)
var obj = {_id:userid,name:name,email:email,mobile:mobile,gender:gender}
console.log("obj="+JSON.stringify(obj))


var user_detail = await userSchemaModel.findByIdAndUpdate(userid,obj,{ new: true });
console.log("userdetail"+user_detail)
if(!user_detail)
{
  res.status(200).json(new APIResponse(false,"user not found"))
}
else{
 res.status(200).json(new APIResponse(true,user_detail,"user found"))
}



}
catch(err)
{
console.log("err="+err)
res.status(200).json(new APIResponse(false,"internal error"))
}

}