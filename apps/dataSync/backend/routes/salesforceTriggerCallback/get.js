
/**
 * Created by paras on 3/8/16.
 */



exports.route = function(req,res)
{
    console.log("here");
    console.log("trigger callback received");

    var results = [];

    var accountsData = [];

    if (accountsData.length != 0) {

        for (var i = 0; i < accountsData.records.length; i++) {
            (function (i) {
                results.push({
                    "id": accountsData.records[i].Id,
                    "name": accountsData.records[i].Name,
                    "description": accountsData.records[i].Description
                });

                if (i == accountsData.records.length - 1) {
                    createOrUpdateJiveSpace(res, results, 0);
                }

            }(i));
        }
    }
    else{
        res.send("no accounts");
    }
};


