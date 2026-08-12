const Company = require("../../models/company.model");
const getCompany = async (req, res) => {
      try {
            const name = req.params.name;
            const company = await Company.findOne({
                  name: new RegExp(name, "i"),
            });

            res.status(200).json({
                  success: true,
                  message: "Data Retrieve Successfully!",
                  company,
            });
      } catch (err) {
            console.log(`error: `, err);

            res.status(501).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = getCompany;
