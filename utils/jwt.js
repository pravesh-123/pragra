/**
 * CreatedBy:Mohini solace
 * Created Date : 07/07/2021
 *  Purpose: to perform Authentication and Authorization using jwt and HS256 algorithm
 */
const jwt = require("jsonwebtoken");
const config = require("config");
const UserProfiles = require('../models/user-profiles');
const fs = require('fs');
const { global } = require('../global/globalMessages');

//to generate token
const generateToken = async (user) => {
    try {
        var token = jwt.sign({ id: user.id }, config.get('SECRETEKEY'), { algorithm: 'HS256', expiresIn: '24h' });
        var refreshToken = jwt.sign({ id: user.id }, config.get('SECRETEKEY'), { algorithm: 'HS256', expiresIn: '24h' })
        await UserProfiles.updateProfile({ token: token, refresh_token: refreshToken }, { id: user.id });
        var result = await UserProfiles.findUserProfile({ id: user.id });
        return await result;
    } catch (error) {
        throw new Error(error, "error in generate token");
    }
};

//verify token
const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '');
        if (!token)
            return res.send({ status: false, message: NoTokenProvided });
            jwt.verify(token, config.get('SECRETEKEY'), { algorithm: 'HS256', expiresIn: '24h'}, (err, user) => {
            if (err) { throw new Error(Unauthorized); };
            req.userId = user.id;
            next();
        });

    } catch (e) {
        throw new Error(e, "error in verify token");
    }
};









module.exports = { generateToken, verifyToken };