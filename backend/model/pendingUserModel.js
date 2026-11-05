
import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    gender: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    otpHash: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    resendCount: {
      type: Number,
      default: 0,
    },

    resendWindowStart: {
      type: Date,
      default: Date.now,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    pendingExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 60 * 1000),
    },

  },
  {
    timestamps: true,
  }
);

pendingUserSchema.index(
  { pendingExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const pendingUserModel = mongoose.model(
  "pendingUser",
  pendingUserSchema
);

export default pendingUserModel;
