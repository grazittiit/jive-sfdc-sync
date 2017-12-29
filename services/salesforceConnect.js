/**
 * Created by paras on 29/7/16.
 */

var fs = require('fs');
var jsforce = require('jsforce');
var jive = require('jive-sdk');
var url = require('url');
admin = JSON.parse(fs.readFileSync(DIRNAME + '/metadata/admin.json', 'utf-8').toString());
var salesforceConnect = require('./salesforceConnect');
//var clientId = "9fhlu1s2lmfg4e36npnbm3i5us4tp5n9.i";
//var secret = "685qso60i1sq6js2h16ewsd2bq9ix53m.s";



fs.watchFile('./metadata/admin.json', {
    persistent: true
}, function(event, filename) {
    console.log("Admin.json Changed");
    admin = JSON.parse(fs.readFileSync(DIRNAME + '/metadata/admin.json', 'utf-8').toString());
    salesforceConnect.connectToSalesforce();
});



exports.connectToSalesforce = function() {
    if (admin.admin) {
        var token = admin.admin;
        conn = new jsforce.Connection({
            "oauth2": token.oauth2,
            "instanceUrl": token.instanceUrl,
            "accessToken": token.accessToken,
            "refreshToken": token.refreshToken
        });
        conn.on("refresh", function(accessToken, res) {
            console.log("refresh");
            console.log('accessToken, res', accessToken, res);
            admin['admin'].accessToken = accessToken;
            fs.writeFile(DIRNAME + '/metadata/admin.json',JSON.stringify(admin), function(err, data) {
                if (err) {
                    console.error('Unable to save tokens');
                }
                console.log('tokens.json updated !!');
            });
        });
        //Test Query --------------------------
        conn.query(" Select Name FROM Account where ID IN (Select AccountToId from Partner where AccountFromId = '0012800000WmgzP')", function(err, result) {
            console.log('TEST QUERY',err, result);
            console.log('err, result',err, result);
        });
    }
};


exports.getAuthorizationCodeForAnalytics = function()
{
    var analyticsOptions = {
        url: 'https://api.jivesoftware.com/analytics/v1/auth/login?clientId=o6j8zgk1q6t07hlbjh3rtrphp8e7d8bi.i&clientSecret=g9p1adglh4h6yxmgx5eph6pbibmkzu21.s',
        method: 'POST'
    };

    request(analyticsOptions,function(err,response,body)
    {
        console.log(err);
        console.log(body);
        analyticsAuthorizationHeader = body;
        
    })

};


setInterval(function() {

    salesforceConnect.getAuthorizationCodeForAnalytics();

}, 1000*60*20);



salesforceConnect.connectToSalesforce();



salesforceConnect.getAuthorizationCodeForAnalytics();



setInterval(function() {

    conn.query("SELECT Id FROM Account limit 1", function(err, result) {
        if (err) {
            salesforceConnect.connectToSalesforce();
        }
        else {
            console.log("working--")
        }
    });
}, 1000*60*60);




