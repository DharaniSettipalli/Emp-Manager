const {
  registerUser,
  userProfile,
  loginUser,
  addEmployee,
  allEmployees,
  deleteEmployee,
  getEmployee,
  updateEmployee,
} = require("../controllers/main.controller");
const { AuthValidationMiddleware } = require("../middleware/AuthValidation");
const { ValidationMiddleware } = require('../middleware/ValidationMiddleware')

const router = require('express').Router()

const {
  registerUserValidation,
  loginUserValidation,
  addEmpValidation,
  empId,
} = require("../validations/main.validations");

router.route('/register')
.post(registerUserValidation, ValidationMiddleware , registerUser)

router
  .route("/login")
  .post(loginUserValidation, ValidationMiddleware, loginUser);

router.use(AuthValidationMiddleware);

router.route('/profile')
.get(userProfile)

router
  .route("/add-employee")
  .post(addEmpValidation,ValidationMiddleware,addEmployee);

  router
  .route("/emp/:id")
  .delete(empId, ValidationMiddleware, deleteEmployee)
  .get(empId, ValidationMiddleware, getEmployee)
  .put([...empId, addEmpValidation],ValidationMiddleware,updateEmployee);


router
  .route("/all-employee")
  .get(allEmployees);



module.exports = router