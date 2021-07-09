/**
 * CreatedBy:Mohini solace
 * Created Date:1-07-2021
 * purpose: To declare  email logs related schema
 */


const Sequelize = require('sequelize');
const Emaillogs = sequelize.define('email_logs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  from:{
    type: Sequelize.STRING(225),
    allowNull: true,
  },
  activation_link: {
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
}, { sequelize, tableName: 'email_logs', timestamps: true, paranoid: true });
Emaillogs.sync({ alter: true });

//add logs
module.exports.addLogs = async (data) => {
  let record = await Emaillogs.create(data);
  return record;
};