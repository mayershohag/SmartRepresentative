const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true,
                  unique: true,
            },

            logo: {
                  type: String,
                  default: "",
            },

            description: {
                  type: String,
                  default: "",
            },

            website: {
                  type: String,
                  default: "",
            },

            phone: {
                  type: String,
                  required: [true, "Phone must needed"],
                  unique: true,
                  default: "",
            },

            email: {
                  type: String,
                  unique: true,
                  default: "",
            },

            isActive: {
                  type: String,
                  enum: ["active", "inactive"],
                  default: "active",
            },
      },
      {
            timestamps: true,
      },
);

module.exports = mongoose.model("Company", companySchema);
