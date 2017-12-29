exports.route = function (req, res) {
    console.log("api hit");

    var salesforceContactFields = [];
    var jiveUserFields = [];
    var JiveCredentials ;

    async.parallel([

        function (cb) {
            conn.sobject("Contact").describe(function (err, meta) {
                if(err){

                }
                else{
                    meta.fields.forEach(function (fields) {
                        salesforceContactFields.push(fields.name);

                    });
                }

                cb(null);

            });
        },
        function (cb) {

            fs.readFile(DIRNAME + '/metadata/jiveFields.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/userSyncingData.json doesnt exists');
                    res.send("some problem in userSyncingData.json file");
                } else if (data) {

                    if (jiveLoginUrl != "") {

                    data = JSON.parse(data);
                    jiveUserFields = data.userFields;
                    var headers = {
                        'Authorization': 'Bearer ' + jive1.access_token,
                        'Content-Type': 'application/json'
                    };

                    var options = {
                        url: jiveLoginUrl + '/api/core/v3/admin/profileFields',
                        method: 'GET',
                        headers: headers
                    };

                    request(options, function (err, response, data) {

                        console.log(err);
                        if (!err || response.statusCode == 200) {
                            data = JSON.parse(data);

                            data.list.forEach(function (response) {
                                jiveUserFields.push(response.name);

                            });
                        }
                        else {

                        }
                        jiveUserFields = jiveUserFields.filter(onlyUnique);


                        cb(null);
                    })
                }
                else{
                    cb(null);
                    }
                }
            })


        },
        function (cb) {
            fs.readFile(DIRNAME + '/metadata/jiveCredentials.json', 'utf8', function (unableToOpen, data) {
                if (unableToOpen) {
                    console.log('metadata/jiveCredentials.json doesnt exists');
                    res.send("some problem in jiveCredentials.json file");
                } else if (data) {
                    
                    data = JSON.parse(data);
                    JiveCredentials = data.JiveCredentials;
                    cb(null);
                }
            })
        },
        // function(cb){
        //     var query = "select Id,Name from Account ";
        //     conn.query(query, function (err, result) {
        //
        //         if(!err){
        //             result.records.forEach(function(result)
        //             {
        //                 existingAccountNames.push({
        //                     "id":result.Id,
        //                     "name":result.Name
        //                 })
        //
        //             });
        //         }
        //
        //         cb(null);
        //
        //     })
        // },
        // function(cb){
        //     fs.readFile(DIRNAME + '/metadata/accountFields.json', 'utf8', function (unableToOpen, data) {
        //         if (unableToOpen) {
        //             console.log('metadata/accountFields.json doesnt exists');
        //             res.send("some problem in accountFields.json file");
        //         } else if (data) {
        //
        //             data = JSON.parse(data);
        //             accountNameMappingFields = data.accountFields;
        //             cb(null);
        //         }
        //     })
        // }
    ], function (err, result) {


        if(admin.admin != undefined){

            var salesforceCredentials = admin.admin.oauth2;

        }
        else{
            admin = JSON.parse(admin);
            var salesforceCredentials = admin.admin.oauth2;

        }

        res.send({
            "salesforceContactFields":salesforceContactFields,
            "jiveUserFields":jiveUserFields,
            // "existingAccountNames":existingAccountNames,
            // "accountNameMappingFields":accountNameMappingFields,
            "loginUrl":salesforceCredentials.loginUrl,
            "clientId":salesforceCredentials.clientId,
            "clientSecret":salesforceCredentials.clientSecret,
            "username": JiveCredentials.username,
            "password":JiveCredentials.password,
            "jiveLoginUrl":JiveCredentials.jiveLoginUrl
        })

    });


};


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}