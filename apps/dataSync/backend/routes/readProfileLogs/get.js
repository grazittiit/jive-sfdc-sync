/**
 * Created by paras on 22/8/16.
 */

exports.route = function(req,res)
{
    var savedLogs = [];

    fs.readFile(DIRNAME + '/metadata/profileLogs.json', 'utf8', function (unableToOpen, data) {

        savedLogs = JSON.parse(data);
        savedLogs = savedLogs.profileLogs;
        res.send({"message":"profile logs","data":savedLogs,"status":200});

    });
};