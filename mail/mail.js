/**
 * CreatedBy :Mohini solace
 * CreatedDate:14-05-2021
 * Purpose: To do setup for send mail
 */
const config = require('config');


 const nodemailer = require('nodemailer');
 
 process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 1;
 
 var transporter = nodemailer.createTransport({
     service:config.get('Service'),
     server: 'smtp.gmail.com',
     port: config.get('Port'),
     auth: { user:config.get('User'), pass: config.get('Password') },
     secureConnection: 'false',
     tls: {
         ciphers: 'SSLv3'
 
     }
 });
 
 
 
 
 module.exports = transporter;
 