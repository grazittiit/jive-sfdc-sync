

var jiveConnection = require('./post');


var DynamicVariable = {

    "baseUrlJive": 'https://grazitti-paras.jiveon.com/',
    "apiPath": 'api/core/v3/',
    "Oauth": 'oauth2/token'

};



exports.route = function (req, res) {

    fs.readFile(DIRNAME + '/metadata/jiveCredentials.json', 'utf8', function (unableToOpen, data) {

        if (unableToOpen) {
            res.send("problem in reading json file")
        }
        else {

            jive1 = JSON.parse(data);
            jiveLoginUrl = jive1.JiveCredentials.jiveLoginUrl;

            jiveConnection.JVConnection(jive1.JiveCredentials.username,jive1.JiveCredentials.password,jive1.jiveSecret.clientId,jive1.jiveSecret.clientSecret, function (result) {

                if (result == 0) {
                    res.send({
                        "flag": 101,
                        "value": "Credentials Invalid"
                    })
                } else {
                    res.send({
                        "flag": 200,
                        "value": "Connection Succeeded"
                    })
                }
            })
        }

    })

};



exports.JVConnection = function (username, password, clientId, clientSecret, callback) {


    console.log("fdgfgdffgdfg");

    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    console.log("Jive auth created");


    var auth = "Basic " + new Buffer(clientId + ":" + clientSecret).toString("base64");


    // Set the headers
    var headers = {
        "Authorization": auth,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    var DynamicVariable = {

        "baseUrlJive": jiveLoginUrl,
        "apiPath": 'api/core/v3/',
        "Oauth": 'oauth2/token'

    };

// Configure the request
    var options = {
        url: jiveLoginUrl + "/"+DynamicVariable.Oauth,
        method: 'POST',
        headers: headers,
        form: {'grant_type': 'password', "username": username, "password": password}
    };

// Start the request
    request(options, function (error, response, body) {

        console.log(options);
       console.log(error);
        console.log(body);

        if (!error && response.statusCode === 200) {

            console.log("body..............",body);
             body = JSON.parse(body);
            jive1.access_token = body.access_token;
            jive1.refresh_token = body.refresh_token;
            jive1.token_type = body.token_type;
            jive1.expires_in = body.expires_in;
            jive1 = JSON.stringify(jive1);
            console.log(jive1);
            fs.writeFile(DIRNAME + '/metadata/jiveCredentials.json',jive1,function(err, data){
                if (err) {
                    console.error('Unable to Update jive credentials', err);
                    callback(0);
                }
                else{
                    jive1 = JSON.parse(jive1);
                    jiveLoginUrl = jive1.JiveCredentials.jiveLoginUrl;
                    console.log('jivecredentials.json updated !!');;

                    callback(1);
                }
            });

        }
        else {
            callback(0);
        }
    })


};