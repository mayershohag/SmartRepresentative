const Distributor = require("../../../models/roleBaseUser/distributor.model")
const getDistributor = async (req, res) => {
      try {
            const { id } = req.params
            const distributor = await Distributor.findById(id)
            if (!distributor) {
                  return res.status(404).json({
                        success: false,
                        message: "Distributor not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Distributor fetched successfully",
                  data: distributor
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = getDistributor