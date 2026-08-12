const Category = require("../../models/category.model");
const createCategory = async (req, res) => {
      try {
            const { name, image, description } = req.body;
            const isExistsName = await Category.findOne({ name });

            if (isExistsName) {
                  return res.status(409).json({
                        success: false,
                        message: "Category Already Exists.",
                  });
            }

            const category = new Category({
                  name,
                  image,
                  description,
            });
            await category.save();
            res.status(201).json({
                  success: true,
                  message: "Category created successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};
module.exports = createCategory;
