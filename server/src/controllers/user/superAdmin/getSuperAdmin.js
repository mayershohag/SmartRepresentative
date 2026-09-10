const SuperAdmin = require("../../../models/roleBaseUser/admin.model")
const getSuperAdmin = async (req, res) => {
      try {
            const { id } = req.params
            const superAdmin = await SuperAdmin.findById(id)
            if (!superAdmin) {
                  return res.status(404).json({
                        success: false,
                        message: "Super Admin not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Super Admin data fetched successfully",
                  data: superAdmin
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = getSuperAdmin