const mongoose = require("mongoose");

const distributorProductSchema = new mongoose.Schema(
      {
            distributor: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
            },
            product: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Product",
                  required: true,
            },
            purchasePrice: {
                  type: Number,
                  required: true,
                  min: 0,
            },
            sellingPrice: {
                  type: Number,
                  required: true,
                  min: 0,
            },
            stock: {
                  type: Number,
                  default: 0,
                  min: 0,
            },
            minimumOrderQuantity: {
                  type: Number,
                  default: 1,
                  min: 1,
            },
            maximumOrderQuantity: {
                  type: Number,
                  default: null,
                  min: 1,
            },
            discount: {
                  type: Number,
                  default: 0,
                  min: 0,
            },
            isAvailable: {
                  type: Boolean,
                  default: true,
            },
            status: {
                  type: String,
                  enum: ["active", "inactive"],
                  default: "active",
            },
      },
      {
            timestamps: true,
      }
);

distributorProductSchema.index(
      {
            distributor: 1,
            product: 1,
      },
      {
            unique: true,
      }
);

module.exports = mongoose.model(
      "DistributorProduct",
      distributorProductSchema
);