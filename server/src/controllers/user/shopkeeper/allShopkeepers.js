const Shopkeeper = require("../../../models/roleBaseUser/shopkeeper.model")
const allShopKeepers = async (req, res) => {
      try {
            const shopkeepers = await Shopkeeper.find()
            res.status(200).json({
                  success: true,
                  message: "Shopkeepers data fetched successfully",
                  data: shopkeepers
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = allShopKeepers