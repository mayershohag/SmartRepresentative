const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "Shop Owner name is required"],
                  trim: true,
                  minlength: [2, "Name must be at least 2 characters"],
            },
            shopName: {
                  type: String,
                  required: [true, "Shop name is required"],
                  trim: true,
            },
            phone: {
                  type: String,
                  required: [true, "Phone number is required"],
                  trim: true,
                  unique: true,
                  match: [
                        /^(\+8801|01)[3-9]\d{8}$/,
                        "Please provide a valid Bangladeshi phone number",
                  ],
            },
            password: {
                  type: String,
                  required: [true, "Password is required"],
                  minlength: [8, "Password must be at least 8 characters"],
                  select: false,
            },
            nid: {
                  type: String,
                  required: [true, "NID number is required"],
                  trim: true,
                  unique: true,
                  match: [
                        /^(?:\d{10}|\d{13}|\d{17})$/,
                        "NID must be 10, 13, or 17 digits long",
                  ],
            },
            district: {
                  type: String,
                  required: [true, "District is required"],
                  trim: true,
            },
            shopAddress: {
                  type: String,
                  required: [true, "Detailed shop address is required"],
                  trim: true,
            },
            tradeLicense: {
                  type: String,
                  trim: true,
                  default: "",
            },
            photo: {
                  type: String,
                  default: "",
            },
            role: {
                  type: String,
                  default: "Shopkeeper",
                  immutable: true,
            },
            activeStatus: {
                  type: String,
                  enum: ["Active", "Inactive"],
                  default: "Active",
            },
      },
      { timestamps: true }
);

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);