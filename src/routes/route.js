const express=require('express')
const router=express.Router() 
const {add,login,update}=require("../controllers/admin&userController.js")
const {authentication}=require("../middlewares/authentication.js")



router.post("/AdminOrUser/Add",authentication,add)
router.post("/AdminOrUser/Login",login)
router.post("/AdminOrUser/:updateId/Update",authentication,update)

router.get("/test-me",(req,res)=>{
    return res.status(200).send({status:false,message:"App is Running"})
})

module.exports=router 