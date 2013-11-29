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

    function setPushPin(map, event) {
        try {
            var startTime = (new Date(event.start_time)).getTime();
            var now = (new Date()).getTime();
            var time1hour = 60 * 60 * 1000;
            if (startTime < now + time1hour) {
                var timestamp = (startTime < now)? "Now" : "In " + (new Date(startTime-now)).getMinutes() + " minutes"; 
                var pushpinContent = "<div class='pin' style='background-image:url(" + 
		    event.cover.source + ");'>" + event.name + "<span>" + timestamp + "</span></div>";
	        var pushpinOptions =  {width: null, height: null, htmlContent: pushpinContent};
                var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(
                    event.venue.latitude,
                    event.venue.longitude),
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
		        setPushPin(map, response.events.data[i]);
                    }
                });
            } else {
		console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: "user_events"});
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
