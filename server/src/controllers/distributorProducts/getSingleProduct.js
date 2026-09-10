const DistributorProduct = require("../../models/distributorProduct.model")
const getSingleProduct = async (req, res) => {
      try {
            const { productId } = req.params
            const distributorProduct = await DistributorProduct.findById(productId).populate("product distributor")

            if (!distributorProduct) {
                  return res.status(404).json({
                        success: false,
                        message: "Distributor Product not found!",
                  })
            }

            return res.status(200).json({
                  success: true,
                  message: "Distributor Product",
                  data: distributorProduct
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
module.exports = getSingleProduct