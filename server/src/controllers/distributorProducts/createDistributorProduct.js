const DistributorProduct = require("../../models/distributorProduct.model")
const Product = require("../../models/product.model")

const createDistributorProduct = async (req, res) => {
      try {
            const { userId } = req.user;

            const {
                  product,
                  purchasePrice,
                  sellingPrice,
                  stock,
                  minimumOrderQuantity,
                  maximumOrderQuantity,
                  discount,
            } = req.body;

            // Check Product
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                  return res.status(404).json({
                        success: false,
                        message: "Product not found.",
                  });
            }

            if (existingProduct.status !== "active") {
                  return res.status(400).json({
                        success: false,
                        message: "Product is not active.",
                  });
            }

            // Check duplicate
            const existingDistributorProduct =
                  await DistributorProduct.findOne({
                        distributor: userId,
                        product,
                  });
            if (existingDistributorProduct) {
                  return res.status(409).json({
                        success: false,
                        message: "You already added this product.",
                  });
            }

            // Validate selling price
            if (sellingPrice < purchasePrice) {
                  return res.status(400).json({
                        success: false,
                        message:
                              "Selling price cannot be lower than purchase price.",
                  });
            }

            // Validate maximum order quantity
            if (
                  maximumOrderQuantity !== null &&
                  maximumOrderQuantity < minimumOrderQuantity
            ) {
                  return res.status(400).json({
                        success: false,
                        message:
                              "Maximum order quantity cannot be lower than minimum order quantity.",
                  });
            }

            const distributorProduct = new DistributorProduct({
                  distributor: userId,
                  product,
                  purchasePrice,
                  sellingPrice,
                  stock: stock || 0,
                  minimumOrderQuantity: minimumOrderQuantity || 1,
                  maximumOrderQuantity: maximumOrderQuantity || null,
                  discount: discount || 0,
            });

            await distributorProduct.save()
            return res.status(201).json({
                  success: true,
                  message: "Product added to your inventory successfully.",
                  data: distributorProduct,
            });
      }
      catch (err) {
            console.log(err)

            res.status(500).json({
                  success: false,
                  message: "internal server error"
            })
      }
}

module.exports = createDistributorProduct