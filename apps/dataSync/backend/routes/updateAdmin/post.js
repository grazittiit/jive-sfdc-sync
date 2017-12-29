/**
 * Created by paras on 26/7/16.
 */

var fs = require('fs');
var aes256 = require('nodejs-aes256');


exports.route = function(req, res) {

    fs.readFile(DIRNAME + '/metadata/admin.json', 'utf8', function(unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/admin.json not exist');
            admin = {};
        } else if (data) {

            admin = JSON.parse(data);
        }
        if (!admin.salesforce) admin.salesforce = {};

        admin.salesforce.clientSecret = req.body.salesforceClientSecret;
        admin.salesforce.clientId = req.body.salesforceClientId;
        admin.salesforce.redirect_uri = req.body.redirectUrl;
        admin.loginUrl = req.body.loginUrl;
        
        admin = JSON.stringify(admin);


        fs.writeFile(DIRNAME + '/metadata/admin.json',admin,function(err, data){
            if (err) {
                console.error('Unable to Update Admin', err);
                res.send(err);
            }
            else{
                console.log('admin.json updated !!');
                res.send('admin.json updated !!');
            }
        })
    });
}