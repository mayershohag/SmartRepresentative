const Product = require("../../models/product.model");
const Company = require("../../models/company.model");

const createProduct = async (req, res) => {
      try {
            const {
                  company,
                  category,
                  name,
                  sku,
                  barcode,
                  image,
                  description,
                  unit,
                  unitValue,
                  status,
            } = req.body;

            const isExistCompany = await Company.findById(company);
            if (!isExistCompany) {
                  return res.status(404).json({
                        success: false,
                        message: "Company Not Found.",
                  });
            }

            const checkDuplicateSKU = await Product.findOne({
                  company,
                  sku,
                  category,
            });

            if (checkDuplicateSKU) {
                  return res.status(409).json({
                        success: false,
                        message: "This SKU already exists for this company.",
                  });
            }

            const product = new Product({
                  company,
                  category,
                  name,
                  sku,
                  barcode,
                  image,
                  description,
                  unit,
                  unitValue,
                  status,
            });
            await product.save();

            res.status(201).json({
                  success: true,
                  message: "Product created successfully",
                  product,
            });
      } catch (err) {
            console.log(err);

            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = createProduct;
