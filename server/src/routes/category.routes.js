const express = require("express");
const categoryRouter = express.Router();

const createCategory = require("../controllers/category/createCategory");
const getCategories = require("../controllers/category/getCategories");
const getCategory = require("../controllers/category/getCategory");
const updateCategory = require("../controllers/category/updateCategory");
const deleteCategory = require("../controllers/category/deleteCategory");
const authValidator = require("../middlewares/common/authValidator");

categoryRouter.post("/", authValidator, createCategory);
categoryRouter.get("/", authValidator, getCategories);
categoryRouter.get("/:categoryId", authValidator, getCategory);
categoryRouter.put("/:categoryId", authValidator, updateCategory);
categoryRouter.delete("/:categoryId", authValidator, deleteCategory);

module.exports = categoryRouter;
