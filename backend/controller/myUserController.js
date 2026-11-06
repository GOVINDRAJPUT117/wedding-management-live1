import '../connection/dbconfig.js'
import sendDataOnMail from '../mailcontroller/mailcontroller.js';
import userSchemaModel from '../model/userModel.js'
import jwt_auth from '../auth/auth.js'
import APIResponse from '../response/APIResponse.js';
import bcrypt from 'bcrypt';
import generateOTP from "../otpgenrate/otp.js"
import pendingUserModel from '../model/pendingUserModel.js';





export const saveUser = async (req, res) => {
  try {
    const { name, email, password, mobile, gender } = req.body;

    if (!name || !email || !password || !mobile || !gender) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userSchemaModel.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const existingPendingUser = await pendingUserModel.findOne({
      email: normalizedEmail
    });

    if (existingPendingUser) {
      return res.status(409).json({
        message: "Registration already pending. Please verify or resend OTP."
      });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const pendingUser = new pendingUserModel({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      gender,
      role: "user",
      otpHash,
      otpExpiresAt,
      otpAttempts: 0,
      resendCount: 0,
      resendWindowStart: new Date(),
      lastOtpSentAt: new Date(),
      pendingExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    await pendingUser.save();

    try {
      await sendDataOnMail(normalizedEmail, otp);

      return res.status(200).json({
        message: "OTP sent to your email. Please verify to complete registration.",
        otpExpiresAt,
        otpSent: true
      });

    } catch (mailError) {
      console.log("EMAIL ERROR:", mailError);

      pendingUser.otpHash = null;
      pendingUser.otpExpiresAt = null;

      await pendingUser.save();

      return res.status(503).json({
        message: "Email could not be sent. Your registration details are saved. Please try resending OTP.",
        otpSent: false
      });
    }

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

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pendingUser = await pendingUserModel.findOne({
      email: normalizedEmail
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "Registration not found. Please register again."
      });
    }

    
    if (pendingUser.pendingExpiresAt <= new Date()) {
      await pendingUserModel.deleteOne({ _id: pendingUser._id });

      return res.status(400).json({
        message: "Registration expired. Please register again."
      });
    }

    
    if (!pendingUser.otpHash || !pendingUser.otpExpiresAt) {
      return res.status(400).json({
        message: "OTP is not available. Please resend OTP."
      });
    }

    
    if (pendingUser.otpExpiresAt <= new Date()) {
      return res.status(400).json({
        message: "OTP expired. Please resend OTP."
      });
    }

   
    if (pendingUser.otpAttempts >= 5) {
      await pendingUserModel.deleteOne({ _id: pendingUser._id });

      return res.status(400).json({
        message: "Maximum OTP attempts reached. Please register again."
      });
    }

    
    const isOtpValid = await bcrypt.compare(
      otp.toString(),
      pendingUser.otpHash
    );

    if (!isOtpValid) {
      pendingUser.otpAttempts += 1;

      const remainingAttempts = 5 - pendingUser.otpAttempts;

      if (pendingUser.otpAttempts >= 5) {
        await pendingUserModel.deleteOne({ _id: pendingUser._id });

        return res.status(400).json({
          message: "Maximum attempts reached. Please register again."
        });
      }

      await pendingUser.save();

      return res.status(400).json({
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      });
    }

  
    const existingUser = await userSchemaModel.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      await pendingUserModel.deleteOne({ _id: pendingUser._id });

      return res.status(400).json({
        message: "Email already registered"
      });
    }

    
    const newUser = new userSchemaModel({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      mobile: pendingUser.mobile,
      gender: pendingUser.gender,
      role: pendingUser.role,
      info: Date()
    });

    await newUser.save();

   
    await pendingUserModel.deleteOne({
      _id: pendingUser._id
    });

    return res.status(200).json({
      message: "OTP verified successfully. Registration complete!"
    });

  } catch (err) {
    return res.status(500).json({
      message: "OTP verification failed"
    });
  }
};


//resend
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pendingUser = await pendingUserModel.findOne({
      email: normalizedEmail
    });

    if (!pendingUser) {
      return res.status(404).json({
        message: "Pending registration not found. Please register again."
      });
    }

    const now = new Date();

    if (pendingUser.pendingExpiresAt <= now) {
      await pendingUserModel.deleteOne({ _id: pendingUser._id });

      return res.status(400).json({
        message: "Registration expired. Please register again."
      });
    }

  
    if (
      pendingUser.lastOtpSentAt &&
      now - pendingUser.lastOtpSentAt < 60 * 1000
    ) {
      const remainingSeconds = Math.ceil(
        (60 * 1000 - (now - pendingUser.lastOtpSentAt)) / 1000
      );

      return res.status(429).json({
        message: `Please wait ${remainingSeconds} seconds before resending OTP.`
      });
    }

    if (
      !pendingUser.resendWindowStart ||
      now - pendingUser.resendWindowStart >= 15 * 60 * 1000
    ) {
      pendingUser.resendWindowStart = now;
      pendingUser.resendCount = 0;
    }

   
    if (pendingUser.resendCount >= 3) {
      return res.status(429).json({
        message: "Maximum 3 OTP resends allowed in 15 minutes."
      });
    }

   
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    pendingUser.otpHash = otpHash;
    pendingUser.otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    pendingUser.otpAttempts = 0;
    pendingUser.resendCount += 1;
    pendingUser.lastOtpSentAt = now;

    await pendingUser.save();

    try {
      await sendDataOnMail(normalizedEmail, otp);

      return res.status(200).json({
        message: "New OTP sent successfully.",
        otpExpiresAt: pendingUser.otpExpiresAt
      });

    } catch (mailError) {
      
      pendingUser.otpHash = null;
      pendingUser.otpExpiresAt = null;

      await pendingUser.save();

      return res.status(503).json({
        message: "Email could not be sent. Please try again later."
      });
    }

  } catch (err) {
    return res.status(500).json({
      message: "Unable to resend OTP."
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
