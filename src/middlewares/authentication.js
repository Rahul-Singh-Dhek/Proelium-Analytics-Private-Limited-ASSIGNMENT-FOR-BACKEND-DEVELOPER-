const jwt = require("jsonwebtoken");
const adminAndUserModel = require("../models/admin&userModel.js")


// =======================================================AUTHENTICATION==============================================


const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ status: false, msg: "Please provide token is Auhorization ,Bearer Token" });
        } else {
            token = token.split(' ')[1]
        }
        jwt.verify(token, "Proelium Analytics Private Limited", (error, decodedtoken) => {
            if (error) {
                const msg = error.message === "jwt expired"? "Token is expired": "Token is invalid";
                return res.status(401).send({ status: false, message:msg });
            }
            else {
                req.token = decodedtoken;
            }
        });

        let tokenUser=await adminAndUserModel.findById(req.token.userId)
        if(tokenUser==null){
            return res.status(401).send({ status: false, msg: "No user found with the userId present in the tokken" });
        }
        req.tokenUser=tokenUser
        next();
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

module.exports={authentication}
