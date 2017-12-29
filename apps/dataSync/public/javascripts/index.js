var staticRedirectUrl = "http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/dataSync/sfOauth";
var baseUrl = "http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com";
var jiveBaseUrl = "http://grazitti-sfdc-grazitti-sfdc-sync.b9ad.pro-us-east-1.openshiftapps.com/dataSync";
var accountConditionFlag = 0;
var accountMappingFlag = 0;
var userMappingFlag = 0;
var userConditionFlag = 0;


$(document).ready(function () {


    $('.nav-tabs a').on('shown.bs.tab', function () {


        //gadgets.window.adjustHeight();
      //  console.log('The new tab is now fully shown.');
    });


    var salesforceContactFields = [];
    var jiveUserFields = [];
    var existingAccountNames = [];
    var accountNameMappingFields = [];

    osapi.http.get({
        href: jiveBaseUrl + "/getAccountFields",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        }
    }).execute(function (res) {


        salesforceContactFields = res.content.salesforceContactFields;
        console.log("Salesforce  contact fields",salesforceContactFields);
        jiveUserFields = res.content.jiveUserFields;
        existingAccountNames = res.content.existingAccountNames;
        accountNameMappingFields = res.content.accountNameMappingFields;


       // salesforce credentials
        document.getElementById('loginUrl').value = res.content.loginUrl;
        document.getElementById('salesforceClientId').value = res.content.clientId;
        document.getElementById('salesforceClientSecret').value = res.content.clientSecret;


        //jive Credentials
        document.getElementById('jiveLoginUrl').value = res.content.jiveLoginUrl;
        document.getElementById('jiveEmailAddress').value = res.content.username;
        document.getElementById('jivePassword').value = res.content.password;




        // var select5 = document.getElementById('p-r1c1'),
        //     select6 = document.getElementById('p-r2c1'),
           var select7 = document.getElementById('pm-r4c1');


        var select8 = document.getElementById('pm-r1c1'),
            select9 = document.getElementById('pm-r2c1'),
            select10 = document.getElementById('pm-r3c1');

        var newOption9 = document.createElement('option');
        newOption9.value = "FirstName";
        newOption9.text = "FirstName";
        select8.add(newOption9);


        var newOption10 = document.createElement('option');
        newOption10.value = "LastName";
        newOption10.text = "LastName";
        select9.add(newOption10);


        var newOption11 = document.createElement('option');
        newOption11.value = "Email";
        newOption11.text = "Email";
        select10.add(newOption11);



        var jiveSelect3 = document.getElementById('pm-r1c2'),
            jiveSelect4 = document.getElementById('pm-r2c2'),
            jiveSelect5 = document.getElementById('pm-r3c2'),
            jiveSelect6 = document.getElementById('pm-r4c2');

        var newOption12 = document.createElement('option');
        newOption12.value = "givenName";
        newOption12.text = "givenName";
        jiveSelect3.add(newOption12);


        var newOption13 = document.createElement('option');
        newOption13.value = "familyName";
        newOption13.text = "familyName";
        jiveSelect4.add(newOption13);


        var newOption14 = document.createElement('option');
        newOption14.value = "Email";
        newOption14.text = "Email";
        jiveSelect5.add(newOption14);


       // var newAccount = document.getElementById('new-account');


        for (var k = 0; k < salesforceContactFields.length; k++) {
            // var newOption6 = document.createElement('option');
            // var newOption7 = document.createElement('option');
            var newOption8 = document.createElement('option');

            // newOption6.value = salesforceContactFields[k];
            // newOption6.text = salesforceContactFields[k];
            //
            // newOption7.value = salesforceContactFields[k];
            // newOption7.text = salesforceContactFields[k];


            newOption8.value = salesforceContactFields[k];
            newOption8.text = salesforceContactFields[k];

            // select5.add(newOption6);
            // select6.add(newOption7);
            select7.add(newOption8);


        }


        for (var l = 0; l < jiveUserFields.length; l++) {
            var newOption15 = document.createElement('option');


            newOption15.value = jiveUserFields[l];
            newOption15.text = jiveUserFields[l];





            jiveSelect6.add(newOption15);


        }

     //   var existingAccount = document.getElementById('existing-account');

        // for (var m = 0; m < existingAccountNames.length; m++) {
        //     var newOption16 = document.createElement('option');
        //
        //
        //     newOption16.value = existingAccountNames[m].id;
        //     newOption16.text = existingAccountNames[m].name;
        //
        //     existingAccount.add(newOption16);
        // }

        // for(var h = 0 ; h < accountNameMappingFields.length ;h++)
        // {
        //     var newOption17 = document.createElement('option');
        //     newOption17.value = accountNameMappingFields[h];
        //     newOption17.text = accountNameMappingFields[h];
        //     newAccount.add(newOption17);
        //
        // }


        showPage();

    });


});


function adjust()
{
    gadgets.window.adjustHeight();
}


function showPage() {

    document.getElementById("loader").style.display = "none";
    document.getElementById("mainPage").style.display = "block";

    gadgets.window.adjustHeight();
}


function showReportPage() {
    document.getElementById("loader1").style.display = "none";
    document.getElementById("reportPage").style.display = "block";

    gadgets.window.adjustHeight();

}


saveSalesForceAuthentication = function () {

    var loginUrl = document.getElementById('loginUrl').value;
    var salesforceClientId = document.getElementById('salesforceClientId').value;
    var salesforceClientSecret = document.getElementById('salesforceClientSecret').value;
    if (loginUrl == "") {

        document.getElementById('loginUrl').style.borderColor = "Red";
        document.getElementById('loginUrl').style.borderWidth = "Thin";

        return false;

    }
    else if (salesforceClientId == "") {
        document.getElementById('salesforceClientId').style.borderColor = "Red";
        document.getElementById('salesforceClientId').style.borderWidth = "Thin";

        return false;
    }
    else if (salesforceClientSecret == "") {
        document.getElementById('salesforceClientSecret').style.borderColor = "Red";
        document.getElementById('salesforceClientSecret').style.borderWidth = "Thin";

        return false;
    }

    if (loginUrl != "" && salesforceClientId != "" && salesforceClientSecret != "") {
        var redirectUrl = staticRedirectUrl;
        osapi.http.post({
            href: jiveBaseUrl + "/updateAdmin",
            'refreshInterval': 0,
            format: 'json',
            'authz': 'signed',
            'headers': {
                'Content-Type': ['application/json']
            },
            body: {
                "loginUrl": loginUrl,
                "salesforceClientId": salesforceClientId,
                "salesforceClientSecret": salesforceClientSecret,
                "redirectUrl": redirectUrl
            }
        }).execute(function (res) {
           // console.log('res', res);
          //  updateFields();
           // oAuthWindow();
        });
    }


};


oAuthWindow = function () {

    console.log("inside oauth fnction");
    var loginUrl = document.getElementById('loginUrl').value;
    var salesforceClientId = document.getElementById('salesforceClientId').value;
    var salesforceClientSecret = document.getElementById('salesforceClientSecret').value;

    var newWindow = window.open(loginUrl + '/services/oauth2/authorize?response_type=code&client_id=' + salesforceClientId + '&redirect_uri=' + staticRedirectUrl + '&email=' + '&state=', 'name', 'height=400,width=400');

  //  setTimeout(afterCloseChild,500);

    // function afterCloseChild()
    // {
    //     console.log("function called")
    //     if(newWindow.closed)
    //     {
    //         console.log("inside");
    //         updateFields();
    //     }
    //     else{
    //         setTimeout(afterCloseChild,500);
    //     }
    //
    // }


    // (function afterCloseChild() {
    //
    //     if (newWindow.closed) {
    //         console.log('closed');
    //         updateFields();
    //     } else {
    //         setTimeout(afterCloseChild, 500);
    //     }
    // })();

};



saveUserData = function () {
    var conditionsArray = [];
    var mappingArray = [];

    // var tBodyChildrenLength = document.getElementById('ProfileSync').tBodies[0].children.length;
    //
    // var tBodyChildren = document.getElementById('ProfileSync').tBodies[0].children;
    //
    //
    // for (var i = 0; i < tBodyChildrenLength; i++) {
    //     var trChild = tBodyChildren[i].children;
    //
    //     if (trChild[1].children[0].options[trChild[1].children[0].selectedIndex].value != "") {
    //         if (trChild[2].children[0].options[trChild[2].children[0].selectedIndex].value != "") {
    //             conditionsArray.push({
    //                 "field": trChild[1].children[0].options[trChild[1].children[0].selectedIndex].value,
    //                 "operator": trChild[2].children[0].options[trChild[2].children[0].selectedIndex].value,
    //                 "value": trChild[3].children[0].value
    //             })
    //         }
    //         else {
    //
    //
    //             trChild[2].children[0].style.borderColor = "Red";
    //             trChild[2].children[0].style.borderWidth = "Thin";
    //             conditionsArray = [];
    //
    //             return false;
    //
    //         }
    //     }
    //
    // }
    //
    // var filter = document.getElementById('AddFilterLogic1').value;
    //
    // if (filter == "" && conditionsArray.length > 1) {
    //     document.getElementById('AddFilterLogic1').style.borderColor = "Red";
    //     document.getElementById('AddFilterLogic1').style.borderWidth = "Thin";
    //
    //     return false;
    //
    // }
    //
    //
    var mapping = document.getElementById('userMapping');
    var tBodyMappingChildren = mapping.tBodies[0].children;


    for (var k = 0; k < 3; k++) {
        if (tBodyMappingChildren[k].children[1].children[0].options[tBodyMappingChildren[k].children[1].children[0].selectedIndex].value != "") {
            if (tBodyMappingChildren[k].children[2].children[0].options[tBodyMappingChildren[k].children[2].children[0].selectedIndex].value != "") {
                if (tBodyMappingChildren[k].children[3].children[0].options[tBodyMappingChildren[k].children[3].children[0].selectedIndex].value != "") {
                    mappingArray.push({
                        "salesforceField": tBodyMappingChildren[k].children[1].children[0].options[tBodyMappingChildren[k].children[1].children[0].selectedIndex].value,
                        "jiveField": tBodyMappingChildren[k].children[2].children[0].options[tBodyMappingChildren[k].children[2].children[0].selectedIndex].value,
                        "mappingType": tBodyMappingChildren[k].children[3].children[0].options[tBodyMappingChildren[k].children[3].children[0].selectedIndex].value
                    })
                }
                else {
                    tBodyMappingChildren[k].children[3].children[0].style.borderColor = "Red";
                    tBodyMappingChildren[k].children[3].children[0].style.borderWidth = "Thin";

                    mappingArray = [];

                    return false;

                }
            }
            else {
                tBodyMappingChildren[k].children[2].children[0].style.borderColor = "Red";
                tBodyMappingChildren[k].children[2].children[0].style.borderWidth = "Thin";

                mappingArray = [];

                return false;


            }
        }
        else {
            tBodyMappingChildren[k].children[1].children[0].style.borderColor = "Red";
            tBodyMappingChildren[k].children[1].children[0].style.borderWidth = "Thin";

            mappingArray = [];

            return false;
        }


    }

    for (var j = 3; j < tBodyMappingChildren.length; j++) {
        if (tBodyMappingChildren[j].children[1].children[0].options[tBodyMappingChildren[j].children[1].children[0].selectedIndex].value != "") {
            if (tBodyMappingChildren[j].children[2].children[0].options[tBodyMappingChildren[j].children[2].children[0].selectedIndex].value != "") {
                if (tBodyMappingChildren[j].children[3].children[0].options[tBodyMappingChildren[j].children[3].children[0].selectedIndex].value != "") {
                    mappingArray.push({
                        "salesforceField": tBodyMappingChildren[j].children[1].children[0].options[tBodyMappingChildren[j].children[1].children[0].selectedIndex].value,
                        "jiveField": tBodyMappingChildren[j].children[2].children[0].options[tBodyMappingChildren[j].children[2].children[0].selectedIndex].value,
                        "mappingType": tBodyMappingChildren[j].children[3].children[0].options[tBodyMappingChildren[j].children[3].children[0].selectedIndex].value
                    })
                }
                else {
                    tBodyMappingChildren[j].children[3].children[0].style.borderColor = "Red";
                    tBodyMappingChildren[j].children[3].children[0].style.borderWidth = "Thin";

                    mappingArray = [];

                    return false;

                }
            }
            else {
                tBodyMappingChildren[j].children[2].children[0].style.borderColor = "Red";
                tBodyMappingChildren[j].children[2].children[0].style.borderWidth = "Thin";

                mappingArray = [];

                return false;
            }
        }

    }


    var frequency = getRadioVal(document.getElementById('userFrequency'), 'activity');


    // var existingAccountName = document.getElementById('existing-account').options[document.getElementById('existing-account').selectedIndex].value;
    // var newAccountName = document.getElementById('new-account').options[document.getElementById('new-account').selectedIndex].value;
    //
    //
    // if (existingAccountName == "" && newAccountName == "") {
    //     document.getElementById('existing-account').style.borderColor = "Red";
    //     document.getElementById('existing-account').style.borderWidth = "Thin";
    //
    //     return false;
    // }
    //
    // else if (existingAccountName != "" && newAccountName == "") {
    //     accountNameMapping = {
    //         "account": existingAccountName,
    //         "userFieldMapping": false
    //     }
    //
    // }
    // else if (newAccountName != "" && existingAccountName == "") {
    //     accountNameMapping = {
    //         "account": newAccountName,
    //         "userFieldMapping": true
    //     }
    // }
    // else if (newAccountName != "" && existingAccountName != "") {
    //     var div2 = document.getElementById('success1');
    //     div2.style.color = "Red";
    //     div2.innerHTML = "Please Choose either between Existing Account or User Field Mapping For Account Name";
    //     div2.style.display = "block";
    //     removeDiv(div2);
    //
    //
    // }


    var userData = {
        // "condition": conditionsArray,
        "mapping": mappingArray,
        // "filterLogic": filter,
        "frequency": frequency
        // "accountNameMapping": accountNameMapping
    };

    userData = JSON.stringify(userData);
    console.log(userData);


    osapi.http.post({
        href: jiveBaseUrl + "/saveUserSyncingData",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        },
        'body': {
            'userData': userData
        }
    }).execute(function (res) {
        console.log("Result od save data",res)
        if (res.content.status == 200) {
            var div2 = document.getElementById('success1');
            div2.style.color = "Black";
            div2.innerHTML = res.content.message;
            div2.style.display = "block";
            removeDiv(div2);
        }
        else {
            var div2 = document.getElementById('success1');
            div2.style.color = "Red";
            div2.innerHTML = res.content.message;
            div2.style.display = "block";
            removeDiv(div2);
        }

    })
};

// //Get Accoount Report Logs
//
// getAccountReportLog = function(){
//      osapi.http.get({
//          href: jiveBaseUrl + "/readAccountLogs",
//          'refreshInterval': 0,
//          format: 'json',
//          'authz': 'signed',
//          'headers': {
//              'Content-Type': ['application/json']
//          }
//
//      }).execute(function (res) {
//          console.log("Logs",res);
//         var report = res.content.data;
//          console.log(report[0]);
//          var accountReport = document.getElementById('example').tBodies[0];
//          //accountReport.tBodies;
//
//          for(var i=0;i<res.content.data.length;i++){
//              if(accountReport.children.length<=i){
//                  var table_row = document.createElement('tr');
//
//                  var table_data1 = document.createElement('td');
//                  var table_data2 = document.createElement('td');
//                  var table_data3 = document.createElement('td');
//                  var table_data4 = document.createElement('td');
//                  var table_data5 = document.createElement('td')
//
//
//                  table_data1.innerHTML = report[i].accountId;
//                  table_data2.innerHTML = report[i].message;
//                  table_data3.innerHTML = report[i].placeId;
//                  table_data4.innerHTML = report[i].status;
//                  table_data5.innerHTML = report[i].timestamp;
//
//                  table_row.appendChild(table_data1);
//                  table_row.appendChild(table_data2);
//                  table_row.appendChild(table_data3);
//                  table_row.appendChild(table_data4);
//                  table_row.appendChild(table_data5);
//
//                  accountReport.appendChild(table_row);
//
//              }
//
//
//
//
//          }
//          showReportPage();
//          gadgets.window.adjustHeight();
//
//      })
//
//  }
//
//  //Get Profile Report Logs
// getProfileReportLog = function(){
//     osapi.http.get({
//         href: jiveBaseUrl + "/readProfileLogs",
//         'refreshInterval': 0,
//         format: 'json',
//         'authz': 'signed',
//         'headers': {
//             'Content-Type': ['application/json']
//         }
//
//     }).execute(function (res) {
//         console.log("Logs",res);
//         var report = res.content.data;
//         console.log(report[0]);
//         var accountReport = document.getElementById('example1').tBodies[0];
//         //accountReport.tBodies;
//         for(var i=0;i<res.content.data.length;i++){
//             if(accountReport.children.length<=i){
//                 var table_row = document.createElement('tr');
//
//                 var table_data1 = document.createElement('td');
//                 var table_data2 = document.createElement('td');
//                 var table_data3 = document.createElement('td');
//                 var table_data4 = document.createElement('td');
//                 var table_data5 = document.createElement('td')
//                 var table_data5 = document.createElement('td')
//
//
//                 table_data1.innerHTML = report[i].contactId;
//                 table_data2.innerHTML = report[i].message;
//                 table_data3.innerHTML = report[i].userId;
//                 table_data4.innerHTML = report[i].status;
//                 table_data5.innerHTML = report[i].timestamp;
//
//                 table_row.appendChild(table_data1);
//                 table_row.appendChild(table_data2);
//                 table_row.appendChild(table_data3);
//                 table_row.appendChild(table_data4);
//                 table_row.appendChild(table_data5);
//
//                 accountReport.appendChild(table_row);
//
//             }
//
//
//
//
//         }
//         showReportPage();
//         gadgets.window.adjustHeight();
//
//     })
//
// }





function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];

    // loop through list of radio buttons
    for (var i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}


// Functions for Account Provisiong
function createRow() {

    var table = document.getElementById("main");
    // var tbody = document.getElementById("main1");
    var new_row = table.rows[1].cloneNode(true);

    var len = table.rows.length;
    new_row.cells[0].innerHTML = len;

    var inp1 = new_row.cells[1].getElementsByTagName('select')[0];


   // console.log(new_row.children[4]);

    new_row.children[5].style.display = "block";
    for (var i = 1; i < table.tBodies[0].children.length; i++) {
        table.tBodies[0].children[i].children[0].innerHTML = i + 1;
    }


    table.tBodies[0].appendChild(new_row);
    table.tBodies[0].children[len - 1].children[1].children[0].value = "";
    table.tBodies[0].children[len - 1].children[2].children[0].value = "";
    table.tBodies[0].children[len - 1].children[3].children[0].value = "";
    gadgets.window.adjustHeight();
}

//clear Row
function clearRow(row) {
    var table = document.getElementById("main");
    var j = row.parentNode.parentNode.rowIndex;
    table.tBodies[0].children[j - 1].children[1].children[0].value = "";
    table.tBodies[0].children[j - 1].children[2].children[0].value = "";
    table.tBodies[0].children[j - 1].children[3].children[0].value = ""
    gadgets.window.adjustHeight();
}
//update serial number


function deleteRow(row) {
    var table = document.getElementById("main");
    var j = row.parentNode.parentNode.rowIndex;

    document.getElementById('main').deleteRow(j);
    if (j) {
        for (var i = j - 1; i < table.tBodies[0].children.length; i++) {
            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
        }

    }
    gadgets.window.adjustHeight();
}


function changeBorderColor(id) {
    var element = document.getElementById(id);
    element.style.borderColor = "#ccc";
    element.style.borderWidth = "Thin";
    // gadgets.window.adjustHeight();


    // jivesuccessmsg.style.color = "Red";

}

function filteredlogic() {


    for (var i = table.tBodies[0].children.length; i > 0; i--) {

    }


}


function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

//Create Field Mapping Row
function createFieldMappingRow() {
    var table = document.getElementById("mapping");
//            var tbody = document.getElementById("ProfileSync1");
    var new_row = table.rows[2].cloneNode(true);
    // console.log(new_row);
    var len = table.rows.length;
    new_row.cells[0].innerHTML = len;

    var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
    //new_row.id = "row" + len;
    //inp1.id += len;
//            inp1.value = '';
//     console.log(new_row.children[4]);
    new_row.children[3].style.display = "block";
    for (var i = 1; i < table.tBodies[0].children.length; i++) {
        table.tBodies[0].children[i].children[0].innerHTML = i + 1;
    }


    table.tBodies[0].appendChild(new_row);
    table.tBodies[0].children[len - 1].children[1].children[0].value = "";
    table.tBodies[0].children[len - 1].children[2].children[0].value = "";
    table.tBodies[0].children[len - 1].children[3].children[0].value = "";
    gadgets.window.adjustHeight();
}

function deleteMapRow(row) {
    var table = document.getElementById("mapping");
    var j = row.parentNode.parentNode.rowIndex;

    document.getElementById('mapping').deleteRow(j);
    if (j) {
        for (var i = j - 1; i < table.tBodies[0].children.length; i++) {
            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
        }

    }
    gadgets.window.adjustHeight();

}


//Functions for  Profile Syncing


function createRow1() {

    var table = document.getElementById("ProfileSync");
//            var tbody = document.getElementById("ProfileSync1");
    var new_row = table.rows[1].cloneNode(true);
    // console.log(new_row);
    var len = table.rows.length;
    new_row.cells[0].innerHTML = len;

    var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
    //new_row.id = "row" + len;
    //inp1.id += len;
//            inp1.value = '';
   // console.log(new_row.children[4]);
    new_row.children[5].style.display = "block";
    for (var i = 1; i < table.tBodies[0].children.length; i++) {
        table.tBodies[0].children[i].children[0].innerHTML = i + 1;
    }


    table.tBodies[0].appendChild(new_row);
    table.tBodies[0].children[len - 1].children[1].children[0].value = "";
    table.tBodies[0].children[len - 1].children[2].children[0].value = "";
    table.tBodies[0].children[len - 1].children[3].children[0].value = "";
    gadgets.window.adjustHeight();
}

//clear Row
function clearRow1(row) {
    var table = document.getElementById("ProfileSync");
    var j = row.parentNode.parentNode.rowIndex;
    table.tBodies[0].children[j - 1].children[1].children[0].value = "";
    table.tBodies[0].children[j - 1].children[2].children[0].value = "";
    table.tBodies[0].children[j - 1].children[3].children[0].value = "";
    gadgets.window.adjustHeight();
}
//update serial number


function deleteRow1(row) {
    var table = document.getElementById("ProfileSync");
    var j = row.parentNode.parentNode.rowIndex;

    document.getElementById('ProfileSync').deleteRow(j);
    if (j) {
        for (var i = j - 1; i < table.tBodies[0].children.length; i++) {
            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
        }
    }
    gadgets.window.adjustHeight();
}


//Create Field Mapping Row
function createFieldMappingRow1() {
    var table = document.getElementById("userMapping");
//            var tbody = document.getElementById("ProfileSync1");
    var new_row = table.rows[4].cloneNode(true);
    // console.log(new_row);
    var len = table.rows.length;
    new_row.cells[0].innerHTML = len;

    var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
    //new_row.id = "row" + len;
    //inp1.id += len;
//            inp1.value = '';
//     console.log(new_row.children[4]);
    new_row.children[4].style.display = "block";
    for (var i = 1; i < table.tBodies[0].children.length; i++) {
        table.tBodies[0].children[i].children[0].innerHTML = i + 1;
    }


    table.tBodies[0].appendChild(new_row);
    table.tBodies[0].children[len - 1].children[1].children[0].value = "";
    table.tBodies[0].children[len - 1].children[2].children[0].value = "";
    table.tBodies[0].children[len - 1].children[3].children[0].value = "";
    gadgets.window.adjustHeight();
}

function deleteProfMapRow(row) {
    var table = document.getElementById("userMapping");
    var j = row.parentNode.parentNode.rowIndex;

    document.getElementById('userMapping').deleteRow(j);
    if (j) {
        for (var i = j - 1; i < table.tBodies[0].children.length; i++) {
            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
        }

    }
    gadgets.window.adjustHeight();

}


function removeDiv(div2) {
    setTimeout(function () {
        div2.style.display = "none";
    }, 2000);

}



//Jive Credentails
saveJiveAuthentication = function () {


    var jiveLoginUrl = document.getElementById('jiveLoginUrl').value;
    var jiveEmailAddress = document.getElementById('jiveEmailAddress').value;
    var jivePassword = document.getElementById('jivePassword').value;
    if (jiveLoginUrl == "") {

        document.getElementById('jiveLoginUrl').style.borderColor = "Red";
        document.getElementById('jiveLoginUrl').style.borderWidth = "Thin";

        return false;

    }
    else if (jiveEmailAddress == "") {
        document.getElementById('jiveEmailAddress').style.borderColor = "Red";
        document.getElementById('jiveEmailAddress').style.borderWidth = "Thin";

        return false;
    }
    else if (jivePassword == "") {
        document.getElementById('jivePassword').style.borderColor = "Red";
        document.getElementById('jivePassword').style.borderWidth = "Thin";

        return false;
    }

    if (jiveLoginUrl != "" && jiveEmailAddress != "" && jivePassword != "") {

        document.getElementById("loader").style.display = "block";
        document.getElementById("mainPage").style.display = "none";
        document.getElementById("jiveBtn").disabled = true;
        osapi.http.post({
            href: jiveBaseUrl + "/saveJiveCredentials",
            'refreshInterval': 0,
            format: 'json',
            'authz': 'signed',
            'headers': {
                'Content-Type': ['application/json']
            },
            body: {
                "jiveLoginUrl": jiveLoginUrl,
                "jiveEmailAddress": jiveEmailAddress,
                "jivePassword": jivePassword

            }
        }).execute(function (res) {
          //  console.log('res', res);
          //  updateFields();
            document.getElementById("jiveBtn").disabled = false;
            var jivesuccessmsg = document.getElementById("jivesuccess");
            jivesuccessmsg.style.display = "Block";
            removeDiv(jivesuccessmsg);
          //  console.log("REsponse");
            showPage();

        });
    }


};


//Current data in the account Provisioning


function accountCurrentData() {

    osapi.http.get({
        href: jiveBaseUrl + "/getAccountProvisioningFile",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        }

    }).execute(function (res) {

        var currentData = res.content.accountData;

       // console.log(currentData);
        if (currentData.length) {


            //Account Fields
            if (accountConditionFlag == 0) {
                if (currentData[0].condition.length > 2) {


                    for (var i = 2; i < currentData[0].condition.length; i++) {
                        var table = document.getElementById("main");
                        var new_row = table.rows[1].cloneNode(true);

                        var len = table.rows.length;
                        new_row.cells[0].innerHTML = len;

                        var inp1 = new_row.cells[1].getElementsByTagName('select')[0];


                      //  console.log(new_row.children[4]);

                        new_row.children[5].style.display = "block";
                        for (var i = 1; i < table.tBodies[0].children.length; i++) {
                            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
                        }


                        table.tBodies[0].appendChild(new_row);
                        table.tBodies[0].children[len - 1].children[1].children[0].value = "";
                        table.tBodies[0].children[len - 1].children[2].children[0].value = "";
                        table.tBodies[0].children[len - 1].children[3].children[0].value = "";

                    }
                }
                accountConditionFlag = 1;
            }


            for (var j = 0; j < currentData[0].condition.length; j++) {

                var tBodyChildren = document.getElementById('main').tBodies[0].children;
                var trChild = tBodyChildren[j].children;
              //  console.log(currentData[0].condition[j].field);
                trChild[1].children[0].value = currentData[0].condition[j].field;
                trChild[2].children[0].value = currentData[0].condition[j].operator;
                trChild[3].children[0].value = currentData[0].condition[j].value;


            }

            document.getElementById("filter").value = currentData[0].filterLogic;

            // Mapping Fields
            if (accountMappingFlag == 0) {
                if (currentData[0].mapping.length > 2) {

                    for (var i = 2; i < currentData[0].mapping.length; i++) {


                        var table = document.getElementById("mapping");
//            var tbody = document.getElementById("ProfileSync1");
                        var new_row = table.rows[2].cloneNode(true);
                        // console.log(new_row);
                        var len = table.rows.length;
                        new_row.cells[0].innerHTML = len;

                        var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
                        //new_row.id = "row" + len;
                        //inp1.id += len;
//            inp1.value = '';
//     console.log(new_row.children[4]);
                        new_row.children[3].style.display = "block";
                        for (var i = 1; i < table.tBodies[0].children.length; i++) {
                            table.tBodies[0].children[i].children[0].innerHTML = i + 1;
                        }


                        table.tBodies[0].appendChild(new_row);
                        table.tBodies[0].children[len - 1].children[1].children[0].value = "";
                        table.tBodies[0].children[len - 1].children[2].children[0].value = "";
                        table.tBodies[0].children[len - 1].children[3].children[0].value = "";
                    }

                }
                accountMappingFlag = 1;

            }


            for (var map = 0; map < currentData[0].mapping.length; map++) {


                var tBodyChildren = document.getElementById('mapping').tBodies[0].children;
                var trChild = tBodyChildren[map].children;
                //console.log(currentData[0].condition[map].field);
                trChild[1].children[0].value = currentData[0].mapping[map].salesforceField;
                trChild[2].children[0].value = currentData[0].mapping[map].jiveField;


                var mappingChildren = document.getElementById('mapping').tBodies[0].children;
                var mapChild = mappingChildren[map].children;
                //   console.log(currentData[0].mapping[map].salesforceField)
                mapChild[1].children[0].value = currentData[0].mapping[map].salesforceField;
                mapChild[2].children[0].value = currentData[0].mapping[map].jiveField;


            }

            //Navigation

            var nav = document.getElementById('navigation');
            if (currentData[0].navigation == "0") {
                nav.children[0].checked = true;
            }
            else if (currentData[0].navigation == "1") {
                nav.children[2].checked = true;
            }
            else if (currentData[0].navigation == "2") {
                nav.children[4].checked = true;
            }


            //Frequency
            var freq = document.getElementById('frequency');
            // if(currentData[0].frequency=="0"){
            //     freq.children[0].checked = true;
            // }
            if (currentData[0].frequency == "1") {
                freq.children[0].checked = true;
            }
            else if (currentData[0].frequency == "2") {
                freq.children[2].checked = true;
            }

            //Place Type

            var freq = document.getElementById('placeType');
            // if(currentData[0].frequency=="0"){
            //     freq.children[0].checked = true;
            // }
            if (currentData[0].placeType == "group") {
                freq.children[0].checked = true;
            }
            else if (currentData[0].placeType == "space") {
                freq.children[2].checked = true;
            }
            else if (currentData[0].placeType == "project") {
                freq.children[4].checked = true;
                var projectField = document.getElementById('projectField');
                projectField.style.display = "block";
                document.getElementById('parentBox').value = currentData[0].parent;
                document.getElementById('startDate').value = currentData[0].startDate;
                document.getElementById('dueDate').value = currentData[0].dueDate;

            }


            gadgets.window.adjustHeight();


        }
    })


}


function updateFields() {




    $('#p-r1c1').find('option:not(:first)').remove();
    $('#p-r2c1').find('option:not(:first)').remove();
    $('#pm-r4c1').find('option:not(:first)').remove();
    $('#pm-r1c1').find('option:not(:first)').remove();
    $('#pm-r2c1').find('option:not(:first)').remove();
    $('#pm-r3c1').find('option:not(:first)').remove();


    $('#pm-r1c2').find('option:not(:first)').remove();
    $('#pm-r2c2').find('option:not(:first)').remove();
    $('#pm-r3c2').find('option:not(:first)').remove();
    $('#pm-r4c2').find('option:not(:first)').remove();


 //   $('#existing-account').find('option:not(:first)').remove();
 //   $('#new-account').find('option:not(:first)').remove();


    var salesforceContactFields = [];
    var jiveUserFields = [];
  //  var existingAccountNames = [];
  //  var accountNameMappingFields = [];

    osapi.http.get({
        href: jiveBaseUrl + "/getAccountFields",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        }
    }).execute(function (res) {

        //console.log(res.content);

        salesforceContactFields = res.content.salesforceContactFields;
        jiveUserFields = res.content.jiveUserFields;
       // existingAccountNames = res.content.existingAccountNames;
        //accountNameMappingFields = res.content.accountNameMappingFields;


        document.getElementById('loginUrl').value = res.content.loginUrl;

        document.getElementById('salesforceClientId').value = res.content.clientId;

        document.getElementById('salesforceClientSecret').value = res.content.clientSecret;


        //jive Credentials
        document.getElementById('jiveLoginUrl').value = res.content.jiveLoginUrl;
        document.getElementById('jiveEmailAddress').value = res.content.username;
        document.getElementById('jivePassword').value = res.content.password;



       // var newAccount = document.getElementById('new-account');


        // var select5 = document.getElementById('p-r1c1'),
        //     select6 = document.getElementById('p-r2c1'),
          var  select7 = document.getElementById('pm-r4c1');


        var select8 = document.getElementById('pm-r1c1'),
            select9 = document.getElementById('pm-r2c1'),
            select10 = document.getElementById('pm-r3c1');

        var newOption9 = document.createElement('option');
        newOption9.value = "FirstName";
        newOption9.text = "FirstName";
        select8.add(newOption9);


        var newOption10 = document.createElement('option');
        newOption10.value = "LastName";
        newOption10.text = "LastName";
        select9.add(newOption10);


        var newOption11 = document.createElement('option');
        newOption11.value = "Email";
        newOption11.text = "Email";
        select10.add(newOption11);




        var jiveSelect3 = document.getElementById('pm-r1c2'),
            jiveSelect4 = document.getElementById('pm-r2c2'),
            jiveSelect5 = document.getElementById('pm-r3c2'),
            jiveSelect6 = document.getElementById('pm-r4c2');

        var newOption12 = document.createElement('option');
        newOption12.value = "givenName";
        newOption12.text = "givenName";
        jiveSelect3.add(newOption12);


        var newOption13 = document.createElement('option');
        newOption13.value = "familyName";
        newOption13.text = "familyName";
        jiveSelect4.add(newOption13);


        var newOption14 = document.createElement('option');
        newOption14.value = "Email";
        newOption14.text = "Email";
        jiveSelect5.add(newOption14);


        for (var k = 0; k < salesforceContactFields.length; k++) {
            // var newOption6 = document.createElement('option');
            // var newOption7 = document.createElement('option');
            var newOption8 = document.createElement('option');

            // newOption6.value = salesforceContactFields[k];
            // newOption6.text = salesforceContactFields[k];
            //
            // newOption7.value = salesforceContactFields[k];
            // newOption7.text = salesforceContactFields[k];


            newOption8.value = salesforceContactFields[k];
            newOption8.text = salesforceContactFields[k];

            // select5.add(newOption6);
            // select6.add(newOption7);
            select7.add(newOption8);


        }




        for (var l = 0; l < jiveUserFields.length; l++) {
            var newOption15 = document.createElement('option');

            newOption15.value = jiveUserFields[l];
            newOption15.text = jiveUserFields[l];

            jiveSelect6.add(newOption15);



        }

       // var existingAccount = document.getElementById('existing-account');

        // for (var m = 0; m < existingAccountNames.length; m++) {
        //     var newOption16 = document.createElement('option');
        //
        //
        //     newOption16.value = existingAccountNames[m].id;
        //     newOption16.text = existingAccountNames[m].name;
        //
        //     existingAccount.add(newOption16);
        // }
        //
        // for(var h = 0 ; h < accountNameMappingFields.length ; h++)
        // {
        //     var newOption17 = document.createElement('option');
        //
        //     newOption17.value = accountNameMappingFields[h];
        //     newOption17.text = accountNameMappingFields[h];
        //
        //     newAccount.add(newOption17);
        //
        // }

        showPage();

    });
}


//Current Data in the Profile Syncing

function profileCurrentData() {



    $('#p-r1c1').find('option:not(:first)').remove();
    $('#p-r2c1').find('option:not(:first)').remove();
    $('#pm-r4c1').find('option:not(:first)').remove();
    $('#pm-r1c1').find('option:not(:first)').remove();
    $('#pm-r2c1').find('option:not(:first)').remove();
    $('#pm-r3c1').find('option:not(:first)').remove();


    $('#pm-r1c2').find('option:not(:first)').remove();
    $('#pm-r2c2').find('option:not(:first)').remove();
    $('#pm-r3c2').find('option:not(:first)').remove();
    $('#pm-r4c2').find('option:not(:first)').remove();


    document.getElementById("loader").style.display = "block";
    document.getElementById("mainPage").style.display = "none";
   // gadgets.window.adjustHeight();

    var salesforceContactFields = [];
    var jiveUserFields = [];
    var existingAccountNames = [];
    var accountNameMappingFields = [];

    osapi.http.get({
        href: jiveBaseUrl + "/getAccountFields",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        }
    }).execute(function (res) {


        salesforceContactFields = res.content.salesforceContactFields;
        jiveUserFields = res.content.jiveUserFields;
      // existingAccountNames = res.content.existingAccountNames;
       // accountNameMappingFields = res.content.accountNameMappingFields;


        // salesforce credentials
        document.getElementById('loginUrl').value = res.content.loginUrl;
        document.getElementById('salesforceClientId').value = res.content.clientId;
        document.getElementById('salesforceClientSecret').value = res.content.clientSecret;


        //jive Credentials
        document.getElementById('jiveLoginUrl').value = res.content.jiveLoginUrl;
        document.getElementById('jiveEmailAddress').value = res.content.username;
        document.getElementById('jivePassword').value = res.content.password;




        // var select5 = document.getElementById('p-r1c1'),
        //     select6 = document.getElementById('p-r2c1'),
          var  select7 = document.getElementById('pm-r4c1');


        var select8 = document.getElementById('pm-r1c1'),
            select9 = document.getElementById('pm-r2c1'),
            select10 = document.getElementById('pm-r3c1');

        var newOption9 = document.createElement('option');
        newOption9.value = "FirstName";
        newOption9.text = "FirstName";
        select8.add(newOption9);


        var newOption10 = document.createElement('option');
        newOption10.value = "LastName";
        newOption10.text = "LastName";
        select9.add(newOption10);


        var newOption11 = document.createElement('option');
        newOption11.value = "Email";
        newOption11.text = "Email";
        select10.add(newOption11);



        var jiveSelect3 = document.getElementById('pm-r1c2'),
            jiveSelect4 = document.getElementById('pm-r2c2'),
            jiveSelect5 = document.getElementById('pm-r3c2'),
            jiveSelect6 = document.getElementById('pm-r4c2');

        var newOption12 = document.createElement('option');
        newOption12.value = "givenName";
        newOption12.text = "givenName";
        jiveSelect3.add(newOption12);


        var newOption13 = document.createElement('option');
        newOption13.value = "familyName";
        newOption13.text = "familyName";
        jiveSelect4.add(newOption13);


        var newOption14 = document.createElement('option');
        newOption14.value = "Email";
        newOption14.text = "Email";
        jiveSelect5.add(newOption14);


     //   var newAccount = document.getElementById('new-account');


        for (var k = 0; k < salesforceContactFields.length; k++) {
            // var newOption6 = document.createElement('option');
            // var newOption7 = document.createElement('option');
            var newOption8 = document.createElement('option');
            //
            // newOption6.value = salesforceContactFields[k];
            // newOption6.text = salesforceContactFields[k];
            //
            // newOption7.value = salesforceContactFields[k];
            // newOption7.text = salesforceContactFields[k];


            newOption8.value = salesforceContactFields[k];
            newOption8.text = salesforceContactFields[k];


            // select6.add(newOption7);
            // select5.add(newOption6);
            select7.add(newOption8);


        }


        for (var l = 0; l < jiveUserFields.length; l++) {
            var newOption15 = document.createElement('option');


            newOption15.value = jiveUserFields[l];
            newOption15.text = jiveUserFields[l];





            jiveSelect6.add(newOption15);


        }

      //  var existingAccount = document.getElementById('existing-account');

        // for (var m = 0; m < existingAccountNames.length; m++) {
        //     var newOption16 = document.createElement('option');
        //
        //
        //     newOption16.value = existingAccountNames[m].id;
        //     newOption16.text = existingAccountNames[m].name;
        //
        //     existingAccount.add(newOption16);
        // }
        //
        // for(var h = 0 ; h < accountNameMappingFields.length ;h++)
        // {
        //     var newOption17 = document.createElement('option');
        //     newOption17.value = accountNameMappingFields[h];
        //     newOption17.text = accountNameMappingFields[h];
        //     newAccount.add(newOption17);
        //
        // }
        osapi.http.get({
            href: jiveBaseUrl + "/getUserSyncingFile",
            'refreshInterval': 0,
            format: 'json',
            'authz': 'signed',
            'headers': {
                'Content-Type': ['application/json']
            }

        }).execute(function (res) {

            var currentData = res.content.userData;
          //  console.log(currentData);

            // var tBodyChildren = document.getElementById('ProfileSync').tBodies[0].children;
            // if (currentData.length != tBodyChildren.length) {

                if (currentData.length) {



                    //Account Fields
                    // if (userConditionFlag == 0) {
                    //     if (currentData[0].condition.length > 2) {
                    //         for (var i = 2; i < currentData[0].condition.length; i++) {
                    //             var table = document.getElementById("ProfileSync");
                    //             var new_row = table.rows[1].cloneNode(true);
                    //
                    //             var len = table.rows.length;
                    //             new_row.cells[0].innerHTML = len;
                    //
                    //             var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
                    //
                    //
                    //           //  console.log(new_row.children[4]);
                    //
                    //             new_row.children[5].style.display = "block";
                    //             for (var i = 1; i < table.tBodies[0].children.length; i++) {
                    //                 table.tBodies[0].children[i].children[0].innerHTML = i + 1;
                    //             }
                    //
                    //
                    //             table.tBodies[0].appendChild(new_row);
                    //             table.tBodies[0].children[len - 1].children[1].children[0].value = "";
                    //             table.tBodies[0].children[len - 1].children[2].children[0].value = "";
                    //             table.tBodies[0].children[len - 1].children[3].children[0].value = "";
                    //
                    //         }
                    //     }
                    //     userConditionFlag = 1;
                    //
                    // }
                    //
                    // for (var j = 0; j < currentData[0].condition.length; j++) {
                    //
                    //
                    //     var trChild = tBodyChildren[j].children;
                    //   //  console.log(currentData[0].condition[j].field);
                    //     trChild[1].children[0].value = currentData[0].condition[j].field;
                    //     trChild[2].children[0].value = currentData[0].condition[j].operator;
                    //     trChild[3].children[0].value = currentData[0].condition[j].value;
                    //
                    // }
                    //
                    // document.getElementById("AddFilterLogic1").value = currentData[0].filterLogic;


                    // Mapping Fields
                    if (userMappingFlag == 0) {
                        if (currentData[0].mapping.length > 3) {

                         //   console.log("add mapping rows");
                            for (var i = 3; i < currentData[0].mapping.length; i++) {


                                var table = document.getElementById("userMapping");

                                var new_row = table.rows[4].cloneNode(true);

                                var len = table.rows.length;
                                new_row.cells[0].innerHTML = len;

                                var inp1 = new_row.cells[1].getElementsByTagName('select')[0];
                                new_row.children[4].style.display = "block";
                                for (var i = 1; i < table.tBodies[0].children.length; i++) {
                                    table.tBodies[0].children[i].children[0].innerHTML = i + 1;
                                }


                                table.tBodies[0].appendChild(new_row);
                                table.tBodies[0].children[len - 1].children[1].children[0].value = "";
                                table.tBodies[0].children[len - 1].children[2].children[0].value = "";
                                table.tBodies[0].children[len - 1].children[3].children[0].value = "";
                            }

                        }

                        userMappingFlag = 1;
                    }


                    for (var map = 0; map < currentData[0].mapping.length; map++) {

                        var tBodyChildrenmap = document.getElementById('userMapping').tBodies[0].children;
                        var trChildmap = tBodyChildrenmap[map].children;
                        //console.log(currentData[0].condition[map].field);
                        trChildmap[1].children[0].value = currentData[0].mapping[map].salesforceField;
                        trChildmap[2].children[0].value = currentData[0].mapping[map].jiveField;
                       // console.log(currentData[0].mapping[map].mappingType);

                        if (currentData[0].mapping[map].mappingType == "0") {
                         //   console.log("0");

                            trChildmap[3].children[0].value = 0;
                        }
                        else if (currentData[0].mapping[map].mappingType == "1") {
                         //   console.log("1");
                            trChildmap[3].children[0].value = 1;
                        }
                        else if (currentData[0].mapping[map].mappingType == "2") {
                          //  console.log("2");
                            trChildmap[3].children[0].value = 2;
                        }

                    }


                    //Frequency
                    var freq = document.getElementById('userFrequency');
                    if (currentData[0].frequency == "0") {
                        freq.children[0].checked = true;
                    }
                    else if (currentData[0].frequency == "1") {
                        freq.children[2].checked = true;
                    }
                    else if (currentData[0].frequency == "2") {
                        freq.children[4].checked = true;
                    }


                    // var accountNameMapping = currentData[0].accountNameMapping;
                    //
                    // if (accountNameMapping.userFieldMapping == false) {
                    //     console.log("here");
                    //
                    //     document.getElementById('existing-account').value = accountNameMapping.account;
                    //
                    // }
                    // else {
                    //     document.getElementById('new-account').value = accountNameMapping.account;
                    // }

                    userProfileFlag = 1;

                    gadgets.window.adjustHeight();

                }
            // }
        });
        showPage();


    });
}


//Project Fields

function projectFields() {
    var newDiv = document.getElementById('projectField');
    newDiv.style.display = "block";

    gadgets.window.adjustHeight();
}

function projectFielHide() {
    var newDiv = document.getElementById('projectField');
    newDiv.style.display = "none";
    gadgets.window.adjustHeight();
}


