/**
 * Created by paras on 17/8/16.
 */


exports.route = function (req, res) {

    var userSyncingData = {};

    fs.readFile(DIRNAME + '/metadata/userSyncingData.json', 'utf8', function (unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/userSyncingData.json doesnt exists');
            userSyncingData = {};
        } else if (data) {

            data = JSON.parse(data);
            res.send({"userData":data.userSyncingData});

        }
    })

};