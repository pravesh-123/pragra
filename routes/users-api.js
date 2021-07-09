/**
 * CreatedBy:Mohini solace
 * Created Date:14-06-2021
 * purpose: To declare all user related routes
 */

const bodyParser = require('body-parser');
const userController = require('../contorollers/users.controller');
const {verifyToken}= require('../utils/jwt');
const {mixFileUpload}= require('../uploads/imgUpload');
module.exports = (app, connection) => {
    app.use(bodyParser.json());
    //user signup/registration
    app.post("/api/users/signup", mixFileUpload("img","vid","logo"),userController.userSignup);
    //user login
    app.post("/api/users/login", userController.userLogin);
    //get tweets
    app.get('/api/twitter', userController.getTweets);
    //get instagram post
    app.get('/api/instagram/post', userController.getInstagramPost);
    //check activation link is valid or not
    app.post('/api/users/activationlink',userController.getActivationLink);
    //forgot password
    app.post('/api/users/forgotpassword',userController.forgotPassword);
    //reset password
    app.post('/api/users/resetpassword',userController.resetPassword);
    //verify reset password link
    app.post('/api/users/resetpassword/verifylink',userController.verifyResetPassLink);
    //get user data by id
    app.get('/api/users',verifyToken,userController.getUserById);
}




