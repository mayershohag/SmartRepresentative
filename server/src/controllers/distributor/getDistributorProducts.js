const DistributorProduct = require("../../models/distributorProduct.model");

const getDistributorProducts = async (req, res) => {
      try {
            const { userId } = req.user

            const distributorProducts = await DistributorProduct.find({ distributor: userId }).populate("product")

            res.status(200).json({
                  success: true,
                  message: "Distributor products fetched successfully",
                  data: distributorProducts,
            });

      }
      catch (err) {
            console.log(err)

            res.status(500).json({
                  success: false,
                  message: "Internal server error",
                  error: err.message,
            });
      }
}

module.exports = getDistributorProducts