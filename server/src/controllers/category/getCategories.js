const Category = require("../../models/category.model");
const getCategories = async (req, res) => {
      try {
            const category = await Category.find();

            res.status(201).json({
                  success: true,
                  message: "Category data retrieved successfully!",
                  category,
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = getCategories;
