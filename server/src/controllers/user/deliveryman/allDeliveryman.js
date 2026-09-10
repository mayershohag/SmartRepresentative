const Deliveryman = require("../../../models/roleBaseUser/deliveryman.model")
const allDeliveryman = async (req, res) => {
      try {
            const Deliverymans = await Deliveryman.find()
            if (!Deliverymans) {
                  res.status(404).json({
                        success: false,
                        message: "Deliverymans empty",
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Deliverymans data fetched successfully",
                  data: Deliverymans
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = allDeliveryman