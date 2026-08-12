const express = require("express");
const categoryRouter = express.Router();

const createCategory = require("../controllers/category/createCategory");
const getCategories = require("../controllers/category/getCategories");
const getCategory = require("../controllers/category/getCategory");
const updateCategory = require("../controllers/category/updateCategory");
const deleteCategory = require("../controllers/category/deleteCategory");

categoryRouter.post("/", createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId", getCategory);
categoryRouter.put("/:categoryId", updateCategory);
categoryRouter.delete("/:categoryId", deleteCategory);

module.exports = categoryRouter;
