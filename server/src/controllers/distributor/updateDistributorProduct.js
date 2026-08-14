const DistributorProduct = require("../../models/distributorProduct.model")

const updateDistributorProduct = async (req, res) => {
      try {
            const { productId } = req.params
            const updatedProduct = await DistributorProduct.findOneAndUpdate({ product: productId },
                  req.body,
                  {
                        returnDocument: "after",
                        runValidators: true,
                  })
            if (!updatedProduct) {
                  return res.status(404).json({
                        success: false,
                        message: "Distributor Product not found",
                  })
            }
            return res.status(200).json({
                  success: true,
                  message: "Distributor Product updated successfully",
                  data: updatedProduct,
            })
      }
      catch (err) {
            console.log(err)
            return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
            })
      }
}
module.exports = updateDistributorProduct