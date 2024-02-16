const { Role}= require('../models')
async function getRoleName(roleId)
{
    const roleName = await Role.findOne({
        where: {
            id: roleId,
        },
        attributes: ["roleName"],
    });
    return roleName.dataValues.roleName;
}
module.exports={
    getRoleName
}