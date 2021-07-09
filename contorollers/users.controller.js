/**
 * CreatedBy:Mohini solace
 * Created Date:14-06-2021
 * purpose: To declare all user related operations
 */

var bcrypt = require("bcryptjs");
const User = require('../models/user-schema');
const UserProfile = require('../models/user-profiles');
const ForgotPass = require('../models/forgotPass_logs');
const config = require("config");
const TwitterClient = require("twitter-api-client").TwitterClient;
const { sendMail } = require('./common.controller');
const { successResponse, errorResponse, failResponse } = require("../utils/response");
const ig = require('instagram-node');
const uniqid = require('uniqid');
const Role = require('../global/globalConstants');
const { global } = require('../global/globalMessages');
const { generateToken } = require('../utils/jwt');


//signup
exports.userSignup = async (req, res) => {
  var pic = "", vid = "", logo = "";
  if (req.files.img) {
    pic = Url + req.files.img[0].filename;
  }
  if (req.files.vid) {
    vid = Url + req.files.vid[0].filename;
  }
  if (req.files.logo) {
    logo = Url + req.files.logo[0].filename;
  }
  const userObj = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirm_password: req.body.confirm_password,
    province: req.body.province,
    postal: req.body.postal,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    city: req.body.city,
    buisness_number: req.body.buisness_number,
    orgnization_logo: logo,
    orgnization_name: req.body.orgnization_name,
    orgnization_type: req.body.orgnization_type,
    profile_image: pic,
    video_link: vid,
    profile_headline: req.body.profile_headline,
    position: req.body.position,
    language: req.body.language,
    how: req.body.how,
    website: req.body.website,
    type: req.body.type,
    facebook_feed: req.body.facebook_feed,
    twitter_feed: req.body.twitter_feed
  }
  var end_date = new Date();
  end_date.setHours(end_date.getHours() + 48);
  var activationLink = await uniqid(req.body.email + '_');

  await UserProfile.addUserProfile(userObj)
    .then(async (user) => {
      if (user) {
        var obj = {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          activation_link: activationLink,
          expiry_date: end_date
        }
        var msg = "";
        if (req.body.type == "partner") {
          msg = "Please check your email";
          obj.role = Role.partner;
          await sendMail(user, "Registration", activationLink);
        }
        else if (req.body.type == "community_movement") {
          obj.role = Role.community_movement;
          await sendMail(user, "Registration", activationLink);
          msg = "Please check your email1";
        } else {
          obj.role = "";
        }
        await User.addUser(obj);
        return successResponse(req, res, user, msg);
      }
      else return res.send({ status: false, message: SignupError });
    }).catch((err) => { res.send({ message: err.message }); });
}

//login       
exports.userLogin = async (req, res) => {
  await User.findUser({ email: req.body.email }).then(async (user) => {
    if (!user)
      return res.send({ status: false, message: UserNotFound });
    var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.send({ status: false, message: IncorrectPassword });
    } else {
      var obj = await UserProfile.findUserProfile({ email: user.email });
      var result = await generateToken(obj);
      return successResponse(req, res, result);
    }
  }).catch((err) => { res.send({ message: err.message }); });
}

//activation link verification
exports.getActivationLink = async (req, res) => {
  var today = new Date();
  await User.findUser({ activation_link: req.body.activation_link }).then(async (link) => {
    var obj = { activation_link: "", status: 1 };
    if (link != null) {
      if (link.expiry_date >= today) {
        var data = await User.updateUserData(obj, { email: link.email });
        var result = await UserProfile.findUserProfile({ email: link.email });
        res.status(200).send(result);
      }
      else res.send({ message: LinkExpired });
    } else res.send({ message: InvalidLink });
  }
  ).catch((err) => {
    res.send({ message: err.message });
  })
}
//forgot password
exports.forgotPassword = async (req, res) => {
  await User.findUser({ email: req.body.email, status: 1 }).then(async (data) => {
    if (data) {
      await sendMail(data, "ForgotPassword");
      res.send({ message: "We sent the link on " + req.body.email + ". Please check your inbox." });
    } else res.send({ message: InvalidEmail });
  }).catch((err) => {
    res.send({ message: err.message });
  })
}

//reset password
exports.resetPassword = async (req, res) => {
  var newPassword = bcrypt.hashSync(req.body.password, 8);
  await ForgotPass.findRecord({ activation_link: req.body.activation_link, status: 1 }).then(async (data) => {
    if (data != null) {
      await ForgotPass.updateRecord({ status: 0 }, { activation_link: req.body.activation_link });
      await User.updateUserData({ password: newPassword }, { email: data.email });
      await UserProfile.updateProfile({ password: newPassword }, { email: data.email });
      var result = await UserProfile.findUserProfile({ email: data.email });
      return successResponse(req, res, result);
    } else return res.send({ message: ErrorInResetPassword });
  }).catch((err) => {
    res.send({ message: err.message });
  })
}

//verify password activation link
exports.verifyResetPassLink = async (req, res) => {
  var today = new Date();
  await ForgotPass.findRecord({ status: 1, activation_link: req.body.activation_link }).then(async (data) => {
    if (data != null) {
      if (data.expiry_date >= today) {
        res.send({ message: ValidLink });
      } else res.send({ message: LinkExpired });
    } else res.send({ message: InvalidLink });
  }).catch((err) => {
    res.send({ message: err.message });
  })
}

//get user data by id
exports.getUserById = async (req, res) => {

  await UserProfile.findUserProfile({ id: req.userId }).then(async (data) => {
    if (data != null) {
      return successResponse(req, res, data);
    }
    else {
      return res.send({ status: false, message: UserNotFound });
    }
  })
}

//get user tweets by hastags
exports.getTweets = async (req, res) => {
  const query = req.params.query;

  const twitterClient = new TwitterClient({
    apiKey: config.get('TWITTER_API_KEY'),
    apiSecret: config.get(''),

    accessTokenSecret: config.get('TWITTER_ACCESS_TOKEN_SECRET'),
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
  });
  twitterClient.tweets.search({ q: query, })
    .then((tweets) => {
      res.status(200).send(tweets);
    })
    .catch((err) => {
      res.status(500).send("An error occured. Please try again letter", err);
    });
}


//api for instagram feed

exports.getInstagramPost = async (req, res) => {
  ig.use({
    client_id: config.get(CLIENT_ID),
    client_secret: config.get(CLIENT_SECRET),
  });

  //the redirect uri we set when registering our application
  var redirectUri = "https://instagram-api12.herokuapp.com/";

  app.get("/authorize", function (req, res) {
    // set the scope of our application to be able to access likes and public content
    res.redirect(
      ig.get_authorization_url(redirectUri, {
        scope: ["public_content", "likes"],
      })
    );
  });

  app.get("/handleAuth", function (req, res) {
    //retrieves the code that was passed along as a query to the '/handleAuth' route and uses this code to construct an access token
    ig.authorize_user(req.query.code, redirectUri, function (err, result) {
      if (err) res.send(err);
      // store this access_token in a global variable called accessToken
      accessToken = result.access_token;
      // After getting the access_token redirect to the '/' route
      res.redirect("/");
    });
  });
  app.get("/", function (req, res) {
    // create a new instance of the use method which contains the access token gotten
    ig.use({
      access_token: config.get(accessToken),
    });

    ig.user_media_recent(
      "access_token.split('.')[0]",
      function (err, result, pagination, remaining, limit) {
        if (err) res.json(err);
        // pass the json file gotten to our ejs template
        res.render("pages/index", { instagram: result });
      }
    );
  });

}



//contact us
// exports.getInTouch = async (req, res) => {
//   User.findOne({
//     where: {
//      email: req.body.email
//     }
//   }).then(async (result) => {
//     await sendMail();
//   }).catch((err) => {

//   })
// }