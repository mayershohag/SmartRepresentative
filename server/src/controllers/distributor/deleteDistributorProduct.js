const DistributorProduct = require("../../models/distributorProduct.model")

const deleteDistributorProduct = async (req, res) => {
      try {
            const { productId } = req.params
            const deletedProduct = await DistributorProduct.findOneAndDelete({ product: productId })
            if (!deletedProduct) {
                  return res.status(404).json({
                        success: false,
                        message: "Distributor Product not found",
                  })
            }
            return res.status(200).json({
                  success: true,
                  message: "Distributor Product deleted successfully",
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
module.exports = deleteDistributorProduct