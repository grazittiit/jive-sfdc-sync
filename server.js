//  OpenShift sample Node application
var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  jive = require('jive-sdk'),
  http = require('http'),
  https = require('https');
cookieParser = require('cookie-parser');
session = require('express-session'),
  xmlparser = require('express-xml-bodyparser');
request = require('request');

jive = require('jive-sdk');
moment = require('moment');
lodash = require('lodash');
fs = require('fs');
async = require('async');
https = require('https');




Object.assign = require('object-assign')

DIRNAME = __dirname;


croneForUserSyncing = require('./routes/userSyncingCrone');
croneForGroupAdminCreation = require('./routes/groupAdminCreation');



app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


app.get('/', function (req, res) {
  res.render('index.html', { pageCountMessage: null });
});


// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


DIRNAME = __dirname;


var cron = require('node-cron');

var dailyTask = cron.schedule('0 0 12 * *', function () {


  console.log("daily")

  request('http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/dailyCroneForUserSyncing', function (err, result) {
    console.log(err);
  //  console.log(result)

  })

  request('http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/dailyCroneForContactsSyncing', function (err, result) {
    console.log(err);
  //  console.log(result)

  })


});

dailyTask.start();


var weeklyTask = cron.schedule('0 8 * * 0', function () {


  request('http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/weeklyCroneForUserSyncing', function (err, result) {
    console.log(err);
  //  console.log(result)

  })

  request('http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/weeklyCroneForContactsSyncing', function (err, result) {
    console.log(err);
 //   console.log(result)

  })

});

weeklyTask.start();


app.get('/dailyCroneForUserSyncing', croneForUserSyncing.croneForDailyUserUpdates);
app.get('/weeklyCroneForUserSyncing', croneForUserSyncing.croneForWeeklyUserUpdates);



app.get('/dailyCroneForContactsSyncing', croneForUserSyncing.croneForDailyContactUpdates);
app.get('/weeklyCroneForContactsSyncing', croneForUserSyncing.croneForWeeklyContactUpdates);


app.get('/croneForGroupAdminCreation', croneForGroupAdminCreation.CroneForOwnerCreation);



admin = JSON.parse(fs.readFileSync('metadata/admin.json', 'utf-8').toString());
jiveCredentials = JSON.parse(fs.readFileSync('metadata/jiveCredentials.json', 'utf-8').toString());

var salesforceConnect = require('./services/salesforceConnect');

salesforceConnect.connectToSalesforce();
salesforceConnect.getAuthorizationCodeForAnalytics();


var jiveConnect = require('./services/jiveConnect');


var failServer = function (reason) {
  console.log('FATAL -', reason);
  process.exit(-1);
};


var startServer = function () {

  console.log("inside this function")
  // if (!jive.service.role || jive.service.role.isHttp()) {
  var server = http.createServer(app).listen(8080, ip, function () {
    console.log("Express server listening on " + server.address().address + ':' + server.address().port);
  });
  GLOBAL_SERVER = server;
  // } 
};



jive.service.init(app)

  // 2. autowire all available definitions in /tiles; see explanation below.
  .then(function () { return jive.service.autowire() })

  // 3. start the service, which performs sanity checks such as clientId, clientSecret, and clientUrl defined.
  // if successful service start, call the start the http server function defined by you; otherwise call the
  // fail one
  .then(function () { return jive.service.start() }).then(startServer, failServer);



module.exports = app;
