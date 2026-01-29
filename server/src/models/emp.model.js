// empId: '',
//         name:'',
//         gender:'',
//         dob:'',
//         state:'',
//         activeStatus:"",
//         image:''

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    empId:{
        type:String,
        default:null
    },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  activeStatus: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
},{
    timestamps: true
});

const model = mongoose.model("emp",schema)
exports.EmpModel = model