const Category = require("../../models/category.model");

const updateCategory = async (req, res) => {
      try {
            const params = req.params.categoryId;
            const { name, image, description } = req.body;
            const category = await Category.findOne({ _id: params });

            if (!category) {
                  return res.status(404).json({
                        success: false,
                        message: "404 Category Not Found!",
                  });
            }

            const updatedCategory = await Category.findOneAndUpdate(
                  { _id: category._id },
                  req.body,
                  {
                        returnDocument: "after",
                        runValidators: true,
                  },
            );
            res.status(201).json({
                  success: true,
                  message: "Category data updated successfully!",
                  category: updatedCategory,
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({
                  success: false,
                  message: "Internal Server Error.",
            });
      }
};

module.exports = updateCategory;
