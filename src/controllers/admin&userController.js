const adminAndUserModel = require("../models/admin&userModel.js")
const validator = require("../validator/validator.js")
const bcrypt = require("bcrypt")
const mongoose=require('mongoose')
const jwt = require("jsonwebtoken")

const add = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide details of user or admin to add in request body." })
        }

        if (req.body["First Name"] != undefined) {
            if (!validator.isValidName(req.body["First Name"])) {
                return res.status(400).send({ status: false, message: "Please provide valid First Name that only contains Alphabet." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide First Name in request body" })
        }

        if (req.body["Middle Name"] != undefined) {
            if (!validator.isValidName(req.body["Middle Name"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Middle Name that only contains Alphabet." })
            }
        }

        if (req.body["Last Name"] != undefined) {
            if (!validator.isValidName(req.body["Last Name"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Last Name that only contains Alphabet." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide Last Name in request body." })
        }

        if (req.body["Email"] != undefined) {
            if (!validator.isValidEmail(req.body["Email"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Email." })
            }
            let unique = await adminAndUserModel.findOne({ Email: req.body["Email"] })
            if (unique) {
                return res.status(400).send({ status: false, message: "Email already exists please provide valid Email." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide Email in request body." })
        }

        if (req.body["Password"] != undefined) {
            if (!validator.isValidPassword(req.body["Password"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Password in string with no spaces and Min 6 Charecters and Max 12 charecters." })
            }
            if (req.body["Confirm Password"] == undefined) {
                return res.status(400).send({ status: false, message: "Please provide Confirm Password." })
            }
            if (req.body["Confirm Password"] != req.body["Password"]) {
                return res.status(400).send({ status: false, message: "Confirm Passwords does not match." })
            }
            let hash = await bcrypt.hash(req.body["Password"], 10)
            req.body["Password"] = hash
        } else {
            return res.status(400).send({ status: false, message: "Please provide Password in request body." })
        }

        if (req.body["Role"] != undefined) {
            let roles = ["Admin", "User"]
            if (!roles.includes(req.body["Role"])) {
                return res.status(400).send({ status: false, message: "Please provide anyone  value from [Admin , User] in  Role" })
            }
            if (req.tokenUser.Role == "User" && req.body["Role"] == "Admin") {
                return res.status(400).send({ status: false, message: "You cannot add Admin" })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide Role in request body." })
        }

        if(req.body["Department"]!=undefined){
            if(typeof req.body["Department"]!="string"){
                return res.status(400).send({ status: false, message: "Please provide Department as string in request body."})
            }
        }

        let savedData = await adminAndUserModel.create(req.body)
        let message
        if (savedData.Role == "Admin") {
            message = "Successfully Added Admin"
        } else {
            message = "Successfully Added User"
        }

        return res.status(201).send({ status: true, message: message, data: savedData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, message: "Please provide Email and Password in req body " })
        }

        if (req.body["Email"] != undefined) {
            if (!validator.isValidEmail(req.body["Email"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Email." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide Email in request body." })
        }

        if (req.body["Password"] != undefined) {
            if (!validator.isValidPassword(req.body["Password"])) {
                return res.status(400).send({ status: false, message: "Please provide valid Password in string with no spaces and Min 6 Charecters and Max 12 charecters." })
            }
        } else {
            return res.status(400).send({ status: false, message: "Please provide Password in request body." })
        }

        let verifyUser = await adminAndUserModel.findOne({ Email: req.body["Email"] })
        if (!verifyUser) {
            return res.status(404).send({ status: false, message: "No user found with this email." })
        }

        const comparePassword = await bcrypt.compare(req.body["Password"], verifyUser.Password)
        if (!comparePassword) return res.status(401).send({ status: false, message: "Invalid Credentials" })

        let token = jwt.sign(
            {
                userId: verifyUser._id.toString()
            },
            "Proelium Analytics Private Limited"
        )
        return res.status(200).send({ status: true, message: "Success", data: { userId: verifyUser._id, token: token } })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}

const update=async (req,res)=>{

    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:`Please provide at least one field to update in request body`})
    }

    let arr=["First Name","Middle Name","Last Name","Email","Role","Department"]
    for(let key in req.body){
        if(!arr.includes(key)){
            return res.status(400).send({status:false,message:`Invalid ${key} field to update.`})
        }
    }

    let person;
    if(req.params.updateId==undefined){
        return res.status(400).send({status:false,message:`Please provide userId of preson, whose profile you want to update or if you want to update your profile then just write 'Self' in the path params`})
    }
    if(req.params.updateId=="Self"||req.params.updateId==req.tokenUser._id){
        req.params.updateId=req.tokenUser._id
        person=req.tokenUser
    }else{
        if(!mongoose.isValidObjectId(req.params.updateId)){
            return res.status(400).send({status:false,message:`Please provide valid userId in request params.`})
        }
        person=await adminAndUserModel.findById(req.params.updateId)
    }


    if(req.tokenUser.Role=="User"&&person.Role=="Admin"){
        return res.status(400).send({status:false,message:`A User cannot update profile of an Admin.`})
    }

    if (req.body["First Name"] != undefined) {
        if (!validator.isValidName(req.body["First Name"])) {
            return res.status(400).send({ status: false, message: "Please provide valid First Name that only contains Alphabet." })
        }
    }

    if (req.body["Middle Name"] != undefined) {
        if (!validator.isValidName(req.body["Middle Name"])) {
            return res.status(400).send({ status: false, message: "Please provide valid Middle Name that only contains Alphabet." })
        }
    }

    if (req.body["Last Name"] != undefined) {
        if (!validator.isValidName(req.body["Last Name"])) {
            return res.status(400).send({ status: false, message: "Please provide valid Last Name that only contains Alphabet." })
        }
    }

    if (req.body["Email"] != undefined) {
        if (!validator.isValidEmail(req.body["Email"])) {
            return res.status(400).send({ status: false, message: "Please provide valid Email." })
        }
        let unique = await adminAndUserModel.findOne({ Email: req.body["Email"] })
        if (unique) {
            return res.status(400).send({ status: false, message: "Email already exists please provide unique Email to Update." })
        }
    }
    
    if (req.body["Role"] != undefined) {
        let roles = ["Admin", "User"]
        if (!roles.includes(req.body["Role"])) {
            return res.status(400).send({ status: false, message: "Please provide anyone value from [Admin , User] in  Role" })
        }
        if (req.tokenUser.Role == "User" && req.body["Role"] == "Admin") {
            return res.status(400).send({ status: false, message: "A User cannot make himself and another person a Admin." })
        }
    }

    if(req.body["Department"]!=undefined){
        if(typeof req.body["Department"]!="string"){
            return res.status(400).send({ status: false, message: "Please provide Department as string in request body."})
        }
    }

    let savedData=await adminAndUserModel.findByIdAndUpdate(req.params.updateId,req.body,{new:true})
    return res.status(201).send({status:false,message:"Profile Successfully Updated",data:savedData})

}

const view=async (req,res)=>{
    
}


module.exports = { add, login,update }