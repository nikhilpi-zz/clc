var express = require('express');
var fs = require("fs");
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var async = require('async');
var router = express.Router();
var nodemailer = require('nodemailer');


/* GET home page. */

router.get('/', function(req, res) {
  res.render('index');
});





module.exports = router;
