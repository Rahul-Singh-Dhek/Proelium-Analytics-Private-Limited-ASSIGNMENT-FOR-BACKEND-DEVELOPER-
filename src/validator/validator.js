

const isValidName=(Name)=>{
    if(typeof Name!="string"){
        return false
    }
    if(!/^[a-zA-Z]{2,14}$/.test(Name)){
        return false
    }
    return true
}

const isValidEmail=(Email)=>{
    if(typeof Email!="string"){
        return false
    }
    if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(Email)){
        return false
    }
    return true
}

const isValidPassword=(Password)=>{
    if(typeof Password!="string"){
        return false
    }
    for(let i=0;i<Password.length;i++){
        if(Password[i]==" "){
            return false
        }
    }
    if(Password.length>=6&&Password.length<=6){
        return false
    }
    return true
}

module.exports={isValidName,isValidEmail,isValidPassword}