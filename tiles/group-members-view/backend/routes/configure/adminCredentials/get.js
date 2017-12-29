/**
 * Created by paras on 12/10/16.
 */

var aes256 = require('nodejs-aes256');
var jive = require("jive-sdk");
encryptionPass = 'Vvvbmh';

exports.route = function (req, res) {

    var authorization = req.headers['authorization'];
    console.log("headers", req.headers);
    var authVars = authorization.split(' ');
    if (authVars[0] == 'JiveEXTN') { // try to parse out jiveURL
        var authParams = authVars[1].split('&');
        authParams.forEach(function (p) {
            if (p.indexOf('jive_url') == 0) {
                console.log("p", p);
                console.log("jive", jive.community);
                console.log("decoded url ",decodeURIComponent(p.split("=")[1]));
                jive.community.findByJiveURL(decodeURIComponent(p.split("=")[1])).then(function (community) {
                    console.log("community ",community);
                    if (community) {
                        res.send({
                            "username": "",
                            "password": "",
                            "clientId": community['clientId'],
                            "clientSecret": community['clientSecret']
                        });
                    } else {
                        jive.logger.debug("Could not look up security credentials by community jiveURL " + jiveUrl + " -- using service credentials " + "from service configuration file (usually jiveclientconfiguration.json).");
                    }
                });
            }
        });
    }


    console.log("inside this request");
    // fs.readFile(DIRNAME + '/metadata/adminCredentials.json', 'utf8',function (unableToOpen, data) {
    //     if (unableToOpen) {
    //         console.log('metadata/adminCredentials.json doesnt exists');
    //         res.send("some problem in adminCredentials.json file");
    //     }
    //     else{
    //         data = JSON.parse(aes256.decrypt(encryptionPass,data));
    //         console.log("data",data);
    //
    //
    //
    //
    //         res.send({
    //             "username":data.jiveCredentials.username,
    //             "password":data.jiveCredentials.password,
    //             "clientId":data.clientDetails.clientId,
    //             "clientSecret":data.clientDetails.clientSecret
    //         });
    //     }
    // })

};