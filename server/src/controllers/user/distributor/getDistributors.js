const Distributor = require("../../../models/roleBaseUser/distributor.model")
const getDistributors = async (req, res) => {
      try {
            const distributors = await Distributor.find()
            res.status(200).json({
                  success: true,
                  message: "Distributors fetched successfully",
                  data: distributors
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = getDistributors