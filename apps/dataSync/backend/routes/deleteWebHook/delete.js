/**
 * Created by paras on 28/7/16.
 */


exports.route = function(req,res)
{
    console.log("here");
    var accessToken = jive1.access_token;

    var headers = {
        'Authorization': 'Bearer '+accessToken,
        'Content-Type': 'application/json'
    };

    var options = {
        url: 'https://grazitti-paras.jiveon.com/api/core/v3/webhooks/'+req.query.id,
        method: 'DELETE',
        headers: headers
    };

    function callback(error, response, body) {

        res.send({
            "body":body
        });
    }

    request(options, callback);

};