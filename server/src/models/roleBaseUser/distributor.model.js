const mongoose = require("mongoose");
const distributorSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "Name must required"],
                  trim: true,
                  minlength: [2, "Name must be at least 2 characters"],
            },
            businessName: {
                  type: String,
                  required: [true, "Business name is required"],
                  trim: true,
            },
            tradeLicense: {
                  type: String,
                  required: [true, "Trade license name is required"],
                  trim: true,
                  unique: true,
            },
            nid: {
                  type: String,
                  required: [true, "NID Number is required"],
                  trim: true,
                  unique: true,
                  minlength: [10, "NID number must be at least 10 digits"],
                  maxlength: [17, "NID number cannot exceed 17 digits"],
            }, companies: {
                  type: [
                        {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "Company",
                        },
                  ],
                  validate: {
                        validator: function (val) {
                              return val && val.length > 0;
                        },
                        message: "A distributor must be associated with at least one company",
                  },
                  required: [true, "At least one company is required"],
            },
            district: {
                  type: String,
                  required: [true, "District is required"],
                  trim: true,
            },
            address: {
                  type: String,
                  trim: true,
            },
            activeStatus: {
                  type: String,
                  enum: ["Inactive", "Active"],
                  default: "Inactive",
            },
            phone: {
                  type: String,
                  required: [true, "Phone number is required"],
                  trim: true,
                  unique: true,
                  match: [/^(\+8801|01)[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"],
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
                  default: "Distributor",
            },
      },
      { timestamps: true },
);

module.exports = mongoose.model("Distributor", distributorSchema);
