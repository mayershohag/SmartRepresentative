const Shopkeeper = require("../../../models/roleBaseUser/shopkeeper.model")
const updateShopkeeper = async (req, res) => {
      try {
            const { id } = req.params
            const shopkeeper = await Shopkeeper.findByIdAndUpdate(id, req.body, {
                  new: true, runValidators: true
            })
            if (!shopkeeper) {
                  return res.status(404).json({
                        success: false,
                        message: "Shopkeeper not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Shopkeeper data updated successfully",
                  data: shopkeeper
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
                  error: error.message
            })
      }
}
module.exports = updateShopkeeper