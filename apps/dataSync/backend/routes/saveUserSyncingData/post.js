/**
 * Created by paras on 3/8/16.
 */

//var jiveBaseUrl = "https://wiley.grazconnect.com:1600/dataSync";
var callbackUrl = jive.service.serviceURL() + '/webhooks';



var requiredJiveFields = [{"field":"familyName"},{"field":"givenName"},{"field":"Email"}];


var requiredSalesforceFields = [{"field":"FirstName"},{"field":"Email"},{"field":"LastName"}];



var _ = require("lodash");



exports.route = function(req,res)
{
    console.log("save user syncing api hit");
    var userData = req.body.userData;
    var userArray = [];
    var userSyncingData;
    var jiveIndexMatched = [];
    var salesforceIndexMatched = [];

    async.waterfall([
        function(cb){
            fs.readFile(DIRNAME + '/metadata/userSyncingData.json', 'utf8', function(unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/userSyncingData.json doesnt exist');
                    userSyncingData = {};
                } else if (data) {

                    userSyncingData = JSON.parse(data);
                }
                if (!userSyncingData.userSyncingData) userSyncingData.userSyncingData = [];
                cb(null);

            })
        },
        function(cb){
            userData = JSON.parse(userData);
            var mapping = userData.mapping;
            mapping.forEach(function (fields) {


                if( fields.mappingType == 0)
                {
                    var index = _.findIndex(requiredJiveFields,{"field":fields.jiveField});
                    console.log(index);
                    if (index != -1) {
                        jiveIndexMatched.push(index);
                    }
                }
                else if(fields.mappingType == 1){
                    var index = _.findIndex(requiredSalesforceFields,{"field":fields.salesforceField});
                    console.log(index);
                    if (index != -1) {
                        salesforceIndexMatched.push(index);
                    }
                }
                else if(fields.mappingType == 2)
                {
                    var index = _.findIndex(requiredSalesforceFields,{"field":fields.salesforceField});
                    console.log(index);
                    if (index != -1) {
                        salesforceIndexMatched.push(index);
                    }
                    var index2 = _.findIndex(requiredJiveFields,{"field":fields.jiveField});
                    console.log(index2);
                    if (index2 != -1) {
                        jiveIndexMatched.push(index2);
                    }
                }
            });

            if (jiveIndexMatched.length >= requiredJiveFields.length || salesforceIndexMatched.length >= requiredSalesforceFields.length) {
                cb(null);
            }
            else {
                res.send({"message": "Please map all the required fields", "status": 400});
            }
        },
        function(cb){
            userArray.push(userData);

            userSyncingData.userSyncingData = userArray;
            userSyncingData = JSON.stringify(userSyncingData);

            fs.writeFile(DIRNAME + '/metadata/userSyncingData.json',userSyncingData,function(err, data){
                if (err) {
                    console.error('Unable to Update User Syncing Data', err);
                    res.send({
                        "message": "Some error occured",
                        "status": 400
                    })
                }
                else{
                    console.log('userSyncingData.json updated !!');
                    cb(null);
                }
            })
        },
        function(cb){
            
            if(userData.frequency == 0)
            {
                createWebHook();
            }
            cb(null);
        }
    ],function(err,result)
    {
        if (err) {
            res.send({
                "message": "Some error occured",
                "status": 400
            })
        }
        else {
            res.send({"message": "Updated Successfully", "status": 200});
        }

    });
};



function createWebHook()
{
    var accessToken = jive1.access_token;
    var headers = {
        'Authorization': 'Bearer '+accessToken,
        'Content-Type': 'application/json'
    };

    var dataString = {
        "events" : "user_account",
        "callback": callbackUrl
    };

    console.log(accessToken);
    dataString = JSON.stringify(dataString);

    var options = {
        url: jiveLoginUrl+'/api/core/v3/webhooks',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    function callback(error, response, body) {
        console.log(error);
        console.log(body);
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }

    request(options, callback);
}
