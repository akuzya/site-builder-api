

var config = require('../config');
var nodemailer = require("nodemailer");
var request = require("request");


// var sgTransport = require('nodemailer-sendgrid-transport');


// console.log('config.sendGrid: ', config.sendGrid);

// var transport = nodemailer.createTransport(sgTransport(config.sendGrid));
var transport = nodemailer.createTransport(config.mailGun);



module.exports = {
    send: function (email, subject, html, attachments, done) {
        console.log('email,subject,html: ', email, subject, html);

        transport.sendMail({
            from: config.mail.from,
            to: email,
            subject: subject || config.mail.subject,
            html: html,
            attachments: attachments
        }, (err, body) => {
            console.log('send err, body: ', err, body);
            
            done(err, body);
        });
    },
    validate: function (email, done) {
        request({
            uri: "https://api.mailgun.net/v2/address/validate",
            method: "GET",
            qs: {
                address: email,
                api_key: config.mail.validate_key
            }
        }, function (err, msg, body) {
            var json = JSON.parse(body);
            if (!json.is_valid || err) {
                return done("invalid_email");
            }

            return done(null);
        })
    }
};