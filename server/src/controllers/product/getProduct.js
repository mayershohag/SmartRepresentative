const Product = require("../../models/product.model");

const getProduct = async (req, res) => {
      try {
            const productId = req.params.productId;
            const product = await Product.findOne({ _id: productId });
            if (!product) {
                  return res.status(404).json({
                        success: false,
                        message: "Product Not Found!",
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
module.exports = getProduct;
