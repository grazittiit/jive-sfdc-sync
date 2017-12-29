/**
 * Created by paras on 27/7/16.
 */


jive = require('jive-sdk');

var callbackUrl = jive.service.serviceURL() + '/webhooks';



exports.route = function(req,res)
{
    
    console.log(callbackUrl);
    var accessToken = jiveCredentials.access_token;
    var headers = {
        'Authorization': 'Bearer '+accessToken,
        'Content-Type': 'application/json'
    };

    var dataString = {
    "events" : "user_account",
    "callback": callbackUrl
};

   dataString = JSON.stringify(dataString);

var options = {
    url: 'community.carbonblack.com/api/core/v3/webhooks',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
        console.log(body);
        res.send("success");
    }
}

request(options, callback);

}