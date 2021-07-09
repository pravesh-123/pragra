/**
 * CreatedBy:Mohini solace
 * Created Date:14-06-2021
 * purpose: To declare common operations
 */


const SendMailToUser = require('../mail/sendMail');
const config = require('config');
const uniqid = require('uniqid');
const getHtmlContent = require('../mail/htmlContent');
const ForgotPassLog = require('../models/forgotPass_logs');
const EmailLog = require('../models/email-logs');
//send email
async function sendMail(user, type, aLink) {
  try {
    let end_date = new Date(); var emailObj, content, link = "";
    end_date.setHours(end_date.getHours() + 48);
    var expiryDate = end_date;

    if (type == "Registration") {
      link = config.get('HTTP_ACTIVATION_URL') + aLink;
      emailObj = await storeActivationLink(user, expiryDate, activationLink, type, "This is activation link for registration ");
      await EmailLog.addLogs(emailObj);
      content = await getHtmlContent(link, user.first_name, type);
    } else if (type == "ForgotPassword") {
      var activationLink = await uniqid(user.email + '_');
      link = config.get('HTTP_RESET_URL') + activationLink;
      emailObj = await storeActivationLink(user, expiryDate, activationLink, type, "This is activation link for reset password ");
      await ForgotPassLog.addRecord(emailObj);
      content = await getHtmlContent(link, user.email, type);
    }
    await SendMailToUser(emailObj, content);
  } catch (e) {
    throw new Error(e, "send  mail catch block");
  }




  //Store Activation Link in email_logs table
  async function storeActivationLink(user, expiryDate, link, subject, description) {
    try {
      var EmailObject = {
        email: user.email,
        from: config.get('User'),
        subject: subject,
        purpose: description,
        activation_link: link,
        expiry_date: expiryDate
      };
      return EmailObject;

    }
    catch (error) { console.log(error, "store activation link catch block"); }
  }
}

module.exports = { sendMail };











