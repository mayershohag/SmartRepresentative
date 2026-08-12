const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
      {
            company: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Company",
                  required: true,
            },

            category: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Category",
                  required: true,
            },

            name: {
                  type: String,
                  required: true,
                  trim: true,
            },

            sku: {
                  type: String,
                  unique: true,
                  trim: true,
            },

            barcode: {
                  type: String,
                  default: "",
            },

            image: {
                  type: String,
                  default: "",
            },

            description: {
                  type: String,
                  default: "",
            },

            unit: {
                  type: String,
                  enum: [
                        "pcs",
                        "box",
                        "packet",
                        "carton",
                        "kg",
                        "gm",
                        "ltr",
                        "ml",
                  ],
                  required: true,
            },

            unitValue: {
                  type: Number,
                  default: 1,
            },

            status: {
                  type: String,
                  enum: ["active", "inactive"],
                  default: "active",
            },
      },
      {
            timestamps: true,
      },
);

productSchema.index({ company: 1, name: 1 });

module.exports = mongoose.model("Product", productSchema);
