const Shopkeeper = require("../../../models/roleBaseUser/shopkeeper.model")
const deleteShopkeeper = async (req, res) => {
      try {
            const { id } = req.params
            const shopkeeper = await Shopkeeper.findByIdAndDelete(id)
            if (!shopkeeper) {
                  return res.status(404).json({
                        success: false,
                        message: "Shopkeeper not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Shopkeeper data deleted successfully"
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
module.exports = deleteShopkeeper