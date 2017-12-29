/**
 * Created by paras on 19/8/16.
 */


exports.route = function (req, res) {

    var finalData = [];

    var query = "select Id,Name from Account ";
    conn.query(query, function (err, result) {
        if (err) {
            res.send({"message": "Something went wrong", "status": 400, "data": []})
        }
        else {

            result.records.forEach(function(result)
            {
                finalData.push({
                    "id":result.Id,
                    "name":result.Name
                })

            });

            res.send({"message": "Data", "status": 200, "data": finalData});

        }

    })

};