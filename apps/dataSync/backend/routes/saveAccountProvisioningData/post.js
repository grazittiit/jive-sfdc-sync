/**
 * Created by paras on 29/7/16.
 */


var requiredJiveFields = [{"field":"name"}];

var _ = require("lodash");


exports.route = function (req, res) {

    var indexMatched = [];
    var accountArray = [];
    
    var accountData = req.body.accountData;

    var accountProvisioningData;


    async.waterfall([
        function (cb) {
            fs.readFile(DIRNAME + '/metadata/accountProvisioningData.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/accountProvisioningData.json doesnt exists');
                    accountProvisioningData = {};
                } else if (data) {

                    accountProvisioningData = JSON.parse(data);
                }
                if (!accountProvisioningData.accountProvisioningData) accountProvisioningData.accountProvisioningData = [];
                cb(null);
            })
        },
        function (cb) {
            accountData = JSON.parse(accountData);
            var mapping = accountData.mapping;
            mapping.forEach(function (jiveFields) {

                console.log(jiveFields.jiveField);
                console.log(requiredJiveFields);
                var index = _.findIndex(requiredJiveFields,{"field":jiveFields.jiveField});
                console.log(index);
                if (index != -1) {
                    indexMatched.push(index);
                }

            });

            console.log("indexed length",indexMatched.length);
            console.log("index matched array",indexMatched);
            if (indexMatched.length >= requiredJiveFields.length) {
                cb(null);
            }
            else {
                res.send({"message": "Please map all the required fields", "status": 400});
            }

        },
        function (cb) {
            accountArray.push(accountData);

            accountProvisioningData.accountProvisioningData = accountArray;

            accountProvisioningData = JSON.stringify(accountProvisioningData);

            fs.writeFile(DIRNAME + '/metadata/accountProvisioningData.json', accountProvisioningData, function (err, data) {
                if (err) {
                    console.error('Unable to Update Account Provisioning Data', err);
                    res.send({
                        "message": "Some error occured",
                        "status": 400
                    })
                }
                else {
                    console.log('accountProvisioningData.json updated !!');
                    cb(null);
                }
            })
        }
    ], function (err, result) {
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