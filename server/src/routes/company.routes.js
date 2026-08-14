const express = require("express");
const companyRouter = express.Router();
const createCompany = require("../controllers/company/createCompany");
const Company = require("../models/company.model");
const getCompanies = require("../controllers/company/getCompanies");
const getCompany = require("../controllers/company/getCompany");
const updateCompany = require("../controllers/company/updateCompany");
const deleteCompany = require("../controllers/company/deleteCompany");
const authValidator = require("../middlewares/common/authValidator");
const roleChecker = require("../middlewares/common/roleChecker");


companyRouter.post("/", authValidator, roleChecker, createCompany);
companyRouter.get("/", authValidator, roleChecker, getCompanies);
companyRouter.get("/:name", authValidator, roleChecker, getCompany);
companyRouter.put("/:name", authValidator, roleChecker, updateCompany);
companyRouter.delete("/:name", authValidator, roleChecker, deleteCompany);

module.exports = companyRouter;
