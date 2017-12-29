/**
 * Created by paras on 12/10/16.
 */

exports.route = function(req,res)
{
    var data = {
        "adminEmail":req.body.email,
        "adminPassword":req.body.password
    };

    data = JSON.stringify(data);

    fs.writeFile(DIRNAME + '/metadata/adminCredentials.json',data,function(err, data){
        if (err) {
            console.error('Unable to Update Admin Credentials', err);
            res.send(err);
        }
        else{
            console.log('adminCredentials.json updated !!');
            res.send({
                "status":200,
                "message":"Updated successfully!"
            });
        }
    })

};