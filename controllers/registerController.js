const userDB ={
    users:require("../models/users.json"),
    setUsers:function(data) {this.users=data}
};

const path=require('path')
const fsPromises=require('fs').promises
const bcrypt = require('bcrypt')
const ROLES_LIST = require('../config/roles_list')

const handleNewUser=async(req,res)=>{
    const{username,password,roles}=req.body;
    if(!username || !password)
        return res.status(400).json({"message":"Username and Password are required"})
    const duplicate = userDB.users.find(user=>user.username===username)
    if(duplicate)
        return res.status(409).json({ message: "Username already exists" });
    try{
        const hashedPassword=await bcrypt.hash(password,10)
        // Parse roles from form (array or string)
        let userRoles = {};
        if (roles) {
            let selectedRoles = Array.isArray(roles) ? roles : [roles];
            selectedRoles.forEach(role => {
                if (ROLES_LIST[role]) userRoles[role] = ROLES_LIST[role];
            });
        }
        if (Object.keys(userRoles).length === 0) userRoles = {"User": ROLES_LIST.User};
        const newUser ={username,password:hashedPassword,roles:userRoles}
        userDB.setUsers([...userDB.users,newUser])
        console.log(newUser)
        await fsPromises.writeFile(path.join(__dirname,'..','models','users.json'),JSON.stringify(userDB.users))
        res.status(201).json({"message":"`New user is created"})
    }
    catch(error){
        res.status(500).json({"message":error.message})

    }
}

module.exports={handleNewUser}