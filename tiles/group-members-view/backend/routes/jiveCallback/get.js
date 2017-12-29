var url = require('url');
var fs = require('fs');
var jive = require("jive-sdk");
var aes256 = require('nodejs-aes256');
var request=require('request');
encryptionPass = 'Vvvbmh';


exports.route = function(req, res) {
    var urlObject = url.parse(req.url, true);
    console.log('urlObject',urlObject);
    NewObject=url.parse(req.headers.referer, true);
    // jivebaseUrl=NewObject.protocol+"//"+NewObject.host;
    console.log("new object",NewObject);

    code = urlObject.query.code;
    jive.community.findByJiveURL(NewObject.protocol+"//"+NewObject.host).then(function(community){
        if(community){
            console.log("community",community);
            JVConnection(community['clientId'],community['clientSecret'] ,0,function (result,body) {
                if(result!=0){
                    res.send("Success");
                    addCredentials(result);
                }
                else {
                    res.send(body||"Error")
                }
            });
        }
        else{
            jive.logger.debug("Could not look up security credentials by community jiveURL " + jiveUrl + " -- using service credentials " + "from service configuration file (usually jiveclientconfiguration.json).");
        }
    });
};
function JVConnection(clientId,clientSecret,checkRefresh,callback) {
    console.log("chk1");
    var auth ="Basic " +  new Buffer(clientId + ":" + clientSecret).toString("base64");

    var headers = {
        "Authorization": auth,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var form={};
    if(checkRefresh){
        form={grant_type:'refresh_token',refresh_token:checkRefresh}
    }
    else {
        form= {'grant_type': 'authorization_code',  "client_id" :clientId , "code" : code}
    }

    var options = {
        url: jivebaseUrl + '/oauth2/token',
        method: 'POST',
        headers: headers,
        form: form
    };

    request(options, function (error, response, body) {
        console.log("chk3");
       console.log("error is:  ",error);
       console.log("response is----------------",response);
       console.log("body is:  ",body);
        if (!error && response.statusCode===200 ) {
            // Print out the response body
            console.log("auth-->>",JSON.parse(body));
            console.log(JSON.parse(body).access_token);
            // jive_oAuth_object=JSON.parse(body);
            var connNewOauth=JSON.parse(body);
            callback(connNewOauth)
        }
        else {
            callback(0,body);
        }
    })

}


function addCredentials(connNewOauth) {
    fs.readFile(DIRNAME + '/metadata/adminCredentials.json', 'utf8', function(unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/admin.json not exist');
            admin = {};
        } else if (data) {
            try {
                admin = JSON.parse(aes256.decrypt(encryptionPass,data));
            } catch (invalidJson) {
                console.log('metadata/admin.json is invalid');
                admin = {};
            }
        }
        admin.jiveCredentials.accessToken = connNewOauth.access_token,
            admin.jiveCredentials.refreshToken = connNewOauth.refresh_token;
        updateTokens();
    });
}


function updateTokens() {
    fs.writeFile(DIRNAME + '/metadata/adminCredentials.json', aes256.encrypt(encryptionPass,JSON.stringify(admin, "", "\t")), function(err, data) {
        if (err) {
            console.error('Unable to save tokens for ');
        }
        console.log('adminCredentials.json updated !!');
    });
}

function updateAccesToken(){
    jive.community.findByJiveURL(jivebaseUrl).then(function(community){
        if(community){
            console.log("community",community);
            JVConnection(community['clientId'],community['clientSecret'] ,1,function (result,response) {
                console.log("chk2");
                if(result!=0){
                    addCredentials(result);
                }
                else {
                    console.log(response);
                }
            });
        }
        else{
            jive.logger.debug("Could not look up security credentials by community jiveURL  -- using service credentials " + "from service configuration file (usually jiveclientconfiguration.json).");
        }
    });
}



updateAccesToken();


setInterval(updateAccesToken, 2*60*60*1000);

