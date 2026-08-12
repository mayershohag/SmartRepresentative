const Company = require("../../models/company.model");

const createCompany = async (req, res) => {
      try {
            const { name, logo, description, website, phone, email, isActive } =
                  req.body;

            if (!name || !phone) {
                  return res.status(901).json({
                        success: false,
                        message: "all fields are required",
                  });
            }

            const isExists = await Company.findOne({ name });
            if (isExists) {
                  return res.status(901).json({
                        success: false,
                        message: "Company Already Exists.",
                  });
            }

            const company = new Company({
                  name,
                  logo,
                  description,
                  website,
                  phone,
                  email,
                  isActive,
            });

            await company.save();
            res.status(200).json({
                  success: true,
                  message: "Company created Successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(501).json({
                  success: false,
                  message: "Company creation failed!",
            });
      }
};

module.exports = createCompany;
