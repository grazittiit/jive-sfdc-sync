/**
 * Created by paras on 17/8/16.
 */


var _ = require("lodash");


exports.route = function (req, res) {

    var accountProvisioningData = {};

    fs.readFile(DIRNAME + '/metadata/accountProvisioningData.json', 'utf8', function (unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/accountProvisioningData.json doesnt exists');
            accountProvisioningData = {};
        } else if (data) {

            data = JSON.parse(data);
            res.send({"accountData":data.accountProvisioningData});
        }
    })
};