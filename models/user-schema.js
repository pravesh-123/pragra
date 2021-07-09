/**
 * CreatedBy:Mohini solace
 * Created Date:14-06-2021
 * purpose: To declare  user related schema
 */

const Sequelize = require('sequelize');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
   email: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: true
    },
   role:{
        type: Sequelize.TINYINT.UNSIGNED,//superadmin,admin,partner,communityuser
        allowNull: true
    },
    activation_link:{
        type: Sequelize.STRING(225),
        allowNull: true
    },
    expiry_date:{
        type: Sequelize.DATE
    },
    status:{
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0
    }
  
}, { sequelize, tableName: 'users', timestamps: true, paranoid: true });
User.sync({ alter: true });

//add user 
module.exports.addUser = async (data) => {
    let result = await User.create(data);
    return result;
};

//find user
module.exports.findUser = async (data) => {
    let result = await User.findOne({ where: data });
    return result;
}

//to verify activation link

module.exports.verifyActivationlink =async(link) =>{
    let result = await User.findOne({ where: link });
    return result;
}

//to update user data by value
module.exports.updateUserData = async(obj,val) => {
    let result = await User.update(obj, { where: val} );
    return result;
}