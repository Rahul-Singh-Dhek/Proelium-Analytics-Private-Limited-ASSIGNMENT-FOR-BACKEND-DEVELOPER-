const adminAndUserModel=require("../models/admin&userModel.js")
const validator=require("../validator/validator.js")
const bcrypt=require("bcrypt")

const add=async (req,res)=>{

    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:"Please provide details of user or admin to add in request body."})
    }

    if(req.body["First Name"]!=undefined){
        if(!validator.isValidName(req.body["First Name"])){
            return res.status(400).send({status:false,message:"Please provide valid First Name that only contains Alphabet."})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide First Name in request body"})
    }

    if(req.body["Middle Name"]!=undefined){
        if(!validator.isValidName(req.body["Middle Name"])){
            return res.status(400).send({status:false,message:"Please provide valid Middle Name that only contains Alphabet."})
        }
    }

    if(req.body["Last Name"]!=undefined){
        if(!validator.isValidName(req.body["Last Name"])){
            return res.status(400).send({status:false,message:"Please provide valid Last Name that only contains Alphabet."})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide Last Name in request body."})
    }

    if(req.body["Email"]!=undefined){
        if(!validator.isValidEmail(req.body["Email"])){
            return res.status(400).send({status:false,message:"Please provide valid Email."})
        }
        let unique=await adminAndUserModel.findOne({Email:req.body["Email"]})
        if(unique){
            return res.status(400).send({status:false,message:"Email already exists please provide valid Email."})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide Email in request body."})
    }

    if(req.body["Password"]!=undefined){
        if(!validator.isValidPassword(req.body["Password"])){
            return res.status(400).send({status:false,message:"Please provide valid Password in string with no spaces and Min 6 Charecters and Max 12 charecters."})
        }
        if(req.body["Confirm Password"]==undefined){
            return res.status(400).send({status:false,message:"Please provide Confirm Password."})
        }
        if(req.body["Confirm Password"]!=req.body["Password"]){
            return res.status(400).send({status:false,message:"Confirm Passwords does not match."})
        }
        let hash = bcrypt.hashSync(req.body["Password"], 10)
        req.body["Password"]=hash
    }else{
        return res.status(400).send({status:false,message:"Please provide Password in request body."})
    }

    if(req.body["Role"]!=undefined){
        let roles=["Admin","User"]
        if(!roles.includes(req.body["Role"])){
            return res.status(400).send({status:false,message:"Please provide anyone  value from [Admin , User] in  Role"})
        }
    }else{
        return res.status(400).send({status:false,message:"Please provide Role in request body."})   
    }

    let savedData=await adminAndUserModel.create(req.body)
    let message
    if(savedData.Role=="Admin"){
        message="Successfully Added Admin"
    }else{
        message="Successfully Added User"
    }

    return res.status(201).send({status:true,message:message,data:savedData})
    
}



module.exports={add}