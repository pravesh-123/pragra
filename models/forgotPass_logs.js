/**
 * CreatedBy:Mohini solace
 * Created Date:1-07-2021
 * purpose: To declare  forgot password logs related schema
 */


const Sequelize = require('sequelize');
const ForgotPasswordlogs = sequelize.define('forgot_password_logs', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    activation_link: {
        type: Sequelize.STRING(225),
        allowNull: true,
    },
    from:{
        type: Sequelize.STRING(225),
        allowNull: true,
    },
    subject: {
        type: Sequelize.STRING(225)
    },
    purpose: {
        type: Sequelize.STRING(225)
    },
    email: {
        type: Sequelize.STRING(225)
    },

    html_content: {
        type: Sequelize.STRING(225)
    },
    expiry_date: {
        type: Sequelize.DATE
    },
    status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: 1

    }
}, { sequelize, tableName: 'forgot_password_logs', timestamps: true, paranoid: true });
ForgotPasswordlogs.sync({ alter: true });

//add record 
module.exports.addRecord = async (data) => {
    let record = await ForgotPasswordlogs.create(data);
    return record;
};

//find record
module.exports.findRecord = async (data) => {
  let record = await ForgotPasswordlogs.findOne({ where: data });
      return record;
}


//to update record by value
module.exports.updateRecord = async (obj, val) => {
    let result = await ForgotPasswordlogs.update(obj, { where: val });
    return result;
}
