const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "Delivery man name is required"],
                  trim: true,
                  minlength: [2, "Name must be at least 2 characters"],
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
            distributorId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Distributor",
                  required: [true, "Assigned Distributor ID is required"],
            },
            companies: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Company",
                  required: [true, "company and distributor is required"],
            },
            vehicleType: {
                  type: String,
                  enum: ["Van", "Pickup", "Motorbike", "Bicycle", "On Foot", "Other"],
                  default: "Van",
            },
            vehicleNumber: {
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
                  default: "Delivery",
            },
            address: {
                  type: String,
                  trim: true
            },
            activeStatus: {
                  type: String,
                  enum: ["Active", "Inactive"],
                  default: "Active",
            },
      },
      { timestamps: true }
);

module.exports = mongoose.model("DeliveryMan", deliveryManSchema);