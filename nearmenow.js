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

    function setPushPin(map, time, name, id, picture, latitude, longitude)
    {
        try {
            var startTime = (new Date(time)).getTime();
            var now = (new Date()).getTime();
            var time1hour = 60 * 60 * 1000;
            if (startTime < now + time1hour) {
                var timestamp = (startTime < now)?
                    (new Date(now-startTime)).getMinutes() + " minutes ago" :
                    "In " + (new Date(startTime-now)).getMinutes() + " minutes"; 
                var url = "https://www.facebook.com/" + id;
                var pushpinContent = "<div class='pin' style='background-image:url(" + picture + ");'>" 
                    + name + "<span>" + timestamp + "</span></div>";
	        var pushpinOptions =  {width: null, height: null, htmlContent: pushpinContent};
                var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude),
                    pushpinOptions
                );
                Microsoft.Maps.Events.addHandler(pushpin, 'dblclick', function(){window.open(url, '_blank', false);}); 
                map.entities.push(pushpin);
            }
        } catch (err) {}   
    }
    
    function requestPages(request, field, callback) {
	FB.api(request, function(response) {
	    processPage(response[field], callback);
	});
    }

    function processPage(response, callback) {
	try {
	    for (var i = 0; i < response.data.length; ++i) {
		try {
		    callback(response.data[i]);
		} catch (err) {}
	    }
	    requestNextPage(response.paging.next, callback); // TODO: JS TCO? ;-)
	} catch(err) {
	}
    }

    function requestNextPage(request, callback) {
	if (request == undefined) {
	    return;
	}
	var xmlhttp = new XMLHttpRequest(); // TODO: IE5, IE6? ;-)
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		processPage(JSON.parse(xmlhttp.responseText), callback);
	    }
	};
	xmlhttp.open("GET", request, true);
	xmlhttp.send();
    }

    window.fbAsyncInit = function() {
	
        // Initialize the FB JS SDK
        FB.init({
            appId      : '378209865646769',
            status     : true,
            xfbml      : true
        });

	// Login to FB and get event data.
        FB.login(function(response) {
            if (response.authResponse) {

		var map = getMap();

		// Loop through events adding pushpins.
		requestPages('/me?fields=events.since(1385800000).limit(10)', 'events', function(event) {
                    console.log("Event " + event.name);
                    setPushPin(map, event.start_time, event.name, event.id, event.cover.source, 
			       event.venue.latitude, event.venue.longitude);
		});

		// Loop through friend locations adding pushpins.
		requestPages('/me?fields=friends.limit(10).fields(locations.since(1385800000).limit(1).fields(place,created_time),first_name,picture)', 'friends', function(friend) {
		    var coordinates = friend.locations.data[0].place.location
		    var createdTime = (new Date(friend.locations.data[0].created_time)).getTime();
		    var name = friend.first_name;
		    var pic = friend.picture.data.url;
		    console.log("Checkin for " + name);
		    setPushPin(map, createdTime, name, friend.id, pic, coordinates.latitude, coordinates.longitude);
		});

		// Get location data.
		var xmlhttp = new XMLHttpRequest(); // TODO: IE5, IE6? ;-)
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			try {
			    var response = xmlhttp.responseText.substr(9);
			    var data = JSON.parse(response);
			    for(var user in data) {
				var userData = data[user];
				console.log("Aura location for " + userData.p_name);
				try {
				    setPushPin(map, userData.time, userData.p_name, user, 
					       userData.pic, userData.lat, userData.lon);
				} catch (err) {}
			    }
			} catch (err) {}
		    }
		};
		xmlhttp.open("GET", "https://www.martinoluca.sb.facebook.com/nearmenow/friends/", true);
		xmlhttp.send();			   
	    }
	}, {scope: "user_events, friends_checkins"});
	
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
