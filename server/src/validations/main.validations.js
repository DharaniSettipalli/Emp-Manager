const {param,body} = require('express-validator')

exports.registerUserValidation = [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Enter valid Email").toLowerCase(),
    body('password').notEmpty().withMessage("Password id required")
]

exports.loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter valid Email")
    .toLowerCase(),
  body("password").notEmpty().withMessage("Password id required"),
];

// empId: '',
//         name:'',
//         gender:'',
//         dob:'',
//         state:'',
//         activeStatus:"",
//         image:''

exports.addEmpValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("gender").notEmpty().withMessage("Gender is required"),
  body("dob").notEmpty().withMessage("Date of birth is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("activeStatus").notEmpty().withMessage("Active status is required"),
  // body("image").notEmpty().withMessage("Image is required")
];

exports.empId = [
  param('id').notEmpty().withMessage("Id is required").isMongoId().withMessage("Enter valid Mongo ID")
];