



$(document).ready(function () {

    console.log("here");
    
                jive.tile.getContainer(function(response)
                {
                    var placeId = response.placeID;
                    osapi.jive.core.get({
                        v: "v3",
                        href: '/members/places/'+placeId
                    }).execute(function (response) {
                        // console.log(response);

                        var headDiv = $("#container");
                        var i = 1;

                        response.list.forEach(function(member)
                        {
                            if(member.state == "owner" || member.state == "member")
                            {
                                var divToBeInserted ='<div class="panel panel-default" style="margin-bottom: 0px">';
                                divToBeInserted+='<div class="panel-heading"><strong>'+member.person.displayName+'</strong></div>';
                                divToBeInserted+='<div class="panel-body" style="padding-top: 5px">';
                                divToBeInserted+='<div><label style="width: 75px;text-align: left">Email</label>: '+member.person.emails[0].value+'</div>';
                                divToBeInserted+='<div><label style="width: 75px;text-align: left">Username</label>: '+member.person.name.givenName+'</div>';
                                divToBeInserted+='</div>';
                                divToBeInserted+='</div>';
                                headDiv.append($(divToBeInserted));
                            }

                        });
                        gadgets.window.adjustHeight();

                    });
                })

});


