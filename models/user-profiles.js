/**
 * CreatedBy:Mohini solace
 * Created Date:28-06-2021
 * purpose: To declare  user profile related schema
 */

const Sequelize = require('sequelize');

const UserProfiles = sequelize.define('user-profiles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    last_name: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    city: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    province: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    postal: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    status: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0
    },

    position: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    buisness_number: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    website: {
        type: Sequelize.STRING(225),
        allowNull: true
    },

    email: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: true
    },
    confirm_password: {
        type: Sequelize.STRING(60),
        allowNull: true
    },
    orgnization_name: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    orgnization_type: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    orgnization_logo: {
        type: Sequelize.STRING(100),
        allowNull: true
    },

    language: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    profile_image: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    profile_headline: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    video_link: {
        type: Sequelize.STRING(225),
        allowNull: true
    },

    twitter_feed: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    facebook_feed: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    token: {
        type: Sequelize.STRING(225),
        allowNull: true
    },
    refresh_token: {
        type: Sequelize.STRING(225),
        allowNull: true
    }
}, { sequelize, tableName: 'user-profiles', timestamps: true, paranoid: true });
UserProfiles.sync({ alter: true });

//add user profile
module.exports.addUserProfile = async (data) => {
    let result = await UserProfiles.create(data);
    return result;
};

//find user profile
module.exports.findUserProfile = async (data) => {
    let result = await UserProfiles.findOne({ where: data });
    return result;
}
//update user profile
module.exports.updateProfile = async (obj, data) => {
    let result = await UserProfiles.update(obj, { where: data });
    return result;
}