const Category = require("../../models/category.model");

const deleteCategory = async (req, res) => {
      try {
            const params = req.params.categoryId;
            const category = await Category.findOne({ _id: params });
            if (!category) {
                  return res.status(404).json({
                        success: false,
                        message: "404 Category Not Found!",
                  });
            }

            await Category.findOneAndDelete({
                  _id: category._id,
            });
            res.status(201).json({
                  success: true,
                  message: "Category data deleted successfully!",
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = deleteCategory;
