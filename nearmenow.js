(function () {
    
    function getMap()
    {
        map = new Microsoft.Maps.Map(
	    document.getElementById('bing-map'), {
		credentials: 'Ajq-7x-U0c2VIR9WJxy3wXHPpR_ZwRdkjzT0PSvyhKah94KDRGk1FPkY85hiFW5U', 
		showDashboard: false, 
		enableSearchLogo: false, 
		enableClickableLogo: false, 
		mapTypeId : Microsoft.Maps.MapTypeId.road
	    });
        map.entities.clear();
        var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
        geoLocationProvider.getCurrentPosition({ showAccuracyCircle: true, updateMapView: true });
	return map;
    }

    function setPushPin(map, time, name, picture, latitude, longitude) {
        try {
            var startTime = (new Date(time)).getTime();
            var now = (new Date()).getTime();
            var time1hour = 60 * 60 * 1000;
            if (startTime < now + time1hour) {
                var timestamp = (startTime < now)?
                    (new Date(now-startTime)).getMinutes() + " ago" :
                    "In " + (new Date(startTime-now)).getMinutes() + " minutes"; 
                var pushpinContent = "<div class='pin' style='background-image:url(" + picture + ");'>" 
                    + name + "<span>" + timestamp + "</span></div>";
	        var pushpinOptions =  {width: null, height: null, htmlContent: pushpinContent};
                var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude),
                    pushpinOptions
                );
                map.entities.push(pushpin);
            }
        } catch (err) {}   
    }

    window.fbAsyncInit = function() {
	
	var map = null;
	
        // init the FB JS SDK
        FB.init({
            appId      : '378209865646769',
            status     : true,
            xfbml      : true
        });

	// Login to FB and get event data.
        FB.login(function(response) {
            if (response.authResponse) {
		FB.api('/me?fields=events.since(1385564000).limit(25).fields(name,venue,cover,start_time)', function(response) {
		    // Create the map.
		    map = getMap();
		   
		    // Loop through events adding pushpins.
		    for(var i = 0; i < response.events.data.length; ++i) {
                        var event = response.events.data[i];
                        try {
		            setPushPin(map, event.start_time, event.name, event.cover.source, event.venue.latitude, event.venue.longitude);
                        } catch (err) {}
                    }
                });
                /*
                FB.api('/me?fields=friends.limit(20).fields(checkins.limit(10).fields(created_time,coordinates),picture)', function(response) {
                    map = getMap();
                    // Loop through friends' checkins
                    for (var i = 0; i < response.friends.data.length; i++) {
                        try {
                            for (var j = 0; j < response.friends.data[i].checkins.data; j++) {
                                var coordinates = response.friends.data[i].checkins.data[j].coordinates;
                                var createdTime = (new Date(response.friends.data[i].checkins.data[j].created_time)).getTime();

                            }
                        } catch (err) {}
                    }
                });*/
                // Get check in data.
                var xmlhttp = new XMLHttpRequest(); // TODO: IE5, IE6? ;-)
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var response = xmlhttp.responseText.substr(9);
                        var data = JSON.parse(response);
                        map = getMap();
                        for(var user in data) {
                            //console.log(data[user].p_url);
                            var userData = data[user];
                            try {
                                setPushPin(map, userData[time],
                                           userData[p_name], userData[pic], userData[lat], userData[lon]);
                            } catch (err) {}
                        }
                    }
                };
            } else {
		console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: "user_events"});

	xmlhttp.open("GET", "https://www.martinoluca.sb.facebook.com/nearmenow/friends/", true);
	xmlhttp.send();
    };
    
    // Load the SDK asynchronously.
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
}());
