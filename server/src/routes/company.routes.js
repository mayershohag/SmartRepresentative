const express = require("express");
const companyRouter = express.Router();
const createCompany = require("../controllers/company/createCompany");
const Company = require("../models/company.model");
const getCompanies = require("../controllers/company/getCompanies");
const getCompany = require("../controllers/company/getCompany");
const updateCompany = require("../controllers/company/updateCompany");
const deleteCompany = require("../controllers/company/deleteCompany");

companyRouter.post("/", createCompany);
companyRouter.get("/", getCompanies);
companyRouter.get("/:name", getCompany);
companyRouter.put("/:name", updateCompany);
companyRouter.delete("/:name", deleteCompany);

module.exports = companyRouter;
