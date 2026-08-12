const Product = require("../../models/product.model");

const deleteProduct = async (req, res) => {
      try {
            const productId = req.params.productId;
            const product = await Product.findOneAndDelete({ _id: productId });
            if (!product) {
                  return res.status(404).json({
                        success: false,
                        message: "Product Not Found!",
                  });
            }

            res.status(200).json({
                  success: true,
                  message: "Products Data deleted successfully!",
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = deleteProduct;
