const Product = require("../../models/product.model");

const updateProduct = async (req, res) => {
      try {
            const productId = req.params.productId;
            const product = await Product.findOne({ _id: productId });
            if (!product) {
                  return res.status(404).json({
                        success: false,
                        message: "Product Not Found!",
                  });
            }

            const updatedProduct = await Product.findOneAndUpdate(
                  { _id: product._id },
                  req.body,
                  {
                        returnDocument: "after",
                        runValidators: true,
                  },
            );

            res.status(200).json({
                  success: true,
                  message: "Products Data update successfully!",
                  product: updatedProduct,
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = updateProduct;
