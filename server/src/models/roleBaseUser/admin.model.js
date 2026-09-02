const mongoose = require("mongoose");
const superAdminSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "SuperAdmin name is required"],
                  trim: true,
                  minlength: [2, "Name must be at least 2 characters"],
            },
            email: {
                  type: String,
                  sparse: true,
                  trim: true,
                  unique: true,
                  lowercase: true,
                  match: [
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        "Please provide a valid email address",
                  ],
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
            photo: {
                  type: String,
                  default: "",
            },
            role: {
                  type: String,
                  default: "Super_Admin"
            },
            permissions: {
                  type: [String],
                  default: ["manage_distributors", "manage_shopkeepers", "manage_deliveries", "view_analytics"],
            },
            activeStatus: {
                  type: String,
                  enum: ["Inactive", "Active"],
                  default: "Active",
            },
      },
      { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", superAdminSchema);