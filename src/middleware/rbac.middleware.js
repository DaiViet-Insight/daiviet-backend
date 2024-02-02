const roles = require('../config/roles.json').roles;
const userService = require('../services/userService')
const jwt = require('jsonwebtoken');
const userRoleService = require('../services/userRole.service')
const roleService = require('../services/roleService')
const hasPermission = (permission)=>  async (req,res,next) => {
    try{
    const token = req.headers.authorization.substring(7);
    const user = jwt.verify(token, 'secret');
    const userRoles = await userRoleService.getRoleByUserId(user.id);     
        
    const roleNamesPromise = await userRoles.map(role =>  roleService.getRoleName(role.dataValues.roleId));
    const roleNames = await Promise.all(roleNamesPromise)
        
    const role = roles.find(role => roleNames.includes(role.name));
    if(role.permissions.includes(permission)){
        next();
    }
    else
    

  
    res.status(401).send("You don't have permission to access this resource");
    }

    catch(error){
        console.log("error")
        console.log(error.message)
        res.status(401).send(error.message);
    }
}


module.exports = {
    hasPermission
}