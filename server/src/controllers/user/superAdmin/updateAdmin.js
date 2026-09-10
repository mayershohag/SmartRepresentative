const SuperAdmin = require("../../../models/roleBaseUser/admin.model")
const updateSuperAdmin = async (req, res) => {
      try {
            const { id } = req.params
            const superAdmin = await SuperAdmin.findByIdAndUpdate(id, req.body, {
                  new: true, runValidators: true
            })
            if (!superAdmin) {
                  return res.status(404).json({
                        success: false,
                        message: "Super Admin not found"
                  })
            }
            res.status(200).json({
                  success: true,
                  message: "Super Admin data updated successfully",
                  data: superAdmin
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
module.exports = updateSuperAdmin