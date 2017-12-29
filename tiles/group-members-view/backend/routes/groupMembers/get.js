/**
 * Created by paras on 8/2/17.
 */

var request = require('request');
var fs = require('fs');
var aes256 = require('nodejs-aes256');
var jive = require("jive-sdk");
encryptionPass = 'Vvvbmh';

exports.route = function (req,res) {

    var placeId = req.query.placeId;
    console.log(placeId);
    var members = [];

    fs.readFile(DIRNAME + '/metadata/adminCredentials.json', 'utf8',function (unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/adminCredentials.json doesnt exists');
            res.send("some problem in adminCredentials.json file");
        }
        else{
            data = JSON.parse(aes256.decrypt(encryptionPass,data));

            var headers = {
                'Authorization': 'Bearer ' + data.jiveCredentials.accessToken,
                'Content-Type': 'application/json'
            };

            var options = {
                url: jivebaseUrl + '/api/core/v3/members/places/' + placeId,
                method: 'GET',
                headers: headers
            };


            request(options, function (err, response, data) {
                var data2 = data.replace("throw 'allowIllegalResourceCall is false.';", "");
                data2 = JSON.parse(data2);
                console.log(data2);

                if (!err && response.statusCode == 200) {
                    data2.list.forEach(function (member){

                        if(member.state == "owner" || member.state == "member")
                        {
                            members.push({
                                "username":member.person.jive.username,
                                "displayName":member.person.displayName,
                                "email":member.person.emails[0].value,
                                "state": member.state
                            })
                        }


                    });

                    res.send({
                        "members":members,
                        "status":200
                    })

                }
                else {
                    res.send(err);
                }

            })
        }
    })

};