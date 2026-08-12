const Company = require("../../models/company.model");
const deleteCompany = async (req, res) => {
      try {
            const name = req.params.name;
            const company = await Company.findOne({
                  name: new RegExp(name, "i"),
            });
            if (!company) {
                  return res.status(404).json({
                        success: false,
                        message: "404 Company Not Found!.",
                  });
            }
            await Company.findOneAndDelete({ _id: company._id });
            res.status(200).json({
                  success: true,
                  message: `${company.name}'s data deleted Successfully!`,
            });
      } catch (err) {
            console.log(`error: `, err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = deleteCompany;
