const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "Name must required"],
                  trim: true,
                  minlength: [2, "Name must be at least 2 characters"],
            },
            businessName: {
                  type: String,
                  required: function () {
                        return this.role === "distributor";
                  },
                  trim: true,
            },
            tradeLicense: {
                  type: String,
                  required: function () {
                        return this.role === "distributor";
                  },
                  trim: true,
                  unique: true,
            },
            nid: {
                  type: String,
                  required: [true, "NID must required"],
                  trim: true,
            },
            district: {
                  type: String,
                  trim: true,
                  required: function () {
                        return this.role === "distributor";
                  },
            },
            address: {
                  type: String,
                  trim: true,
            },
            isActive: {
                  type: Boolean,
                  default: true,
            },
            phone: {
                  type: String,
                  required: [true, "Phone Number Required."],
                  trim: true,
                  unique: true,
                  match: /^(\+8801|01)[3-9]\d{8}$/,
            },
            email: {
                  type: String,
                  trim: true,
                  unique: true,
                  lowercase: true,
                  sparse: true,
            },
            password: {
                  type: String,
                  required: [true, "Password must be 8 characters"],
                  minlength: 8,
                  select: false,
            },
            photo: {
                  type: String,
                  default: "",
            },
            bio: {
                  type: String,
                  default: "",
            },
            role: {
                  type: String,
                  enum: ["distributor", "delivery", "shopkeeper"],
                  default: "distributor",
            },
      },
      { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
