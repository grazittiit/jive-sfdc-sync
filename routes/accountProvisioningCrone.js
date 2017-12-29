/**
 * Created by paras on 29/7/16.
 */

/*
 Cron Job for Syncing the Accounts of Salesforce
 with Space in Jive on daily basis
 depending on the conditions saved in accountProvisioningData.json
 */
exports.croneForDailyAccountUpdates = function (req, res) {


     accountLogs = [];

    var savedLogs = [];

    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 1);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var results = [];

    var accountProvisioningConditions;
    var accounts = [];

    async.auto({
        getAccountProvisioningData: function (cb) {
            getAccountProvisioningDataFromFile(res, 1, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        accountProvisioningConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for daily update");
                    }

                }

            });
        },
        getSalesforceData: ['getAccountProvisioningData', function (cb) {
            getSalesforceAccounts(res, accountProvisioningConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {

                    accounts.push(result);
                    cb(null);
                }

            })
        }],
        updateJiveInSpace: ['getSalesforceData', function (cb) {
            updateJiveSpace(res, accounts, function (err, result) {
                cb(null);

            });

        }],
        saveAccountLogs:['updateJiveInSpace',function(cb)
        {
           // console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/accountLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.accountLogs;
                var finalLogs = savedLogs.concat(accountLogs);
                var x = {};
                x.accountLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/accountLogs.json',x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('account logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });

};


/*
 Crone Job for Syncing the Accounts of Salesforce
 with Space in Jive on weekly basis
 depending on the conditions saved in accountProvisioningData.json
 */
exports.croneForWeeklyAccountUpdates = function (req, res) {

    accountLogs =[];
    var utcMoment = moment.utc();
    var utcDate = new Date(utcMoment.format());
    var previousDate = new Date(utcMoment.format());

    previousDate.setDate(utcDate.getDate() - 6);

    utcDate = utcDate.toISOString();
    previousDate = previousDate.toISOString();

    var results = [];

    var accountProvisioningConditions;
    var accounts = [];

    async.auto({
        getAccountProvisioningData: function (cb) {
            getAccountProvisioningDataFromFile(res, 2, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {
                    if (result.length) {
                        accountProvisioningConditions = result;
                        cb(null);
                    }
                    else {
                        res.send("no conditions for weekly update");
                    }

                }

            });
        },
        getSalesforceData: ['getAccountProvisioningData', function (cb) {
            getSalesforceAccounts(res, accountProvisioningConditions[0], utcDate, previousDate, function (err, result) {
                if (err) {
                    res.send("some error occured");
                }
                else {

                    accounts.push(result);
                    cb(null);
                }

            })
        }],
        updateJiveInSpace: ['getSalesforceData', function (cb) {
            updateJiveSpace(res, accounts, function (err, result) {
                cb(null);

            });

        }],
        saveAccountLogs:['updateJiveInSpace',function(cb)
        {
            //console.log("logs",accountLogs);
            fs.readFile(DIRNAME + '/metadata/accountLogs.json', 'utf8', function (unableToOpen, data) {

                savedLogs = JSON.parse(data);
                savedLogs = savedLogs.accountLogs;
                var finalLogs = savedLogs.concat(accountLogs);
                var x = {};
                x.accountLogs = finalLogs;
                x = JSON.stringify(x);
                fs.writeFile(DIRNAME + '/metadata/accountLogs.json',x, function (err, data) {
                    if (err) {
                        console.error('Unable to Update Account Logs Data', err);
                        res.send({
                            "message": "Some error occured due to non updation of account logs",
                            "status": 400
                        })
                    }
                    else {
                        console.log('account logs.json updated !!');
                        cb(null);
                    }
                })

            });
        }]


    }, function (err, result) {
        if (err) {
            res.send("some error occured");
        }
        else {
            res.send("updated");
        }

    });
};


/*
 Gives the list of salesforce accounts based on the conditions set in accountProvisioningData.json file
 INPUT: account syncing conditions, startdate , end data
 OUTPUT : Array of Salesforce Accounts based on conditions and date range
 */
function getSalesforceAccounts(res, accountProvisioningConditions, utcDate, previousDate, callback) {
    var results = [];

    var query = "";
    var dynamicQuery = "";
    var conditions = accountProvisioningConditions.condition;
    var mapping = accountProvisioningConditions.mapping;
    var mappedFields = "";

    if (conditions.length) {

        if (accountProvisioningConditions.filterLogic != "") {

            for(var k = 0 ; k < conditions.length ; k++)
            {
                var x = k+1;
                var y = " " + conditions[k].field + " " + conditions[k].operator + " '" + conditions[k].value + "' ";
                dynamicQuery = accountProvisioningConditions.filterLogic.replace(x,y);
                accountProvisioningConditions.filterLogic = dynamicQuery;
            }

        }
        else{

            query = " " +conditions[0].field + " " + conditions[0].operator + " '" + conditions[0].value + "' ";

        }

        console.log(dynamicQuery);
        query = query + dynamicQuery;


        // for (var i = 0; i < conditions.length; i++) {
        //     if (accountProvisioningConditions.filterLogic != "") {
        //
        //
        //
        //
        //         if (i != conditions.length - 1) {
        //             query = query + conditions[i].field + " " + conditions[i].operator + " '" + conditions[i].value + "' " + filterLogic[i] + " ";
        //         }
        //         else {
        //             query = query + conditions[i].field + " " + conditions[i].operator + " '" + conditions[i].value + "'";
        //
        //         }
        //     }
        //     else {
        //         query = query + conditions[i].field + " " + conditions[i].operator + " '" + conditions[i].value + "'";
        //
        //     }
        //
        // }

    }

    mapping.forEach(function (result) {
        if (mappedFields.indexOf(result.salesforceField) == -1) {
            if (result.salesforceField != "Id") {
                mappedFields = mappedFields + result.salesforceField + " ,";
            }

        }


    });
    mappedFields = mappedFields.substring(0, mappedFields.length - 1);


    if (query != "") {
        var accountQuery = "select Id," + mappedFields + " from Account where LastModifiedDate <= " + utcDate;
        accountQuery += " and LastModifiedDate >= " + previousDate + " and  ( " + query + " )" ;

    }
    else {
        var accountQuery = "select Id," + mappedFields + " from Account where LastModifiedDate <= " + utcDate;
        accountQuery += " and LastModifiedDate >= " + previousDate;

    }
    conn.query(accountQuery, function (err, result) {
        if (err) {
            console.log("error", err);
            res.send("some error occured");
        }
        else {

            if (result.totalSize != 0) {

                console.log(result.records);
                accountProvisioningConditions.data = result.records;
                callback(null, accountProvisioningConditions);

            }
            else {
                res.send("no accounts matching");
            }
        }

    });

}


/*
 Gets the data from accountProvisioningData.json file based on the frequency(real time, daily or weekly )
 INPUT: Frequency(0: real time , 1: daily , 2: weekly )
 OUTPUT : File Json
 */
function getAccountProvisioningDataFromFile(res, frequency, callback) {
    var accountProvisioningData;
    fs.readFile(DIRNAME + '/metadata/accountProvisioningData.json', 'utf8', function (unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/accountProvisioningData.json doesnt exists');
            res.send("some problem in accountProvisioningData.json file");
        } else if (data) {

            data = JSON.parse(data);
            accountProvisioningData = data.accountProvisioningData;
            if (!accountProvisioningData.length) {
                res.send("no updations to be made");
            }
            else {
                accountProvisioningData = lodash.filter(accountProvisioningData, {frequency: frequency.toString()});
                callback(null, accountProvisioningData);
            }
        }
    });

}


function updateJiveSpace(res, filteredAccountProvisioningData, callback) {

    // var x = JSON.parse(jive1);
    console.log(jive1.access_token);
    headers = {
        'Authorization': 'Bearer ' + jive1.access_token,
        'Content-Type': 'application/json'
    };

    var i = 0;

    var accountsLength = filteredAccountProvisioningData.length;


    function getDataFunction(i) {

        if (i < accountsLength) {
            getDataOfAccount(res, filteredAccountProvisioningData[i], function (cb) {
                i++;
                getDataFunction(i);
            });
        }
        else {
            callback(null);
        }
    }

    getDataFunction(0);

}


function getDataOfAccount(res, filteredAccountProvisioningData, callback) {
    var j = 0;

    function getData(j) {
        if (j < filteredAccountProvisioningData.data.length) {
            checkForSpaceInJive(res, filteredAccountProvisioningData, filteredAccountProvisioningData.data[j], function (cb) {
                j++;
                getData(j);
            });

        }
        else {
            callback(null);

        }
    }

    getData(0);
}


/*
 Checks for Space in Jive for account id in salesforce
 INPUT: Salesforce account data
 OUTPUT : Space to be inserted or updated
 */
function checkForSpaceInJive(res, accountData, accountValues, callback) {
    console.log(accountValues.id);

    var options = {
        url: jiveLoginUrl + '/api/core/v3/places?filter=type(' + accountData.placeType + ')&filter=search("' + accountValues.Id + '")',
        method: 'GET',
        headers: headers
    };
    console.log(options.url);

    request(options, function (err, response, data) {
        data = JSON.parse(data);
        console.log(data);
        if (data.list.length == 0) {
            console.log("insertion to be done");
            insertSpaceInJive(res, accountData, accountValues, callback);
        }
        else {
            console.log("updation to be done");
            updateSpaceInJive(res, accountData, accountValues, data.list[0].placeID, callback);

        }

    })

}


/*
 Inserts space in jive
 INPUT: salesforce account data
 OUTPUT : Insertion of space
 */

function insertSpaceInJive(res, accountData, accountValues, callback) {
    var insertionOptions = {
        url: jiveLoginUrl + '/api/core/v3/places',
        method: 'POST',
        headers: headers,
        body: {
            "displayName": accountValues.Id,
            "type": accountData.placeType,
            "Description": accountData.Description
        }
    };

    if (accountData.placeType == "group") {
        insertionOptions.body.groupType = "OPEN";
    }
    else if (accountData.placeType == "project") {

        accountData.startDate = new Date(accountData.startDate);

        accountData.startDate = accountData.startDate.toISOString();


        accountData.dueDate = new Date(accountData.dueDate);

        accountData.dueDate = accountData.dueDate.toISOString();


        insertionOptions.body.parent = accountData.parent;
        insertionOptions.body.startDate = accountData.startDate;
        insertionOptions.body.dueDate = accountData.dueDate;
    }

    accountData.mapping.forEach(function (result) {
        insertionOptions.body[result.jiveField] = accountValues[result.salesforceField];
    });

    insertionOptions.body = JSON.stringify(insertionOptions.body);
    console.log(insertionOptions);

    request(insertionOptions, function (err, response, body) {

        console.log(err);
        console.log(response);
        console.log(body);
        if (!err && response.statusCode == 200) {

            console.log("success");
            body = JSON.parse(body);
            accountLogs.push({
                "message":"Place Inserted in jive ",
                "placeId": body.placeId,
                "accountId":accountValues.Id,
                "status" : "Success",
                "timestamp": new Date()
            });
            updateNavigationSettingsOfSpace(res, accountData, body.placeID, callback);
        }
        else {

          body = JSON.parse(body);
            if( body.error != undefined ){
                console.log("body",body)
                accountLogs.push({
                    "message": body,
                    "placeId": 0,
                    "accountId":accountValues.Id,
                    "status" : "Insertion Failure",
                    "timestamp": new Date()
                });
            }
            else {
                console.log("body",body)
                body = JSON.stringify(body);
                console.log(response);
                accountLogs.push({
                    "message": body,
                    "placeId": 0,
                    "accountId":accountValues.Id,
                    "status" : "Insertion Failure",
                    "timestamp": new Date()
                });
            }

            callback(null);
            // res.send({"error":error,"response":response})
        }

    });

}


/*
 Updates space in jive based on the salesforce account id
 INPUT: salesforce account data
 OUTPUT : Updation of Jive Space
 */
function updateSpaceInJive(res, accountData, accountValues, spaceId, callback) {

    var updatedOptions = {
        url: jiveLoginUrl + '/api/core/v3/places/' + spaceId + '',
        method: 'PUT',
        headers: headers,
        body: {
            "Description": accountData.Description
        }
    };
    console.log(updatedOptions.url);
    if (accountData.placeType == "group") {
        updatedOptions.body.groupType = "OPEN";
    }
    else if (accountData.placeType == "project") {


        accountData.startDate = new Date(accountData.startDate);

        accountData.startDate = accountData.startDate.toISOString();


        accountData.dueDate = new Date(accountData.dueDate);

        accountData.dueDate = accountData.dueDate.toISOString();

        insertionOptions.body.parent = accountData.parent;
        insertionOptions.body.startDate = accountData.startDate;
        insertionOptions.body.dueDate = accountData.dueDate;
    }
    accountData.mapping.forEach(function (result) {
        updatedOptions.body[result.jiveField] = accountValues[result.salesforceField];

    });

    updatedOptions.body = JSON.stringify(updatedOptions.body);
    console.log("updated options", updatedOptions);
    request(updatedOptions, function (error, response, data) {
        console.log(error);
        console.log(data);

        console.log(error);
        console.log(data);
        if (!error && response.statusCode == 200) {
            data = JSON.parse(data);
            accountLogs.push({
                "message":"Place Updated in jive ",
                "placeId": spaceId,
                "accountId":accountValues.Id,
                "status" : "Success",
                "timestamp": new Date()
            });
            updateNavigationSettingsOfSpace(res, accountData, data.placeID, callback);

        }
        else{

            accountLogs.push({
                "message":  data,
                "placeId": 0,
                "accountId":accountValues.Id,
                "status" : "Updation Failure",
                "timestamp": new Date()
            });
            callback(null);
        }



    });


}


/*
 Updates navigation setting in jive based on the conditions choosen(activity +overview , activity or overview )
 INPUT: salesforce account data, spae id
 OUTPUT : Updation of jive space
 */
function updateNavigationSettingsOfSpace(res, accountData, spaceId, callback) {
    var activityTab = '';
    var overviewTab = '';
    var defaultTab = '';

    if (accountData.navigation == 0) {
        activityTab = true;
        overviewTab = false;
        defaultTab = 'activityTab';
    }
    else if (accountData.navigation == 1) {
        activityTab = false;
        overviewTab = true;
        defaultTab = 'overviewTab';
    }
    else if (accountData.navigation == 2) {
        activityTab = true;
        overviewTab = true;
        defaultTab = 'activityTab';
    }
    var updatedSettingsOptions = {
        url: jiveLoginUrl + '/api/core/v3/places/' + spaceId + '/settings',
        method: 'PUT',
        headers: headers,
        body: {
            'activityTab': activityTab,
            'overviewTab': overviewTab,
            'defaultTab': defaultTab
        }
    };
    updatedSettingsOptions.body = JSON.stringify(updatedSettingsOptions.body);
    request(updatedSettingsOptions, function (error, response, data) {
        console.log(error);
        console.log(data);
        callback(null);

    });

}