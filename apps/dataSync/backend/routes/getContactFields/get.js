

exports.route = function(req,res)
{
    var contactFields;
    fs.readFile(DIRNAME + '/metadata/jiveFields.json', 'utf8', function(unableToOpen, data) {
        if (unableToOpen) {
            console.log('metadata/jiveFields.json doesnt exists');
        } else if (data) {

            contactFields = JSON.parse(data);
            res.send({"fields":contactFields.fields});
        }
    });
};