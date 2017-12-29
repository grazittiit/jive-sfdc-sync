/****************************************************
 * This file should load AFTER view.js or container.js, or whichever .js file that defines the onReady, onContainer and onViewer
 *
 * Note:  This implmentation has been provided for convenience, developers are not required to use this pattern.
 *
 * SEE: Tile API & Development FAQ - https://community.jivesoftware.com/docs/DOC-185776
 ****************************************************/

//************************************************************************
//NOTE: CALLED AS SOON AS THE FULL CONTEXT IS RESOLVED
//************************************************************************

var jiveBaseUrl =  "https://connectors.grazitti.com:1700/group-members-view";


$(document).ready(function()
{

    gadgets.window.adjustHeight();
    gadgets.window.adjustWidth();

    osapi.http.get({
        href: jiveBaseUrl + "/adminCredentials",
        'refreshInterval': 0,
        format: 'json',
        'authz': 'signed',
        'headers': {
            'Content-Type': ['application/json']
        }
    }).execute(function (res) {
        console.log("here");
        var adminEmail = res.content.email;
        var adminPassword = res.content.password;
        document.getElementById('email').value = adminEmail;
        document.getElementById('pwd').value = adminPassword;
        gadgets.window.adjustHeight();
        gadgets.window.adjustWidth();
    });

    // console.log("on ready");
    // tileConfig = {};
    // jive.tile.onOpen(
    //     function(config, options) {
    //         console.log("config",config);
    //         if (config === null) tileConfig = {};
    //         if (!config["data"]) {
    //             tileConfig["data"] = {};
    //             tileConfig["data"]["email"] = "";
    //             tileConfig["data"]["password"] = "";
    //         }
    //         else{
    //             tileConfig["data"] = {};
    //             tileConfig["data"]["email"] =  config["data"]["email"];
    //             tileConfig["data"]["password"] = config["data"]["password"];
    //         }
    //         document.getElementById('email').value =  tileConfig["data"]["email"];
    //         document.getElementById('pwd').value =  tileConfig["data"]["password"];
    //
    //         gadgets.window.adjustHeight();
    //
    //     });

});


function onReady(tileConfig,tileOptions,viewer,container) {

    console.log("on ready custom");
    gadgets.window.adjustHeight();

    // make sure config has default value
    if (tileConfig === null) tileConfig = { };
    if (!tileConfig["data"]) {
        config["data"] = { };
    }
    if (!tileConfig["data"]["email"]) {
        tileConfig["data"]["email"] = "";
        tileConfig["data"]["password"] = "";
    }

    // populate the dialog with existing config value
    $("#email").val( tileConfig["data"]["email"]);
    $("#pwd").val(tileConfig["data"]["password"]);
    $("#btn_submit").click( function() {

        if($("#email").val() == "admin@carbonblack.com" &&  $("#pwd").val() == "carbonblack@123")
        {
            tileConfig["data"]["email"] = $("#email").val();
            tileConfig["data"]["password"] = $("#pwd").val();
            jive.tile.close(tileConfig, {} );
        }
        else{
            document.getElementById('invalidCredentials').style.display = "block";
            changeVisibility();
            return false;
        }

    });
    // update config object after clicking submit
    
    app.resize();
} // end function



function verifyAdminCredentials(){

    var email = document.getElementById('email').value;
    var password = document.getElementById('pwd').value;
    console.log("inside the function");
    if(email == "admin@carbonblack.com" &&  password == "carbonblack@123")
    {
        osapi.http.post({
            href: jiveBaseUrl + "/adminCredentials",
            'refreshInterval': 0,
            format: 'json',
            'authz': 'signed',
            'headers': {
                'Content-Type': ['application/json']
            },
            'body':{
                'email': document.getElementById('email').value,
                'password':  document.getElementById('password').value
            }
        }).execute(function (res) {
           if(res.content.status == 200)
           {
               document.getElementById('invalidCredentials').innerHTML = res.content.message;
               document.getElementById('invalidCredentials').style.display = "block";
               changeVisibility();
           }
        });
        // tileConfig["data"]["email"] = document.getElementById('email').value;
        // tileConfig["data"]["password"] = document.getElementById('pwd').value;
        // jive.tile.close(tileConfig,{});
    }
    else{
        document.getElementById('invalidCredentials').innerHTML = "Invalid Credentials";
        document.getElementById('invalidCredentials').style.display = "block";
        changeVisibility();
        return false;
    }

}


//************************************************************************
//NOTE: CALLED AS SOON AS THE CONFIG IS RESOLVED
//************************************************************************
function onConfig(tileConfig,tileOptions) {
    console.log('onConfig',tileConfig,tileOptions);
} // end function

//************************************************************************
//NOTE: CALLED AS SOON AS THE CONTAINER IS RESOLVED
//************************************************************************
function onContainer(container) {
    console.log('onContainer',container);
} // end function

//************************************************************************
//NOTE: CALLED AS SOON AS THE VIEWER IS RESOLVED
//************************************************************************
function onViewer(viewer) {
    console.log('onViewer',viewer);
} // end function


function changeVisibility() {
    setTimeout(function () {
        document.getElementById('invalidCredentials').style.display = "none";
    }, 2000);
}