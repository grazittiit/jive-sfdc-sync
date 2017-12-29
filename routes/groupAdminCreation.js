/**
 * Created by paras on 29/12/16.
 */

var https = require('https');
var http = require('http');

exports.CroneForOwnerCreation = function(req,res)
{
    var privateGroups = [];
    var OwnerMember= [];
    var flag = 0;
    console.log("Group Admin Creation");

    async.auto({

        getGroups:function(cb){
            var headers = {
                'Authorization': 'Bearer ' + jive1.access_token,
                'Content-Type': 'application/json'
            };

            var options = {
                url: jiveLoginUrl + '/api/core/v3/places?filter=type(group)',
                method: 'GET',
                headers: headers
            };

            request(options,function(err,response,data)
            {
                if(!err && response.statusCode == 200)
                {
                    data = JSON.parse(data);
                    if(data.list.length)
                    {
                        data.list.forEach(function(group)
                        {

                            if(group.groupType == "SECRET")
                            {
                                privateGroups.push(group.resources.members.ref);

                            }

                        });
                     cb(null);


                    }
                    else{
                        res.send("no groups");
                    }


                }
                else{
                    //cb(null);
                    res.end();
                }
                
                

            });


        },
        getMembers:['getGroups',function(cb){
            getMembersData(privateGroups,function(err,result){
                if (err) {

                    res.send("some error occured",err);
                }
                else {
                    if (result.length) {
                        OwnerMember = result;

                        cb(null);
                    }
                    else {
                        res.send("no result");
                    }

                }
            });

        }],
        updateOwner:['getMembers',function(cb){
            console.log("Update Owner",OwnerMember);
            if(OwnerMember.length){
                var headers = {
                    'Authorization': 'Bearer ' + jive1.access_token,
                    'Content-Type': 'application/json'
                };
                for(var k=0;k<OwnerMember.length;k++){

                    (function(k){

                        var memberPath = OwnerMember[k].memberPath;
                        var apiPath = OwnerMember[k].apiPath;
                        //console.log("OwnerMember[k].memberPath",memberPath,apiPath);
                        var dataString = {
                            "type" :"member" ,
                            "state" : "owner"
                        };
                        dataString = JSON.stringify(dataString)
                        var options2 = {
                            url: apiPath,
                            method: 'PUT',
                            body:dataString,
                            headers: headers
                        };

                        request(options2,function(err,response,body) {

                            if(!err && response.statusCode == 200){
                                console.log("Updated member");

                                cb(null);

                            }
                            else {
                                console.log("Can't Update member")
                                cb(null);
                               // res.send("Owner can't update");
                            }

                        });

                        if(k==OwnerMember.length-1){
                            cb(null)
                        }
                    })(k);

                }
            }
            else{
                res.send("no owner member");
            }
        }]

    },function(err,response)
    {
        if (err) {
            res.send("some error occured",err);
        }
        else {
            res.send("updated");
        }

    });

};


function getMembersData(privateGroups,callback) {
    var task =[];
    var OMember=[];

    if(privateGroups.length){
        var headers = {
            'Authorization': 'Bearer ' + jive1.access_token,
            'Content-Type': 'application/json'
        };
        for(var i=0;i<privateGroups.length;i++){
            task.push((function(i) {
                return function(cb1) {
                    var options1 = {
                        url: privateGroups[i],
                        method: 'GET',
                        headers: headers
                    };

                    request(options1, function (err, response, data) {
                        if (!err && response.statusCode == 200) {
                            //data = JSON.stringify(data);
                            data = JSON.parse(data);
                            if (data.list.length) {
                               // console.log("dataList Length--->", data.list.length)
                                var l = 0;
                                var m = 0;
                                for (var a = 0; a < data.list.length; a++) {
                                    // var members = data.list;
                                    var email = data.list[a].person.emails[0].value.split("@")[1];
                                    //console.log("Email", email)
                                    if (email != "carbonyellow.com" && data.list[a].state == "owner") {
                                        l++;
                                    }
                                    else {

                                        m = a;
                                       // console.log("m value", m)
                                    }

                                }
                                console.log("Condition for l", l);
                                if (l < 1) {
                                    OMember.push({
                                        "apiPath": data.list[m].resources.self.ref,
                                        "memberPath": data.list[m].person.resources.self.ref
                                    });
                                    cb1();
                                    //flag=1;
                                   // console.log("OMember in l condition", OMember);
                                }
                                else{
                                    cb1();
                                }

                            }
                        }
                        else {
                            console.log("Next End");
                            // cb(null);
                            //res.end();
                        }
                    });

                }

            })(i));




        }

        async.series(task, function(err, results) {
            if(err){
                callback(err,OMember);
                console.log("Error inseries",err);
            }
            else{
                //console.log("OMember",OMember)
                callback(0,OMember)
            }

        });

    }
    else{
       callback(0,OMember)
    }

}

