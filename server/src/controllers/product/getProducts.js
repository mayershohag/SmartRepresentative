const Product = require("../../models/product.model");

const getProducts = async (req, res) => {
      try {
            const product = await Product.find();
            if (!product) {
                  return res.status(404).json({
                        success: false,
                        message: "No Products Stored.",
                  });
            }

            res.status(200).json({
                  success: true,
                  message: "Products Data retrieved successfully!",
                  product,
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = getProducts;
