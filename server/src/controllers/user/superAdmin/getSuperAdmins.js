const SuperAdmin = require("../../../models/roleBaseUser/admin.model")
const getSuperAdmins = async (req, res) => {
      try {
            const superAdmins = await SuperAdmin.find()
            res.status(200).json({
                  success: true,
                  message: "SuperAdmins data fetched successfully",
                  data: superAdmins
            })

      } catch (error) {
            console.log(error)

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error"
            })
      }
}
module.exports = getSuperAdmins