const express = require('express');
const employeeRouter = express.Router();

// ✅ Middleware imports
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');

// ✅ Role constants
const ROLES_LIST = require('../../config/roles_list');

// ✅ Controller functions
const {
    getAllEmployees,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    getEmployee
} = require('../../controllers/empController');

// ✅ Apply JWT verification to all routes
employeeRouter.use(verifyJWT);

// ✅ Route definitions
employeeRouter.route('/')
    .get(getAllEmployees)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

employeeRouter.route('/:id')
    .get(getEmployee);

module.exports = employeeRouter;
