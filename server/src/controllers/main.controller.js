const { UserModel } = require("../models/user.model");
const { EmpModel } = require("../models/emp.model");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_auth_secret = "$#%^*&(%%^&^%&%#"
const {default:randomInt} = require('random-int')

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //checking if user already exists
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
        throw new Error("User already exists, please login")
    }
    //Password hash
    const hash_pass = await bcryptjs.hash(password,10)

    //create user
   const user = await UserModel.create({name,
        email,
        password: hash_pass
    })

    const token = jwt.sign({userId:user._id}, jwt_auth_secret,{
        expiresIn:'3d'
    })

    res.send({ message: "Registered successfully", token });
  } catch (error) {
    res.status(400).send({error:error.message})
  }
};

exports.userProfile = async (req,res) => {
  try {
    const user = await UserModel.findById(req.user).select("name email -_id")
    const employees = await EmpModel.countDocuments({user:req.user})
    user['total_emp'] = employees

    return res.status(200).send({...user.toObject(), total_emp: employees})
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checking if user already exists
    const existUser = await UserModel.findOne({ email });
    if (!existUser) {
      throw new Error("User does not  exists, please register if you're a new user");
    }
    //Password comparison
    const isMatch = await bcryptjs.compare(password, existUser.password);

    if(!isMatch){
      throw new Error("Invalid credentials")
    }
    const token = jwt.sign({ userId: existUser._id }, jwt_auth_secret, {
      expiresIn: "3d",
    });

    res.send({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.addEmployee = async (req,res)=>{
  try {
    console.log('incoming request::', req.body)
    //console.log("body: ", req.file);
    const newEmp = await EmpModel.create({
      ...req.body,
      user: req.user,
      empId: "EMP" + randomInt(100,9999)+ "ID"
    });
    res.status(200).send({message:"Employee added succesfully", data: newEmp})


  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

exports.allEmployees = async (req,res)=>{
  try {
    //console.log('incoming request::', req.body)
    //console.log("body: ", req.file);
    let {search,gender,active} = req.query ? req.query : "";
console.log("User id: ", req.user)
    // const employees = await EmpModel.find({
    //   user: req.user,
    // });
    const employees = await EmpModel.find({
      user: req.user,
      name: {
        $regex: search,
        $options: "i", //case insensitive
      },
      gender: {
        $regex: `\\b${gender}\\b`, //exact match
        $options: "i"
      },
      activeStatus: {
        $regex: `\\b${active}\\b`,
      },
    });
    res.status(200).send({message:"Employee details fetched succesfully", data: employees})
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
}

//deleteEmployee
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id
    const emp = await EmpModel.findByIdAndDelete(id);
    if(!emp){
      throw new Error("Employee doesn't exist")
    }
    res.status(200).send({ message: "Employee deleted succesfully", data: emp });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


exports.getEmployee = async (req, res) => {
  try {
    const id = req.params.id
    const emp = await EmpModel.findById(id);
    if(!emp){
      throw new Error("Employee doesn't exist")
    }
    res
      .status(200)
      .send(emp);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

//updateEmployee;
exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const emp = await EmpModel.findByIdAndUpdate(id,{
      ...req.body
    });
    if (!emp) {
      throw new Error("Employee doesn't exist");
    }
    res.status(200).send({message:"Employee updated",data:emp});
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
