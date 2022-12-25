const mongoose=require('mongoose')

const adminUserSchema = new mongoose.Schema({
    "First Name":{type:String,required:true},
    "Middle Name":{type:String},
    "Last Name":{type:String,required:true},
    "Email":{type:String,required:true,unique:true},
    "Password":{type:String,required:true},
    "Role":{type:String,required:true,enum:["Admin","User"]},
    "Department":{type:String}
},{timeStamps:true})

module.exports=new mongoose.model('users&admins',adminUserSchema) 