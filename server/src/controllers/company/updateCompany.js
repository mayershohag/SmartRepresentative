const Company = require("../../models/company.model");
const updateCompany = async (req, res) => {
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

            const updatedCompany = await Company.findOneAndUpdate(
                  { _id: company._id },
                  req.body,
                  {
                        returnDocument: "after",
                        runValidators: true,
                  },
            );
            res.status(200).json({
                  success: true,
                  message: `${company.name}'s data update Successfully!`,
                  company: updatedCompany,
            });
      } catch (err) {
            console.log(`error: `, err);

            if (err.code === 11000) {
                  return res.status(409).json({
                        success: false,
                        message: "Company name already exists.",
                  });
            }

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = updateCompany;
