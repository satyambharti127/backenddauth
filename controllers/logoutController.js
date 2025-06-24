const userDB={
    users:require("../models/users.json"),
    setUsers:function(data) {this.users=data}
};
const path=require('path')
const fsPromises=require('fs').promises

const handleLogout=async(req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt) res.sendStatus(204)
    const refreshToken=cookies.jwt;
    const foundUser=userDB.users.find(user=>user.refreshToken===refreshToken)
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:"none",secure:true})
        res.sendStatus(204)
    }
    const otherUsers=userDB.users.filter(person=>person.refreshToken!==refreshToken);
    const currentUser={...foundUser,refreshToken:""}
    userDB.setUsers({...otherUsers,currentUser})
    await fsPromises.writeFile(
        path.join(__dirname,'..','models','users.json'),
        JSON.stringify(userDB.users)
    )
}
module.exports={handleLogout}