import '../connection/dbconfig.js'
import sendDataOnMail from '../mailcontroller/mailcontroller.js';
import userSchemaModel from '../model/userModel.js'
import rs from 'randomstring'; 
import jwt_auth from '../auth/auth.js'
import APIResponse from '../response/APIResponse.js';
import bcrypt from 'bcrypt';
import generateOTP from "../otpgenrate/otp.js"

// saveUser
let fakeDB = [];

export const saveUser = async (req, res) => {
  try {
    const { name, email, password, mobile, gender } = req.body;

    const existingUser = await userSchemaModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    if (fakeDB.find(u => u.email === email)) {
      return res.status(400).json({
        message: "OTP already sent. Please verify."
      });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    fakeDB.push({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender,
      otp,
      otpExpiresAt,
      role: "user"
    });

    sendDataOnMail(email, otp);

    return res.json({
      message: "OTP sent to your email. Please verify to complete registration.",
      otpd: otpExpiresAt
    });

  } catch (err) {
    return res.status(500).json({
      message: "Registration failed"
    });
  }
};


//verifyUser

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const index = fakeDB.findIndex(u => u.email === email);

    if (index === -1) {
      return res.status(400).json({
        message: "User not found or OTP expired"
      });
    }

    const user = fakeDB[index];

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiresAt < new Date()) {
      fakeDB.splice(index, 1);

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    const newUser = new userSchemaModel({
      name: user.name,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
      gender: user.gender,
      role: user.role,
      info: Date()
    });

    await newUser.save();

    fakeDB.splice(index, 1);

    return res.json({
      message: "OTP verified successfully. Registration complete!"
    });

  } catch (err) {
    return res.status(500).json({
      message: "OTP verification failed"
    });
  }
};

//loginUser


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchemaModel.findOne({ email });

    if (!user) {
      return res.status(200).json(
        new APIResponse(false, null, "User not found")
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).json(
        new APIResponse(false, null, "Invalid credentials")
      );
    }

    const token = jwt_auth.generatetoken(user._id);

    return res.status(200).json(
      new APIResponse(true, { user, token }, "Login Success")
    );

  } catch (err) {
    return res.status(500).json(
      new APIResponse(false, null, "Server error")
    );
  }
};



//fetchUserList

export var fetchUserList = async (req, res, next) => {
  try {
    var userlist = await userSchemaModel.find({
      _id: { $ne: req.user }
    });

    var len = userlist.length;

    if (len != 0) {
      res.status(200).json({
        status: true,
        user: userlist,
        message: "Record Found"
      });
    } else {
      res.status(200).json({
        status: false,
        Message: "Record Found"
      });
    }

  } catch (err) {
    
  }
};



//delete user

export var deleteUser = async (req, res, next) => {
  try {
    const userId = req.params._id;

    const result = await userSchemaModel.findByIdAndDelete(userId);

    if (!result) {
      return res
        .status(403)
        .json(new APIResponse(false, null, "User not found"));
    }

    return res
      .status(200)
      .json(new APIResponse(true, result, "User deleted successfully"));

  } catch (err) {
    return res
      .status(500)
      .json(new APIResponse(false, null, "Internal Server Error"));
  }
};

//editprofile
export const editprofile = async (req, res, next) => {
  try {
    var userid = req.params._id;
    var { name, email, mobile, gender } = req.body;

    var obj = {
      _id: userid,
      name: name,
      email: email,
      mobile: mobile,
      gender: gender
    };

    var user_detail = await userSchemaModel.findByIdAndUpdate(
      userid,
      obj,
      { new: true }
    );

    if (!user_detail) {
      res.status(200).json(
        new APIResponse(false, "user not found")
      );
    } else {
      res.status(200).json(
        new APIResponse(true, user_detail, "user found")
      );
    }

  } catch (err) {
    res.status(200).json(
      new APIResponse(false, "internal error")
    );
  }
};
