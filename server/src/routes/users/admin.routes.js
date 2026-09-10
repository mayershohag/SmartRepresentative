const express = require("express");
const getSuperAdmins = require("../../controllers/user/superAdmin/getSuperAdmins");
const deleteSuperAdmin = require("../../controllers/user/superAdmin/deleteSuperAdmin");
const getSuperAdmin = require("../../controllers/user/superAdmin/getSuperAdmin");
const updateSuperAdmin = require("../../controllers/user/superAdmin/updateAdmin");
const adminRouter = express.Router();

adminRouter.get("/", getSuperAdmins);
adminRouter.get("/:id", getSuperAdmin);
adminRouter.put("/:id", updateSuperAdmin);
adminRouter.delete("/:id", deleteSuperAdmin);

module.exports = adminRouter;
