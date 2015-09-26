var express = require('express');
var fs = require("fs");
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var async = require('async');
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'designworks.nu@gmail.com',
    pass: 'designworks2014'
  }
});

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/portfolio', function(req, res) {
  console.log('Current directory: ' + process.cwd());
  var files = fs.readdirSync('public/img/portfolio');
  var data = {images: []};
  _.each(files, function(file){
    if(file != '.DS_Store'){
      data.images.push({filename: file});
    }
  });
  res.render('portfolio', data);
});

router.get('/process', function(req, res) {
  res.render('process');
});

router.get('/services', function(req, res) {
  res.render('services');
});

router.get('/team', function(req, res) {
  res.render('team');
});

router.get('/apply', function(req, res) {
  res.render('apply');
});

router.post('/mail', function(req, res) {
  var cap = req.body['g-recaptcha-response'];

  request.post({
    url:'https://www.google.com/recaptcha/api/siteverify', 
    form: { secret: '6LfpEQcTAAAAAHOer9Gk0lnDvW3MpFftJ6FGnPg5', response: cap }}, 
    function(err,httpResponse,body){ 
      var data = JSON.parse(body)
      if(data['success']){
        async.parallel([
            function(callback){
                transporter.sendMail({
                  from: 'designworks.nu@gmail.com',
                  to: 'designworks.nu@gmail.com',
                  subject: 'Service request ' + req.body.Service + " from " + req.body.Name,
                  text: 'Service request from ' +  req.body.Name + '\n' + req.body.Email + '\n' + req.body.Message
                }, callback);
            },
            function(callback){
              transporter.sendMail({
                from: 'designworks.nu@gmail.com',
                to: req.body.Email,
                subject: 'Thank you for your ' + req.body.Service + ' request',
                text: 'Hello ' +  req.body.Name + '!\n\nWe have received your design request, and a member from the DesignWorks team will contact you within 24 Hours regarding the details of your req. If this request is urgent, please contact us at (847)-868-0418, or email us at\nhello@designworks.nu\n\nHave a nice day!\nThe DesignWorks Team'
              }, callback);
            }
        ],
        // optional callback 
        function(err, results){
            res.redirect('/process');
        });
      }
  });
});




module.exports = router;
