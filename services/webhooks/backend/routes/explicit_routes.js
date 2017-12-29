var jive = require('jive-sdk');
var fs = require('fs');

var userSyncingFile = require('../../../../routes/userSyncingCrone');


exports.postWebhooks = {

    'path': '/webhooks',
    'verb': 'post',
    'route': function (req, res) {
        

        var jiveUrls = [];
        var users = [];
        var activityList = req.body;
        var userSyncingConditions;
        console.log("inside webhooks");
        console.log(JSON.stringify(activityList));
        if (activityList) {

            async.waterfall([
                function (cb) {
                    activityList.forEach(function (results) {
                        jiveUrls.push(results.activity.object.id);

                    });

                    jiveUrls = jiveUrls.filter(function (e, i, arr) {
                        return arr.lastIndexOf(e) === i;
                    });
                    console.log(jiveUrls);

                    cb(null);

                },
                function (cb) {
                    console.log(jiveUrls);
                    userSyncingFile.getUserSyncingDataFromFile(res, 0, function (err, result) {
                        if (err) {
                            res.send("some error occured");
                        }
                        else {
                            if (result.length) {
                                userSyncingConditions = result;
                                cb(null);
                            }
                            else {

                                console.log("no real time syncing file");
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({}));
                            }

                        }

                    })

                },
                function (cb) {
                    getJiveDataFromUrl(res, userSyncingConditions[0], jiveUrls, function (err, result) {
                        if (err) {
                            res.send("some error occured");
                        }
                        else {

                            users.push(result);
                            console.log("users....",users);
                            cb(null);
                        }

                    });

                },
                function (cb) {
                    userSyncingFile.updateContactsInSalesforce(res, users, function (err, result) {
                        cb(null);
                    });
                }
            ], function (err, result) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({}));
            });

        }
        else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({}));
            console.log("no webhooks currently")
        }
    }
};


function getJiveDataFromUrl(res, userSyncingConditions, jiveUrls, callback) {
    var headers = {
        'Authorization': 'Bearer ' + jive1.access_token,
        'Content-Type': 'application/json'
    };

    var results = [];
    var options = {
        url: jiveUrls[0],
        method: 'GET',
        headers: headers
    };

    console.log(options);
    request(options, function (err, response, data) {
        console.log(err);
        if (!err && response.statusCode == 200) {
            console.log(data);
            data = JSON.parse(data);
            results.push(data);
            if (results.length) {

                var k = 0;
                function getAnalyticsData(k) {

                    if (k < results.length) {
                        if(results[k].emails)
                        {
                            getAnalyticsValues(results[k].emails[0].value, results[k], function (cb) {
                                k++;
                                getAnalyticsData(k);
                            });
                        }
                        else{

                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({}));

                        }

                    }
                    else {
                        userSyncingConditions.data = results;
                        callback(null, userSyncingConditions);
                    }
                }

                getAnalyticsData(0);

            }
        }
        else {

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({}));
        }

    });

}


function getAnalyticsValues(userEmail, userData, callback) {

    var analyticsOptions = {
        url: 'https://api.jivesoftware.com/analytics/v1/auth/login?clientId=o6j8zgk1q6t07hlbjh3rtrphp8e7d8bi.i&clientSecret=g9p1adglh4h6yxmgx5eph6pbibmkzu21.s',
        method: 'POST'
    };

    request(analyticsOptions,function(err,response,body)
    {
        console.log(err);
        console.log(body);
        analyticsAuthorizationHeader = body;

    });

    var analyticsHeader = {'Authorization': analyticsAuthorizationHeader};
    console.log(analyticsHeader);

    
    async.parallel([
        function (cb) {

            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Create)&filter=user(' + userEmail + ')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions, function (err, response, data) {

                if(!err && response.statusCode == 200)
                {
                    data = JSON.parse(data);
                    userData.createdDocuments = data.paging.totalCount;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
                else{
                    userData.createdDocuments = 0;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }


            })

        },
        function (cb) {
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Comment)&filter=user(' + userEmail + ')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions, function (err, response, data) {
                if(!err && response.statusCode == 200) {

                    data = JSON.parse(data);
                    userData.commentsCount = data.paging.totalCount;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
                else{
                    userData.commentsCount = 0;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }

            })
        },
        function (cb) {
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Like)&filter=user(' + userEmail + ')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions, function (err, response, data) {
                if(!err && response.statusCode == 200) {
                    data = JSON.parse(data);
                    userData.likesCount = data.paging.totalCount;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
                else{
                    userData.likesCount = 0;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }

            });

        },
        function (cb) {
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Login)&filter=user(' + userEmail + ')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions, function (err, response, data) {

                if(!err && response.statusCode == 200) {
                    data = JSON.parse(data);
                    userData.loginCount = data.paging.totalCount;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
                else{
                    userData.loginCount = 0;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }

            });

        },
        function (cb) {
            var analyticsOptions = {
                url: 'https://api.jivesoftware.com/analytics/v2/export/activity?filter=action(Logout)&filter=user(' + userEmail + ')',
                method: 'GET',
                headers: analyticsHeader
            };

            request(analyticsOptions, function (err, response, data) {

                if(!err && response.statusCode == 200) {
                    data = JSON.parse(data);
                    userData.logoutCount = data.paging.totalCount;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
                else{
                    userData.logoutCount = 0;
                    userData.lastLoginDate = userData.updated;
                    cb();
                }
            });

        }
    ], function (err, result) {
        callback(null);

    })

}
