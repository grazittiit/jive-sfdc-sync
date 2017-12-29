
var jiveConnectFile = require("./../../../../../services/jiveConnect");

exports.route = function(req,res)
{
    console.log("REsponse");
    var JiveCredentials;

    fs.readFile(DIRNAME + '/metadata/jiveCredentials.json', 'utf8', function(unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/jiveCredentials.json doesnt exists');
            JiveCredentials = {};
        } else if (data) {

            JiveCredentials = JSON.parse(data);
        }
        if (!jiveCredentials.JiveCredentials) JiveCredentials.JiveCredentials = [];

        JiveCredentials.JiveCredentials.username = req.body.jiveEmailAddress;
        JiveCredentials.JiveCredentials.password = req.body.jivePassword;
        JiveCredentials.JiveCredentials.jiveLoginUrl = req.body.jiveLoginUrl;


        JiveCredentials = JSON.stringify(JiveCredentials);

        fs.writeFile(DIRNAME + '/metadata/jiveCredentials.json',JiveCredentials,function(err, data){
            if (err) {
                console.error('Unable to Update Jive Credentials', err);
                res.send({"status":400,"message":"Unable to Update Jive Credentials"});
            }
            else{
                console.log('jiveCredentails.json updated !!');
                jiveConnectFile.readJiveCredentialsFile();
               // res.send({"status":200,"message":"jiveCredentials.json updated !!"});
            }
        })
    });
}