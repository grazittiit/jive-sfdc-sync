/**
 * Created by paras on 9/8/16.
 */


var jiveConnection = require('../apps/dataSync/backend/routes/jiveLogin/post');
var jiveConnect = require('./jiveConnect');

jive1 = JSON.parse(fs.readFileSync(DIRNAME + '/metadata/jiveCredentials.json', 'utf-8').toString());



// fs.watchFile('./metadata/jiveCredentials.json', {
//     persistent: true
// }, function(event, filename) {
//     console.log("jive credentials.json Changed");
//     jive1 = JSON.parse(fs.readFileSync(DIRNAME + '/metadata/jiveCredentials.json', 'utf-8').toString());
//     readJiveCredentialsFile();
// });


exports.readJiveCredentialsFile = function()
{
    fs.readFile(DIRNAME + '/metadata/jiveCredentials.json', 'utf8', function (unableToOpen, data) {

        if (unableToOpen) {
            res.send("problem in reading json file")
        }
        else {

           jive1 = JSON.parse(data);
           jiveLoginUrl = jive1.JiveCredentials.jiveLoginUrl;
            
           // console.log(jive1);

            jiveConnection.JVConnection(jive1.JiveCredentials.username,jive1.JiveCredentials.password,jive1.jiveSecret.clientId,jive1.jiveSecret.clientSecret, function (result) {

                if (result == 0) {
                   console.log("credentials not valid")
                } else {
                    console.log("jive credentials valid");
                }
            })
        }

    })


};




jiveConnect.readJiveCredentialsFile();




setInterval(function() {

    var headers = {
        'Authorization':'Bearer '+jive1.access_token,
        'Content-Type': 'application/json'
    };

    var options = {
        url: jiveLoginUrl+'/api/core/v3/people',
        method: 'GET',
        headers: headers
    };

    request(options,function(err,response,data)
    {
        console.log(err);
     //   console.log(data);
        if(err || response.statusCode !== 200){
            jiveConnect.readJiveCredentialsFile();
        }
        else{
            console.log("jive credentials working");
        }
    })

}, 1000*60*60);
