/**
 * Created by paras on 27/7/16.
 */


var url = require('url');
var fs = require('fs');
var jsforce = require('jsforce');
var aes256 = require('nodejs-aes256');
tokens = {};


exports.route = function(req, res) {

    console.log("callback from salesforce received");

    setTimeout(function(){
        console.log("fjbdfhhd inside timeout.....")
        var urlObject = url.parse(req.url, true);
        console.log('urlObject',urlObject);
        res.render('oauthCallback.ejs', {
            'urlObject': urlObject
        });

        var code = urlObject.query.code;

        var sfdc_community_url = urlObject.query.sfdc_community_url;

        console.log("admin object",JSON.stringify(admin));

        if(admin.salesforce == undefined)
        {
            admin = JSON.parse(admin);
        }

        var oauth2 = new jsforce.OAuth2({
            loginUrl : admin.loginUrl,
            clientId: admin.salesforce.clientId,
            clientSecret: admin.salesforce.clientSecret,
            redirectUri: admin.salesforce.redirect_uri
        });
        console.log(oauth2);
        var connNewOauth = new jsforce.Connection({
            oauth2: oauth2
        });
        var contactId;
        connNewOauth.authorize(code, function(err, userInfo) {
            if (err) {
                return console.log('err', err);
            }

            connNewOauth.query("select ContactId from user where id = '"+userInfo.id+"'",function(err,response){
                console.log('err',err);
                console.log('response',response);
                contactId = response.records[0].ContactId;
                addCredentials(userInfo);
            });
        });


        function addCredentials(userInfo) {
            fs.readFile(DIRNAME + '/metadata/admin.json', 'utf8', function(unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/admin.json not exist');
                    admin = {};
                } else if (data) {
                    try {
                        admin = JSON.parse(data);
                    } catch (invalidJson) {
                        console.log('metadata/admin.json is invalid');
                        admin = {};
                    }
                }
                admin['admin'] = {
                    "accessToken": connNewOauth.accessToken,
                    "refreshToken": connNewOauth.refreshToken,
                    "instanceUrl": connNewOauth.instanceUrl,
                    "oauth2"      : connNewOauth.oauth2,
                    "contactId" : contactId,
                    "userInfo"  : userInfo
                };
                updateTokens();
            });
        }

        function updateTokens() {
            admin = JSON.stringify(admin);
            fs.writeFile(DIRNAME + '/metadata/admin.json',admin, function(err, data) {
                if (err) {
                    console.error('Unable to save tokens for ');
                }
                console.log('admin.json updated !!');
            });
        }
    }, 4000);

};
