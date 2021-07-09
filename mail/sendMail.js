/**
 * CreatedBy :Mohini solace
 * Purpose: To send Mails
 * CreatedDate : 13-05-2021
 */


 var transporter = require('./mail');
const config = require('config');
 
 async function sendMailToUser(EmailObject, MailContent) {
 
     try {
         process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = "1"
         var mailOptions = {
             from: config.get('User'),
             to: EmailObject.email,
             subject: EmailObject.subject,
             text: 'Hello',
             html: MailContent
         };
       
         process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
          // verify connection configuration
        
         transporter.verify(function (error, success) {
             if (error) console.log(error);
             else console.log('Server is ready to take our messages');
         });
         //send mail
         transporter.sendMail(mailOptions, async function (error, info) {
 
            if (error) console.log(error)
             else console.log('Email sent: ' + info.response);
             EmailObject.EmailContent = MailContent;
           
         });
 
     } catch (e) {
         throw new Error("mail sending fails catch block: ", e);
     }
 }
 
 
 module.exports = sendMailToUser;
 