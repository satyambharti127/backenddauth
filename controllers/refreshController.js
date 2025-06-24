const userDB={
    users:require("../models/users.json"),
    setUsers:function(data) {this.users=data}
}

const jwt=require('jsonwebtoken')
require('dotenv').config()
const handleRefreshToken=(req,res,)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    const foundUSer = userDB.users.find(user=>user.refreshToken===refreshToken)
    if(!foundUSer) return res.sendStatus(403)

   const roles = Object.values(foundUSer.roles)
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err || foundUSer.username !=decoded.username) return res.sendStatus(403)
            const accessToken=jwt.sign(
                {   
                    "UserInfo":{
                    "username":foundUSer.username,
                    //"roles":roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'120s'}
            )
            res.json({accessToken})
        }
)
}
module.exports={handleRefreshToken}