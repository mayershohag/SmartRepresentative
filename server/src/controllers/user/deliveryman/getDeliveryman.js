const Deliveryman = require("../../../models/roleBaseUser/deliveryman.model")
const getDeliveryman = async (req, res) => {
      try {
            const { id } = req.params
            const deliveryman = await Deliveryman.findById(id)
            if (!deliveryman) {
                  return res.status(404).json({
                        success: false,
                        message: "Deliveryman not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Deliveryman data fetched successfully",
                  data: deliveryman
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = getDeliveryman