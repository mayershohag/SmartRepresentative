const Company = require("../../models/company.model");
const getCompanies = async (req, res) => {
      try {
            const companies = await Company.find();
            res.status(200).json({
                  success: true,
                  message: "Data Retrieve Successfully!",
                  companies,
            });
      } catch (err) {
            console.log(`error: `, err);

            return res.status(501).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = getCompanies;
