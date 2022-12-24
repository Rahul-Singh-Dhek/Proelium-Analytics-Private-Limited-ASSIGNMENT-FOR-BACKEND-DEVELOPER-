const express=require('express')
const router=express.Router() 
const {add}=require("../controllers/admin&userController.js")


router.post("/AddAdminOrUser",add)

router.get("/test-me",(req,res)=>{
    return res.status(200).send({status:false,message:"App is Running"})
})

module.exports=router 