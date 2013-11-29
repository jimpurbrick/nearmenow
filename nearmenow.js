(function () {
    
    function getMap()
    {
        map = new Microsoft.Maps.Map(
	    document.getElementById('myMap'), {
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
		FB.api('/me?fields=events.until(1384977600).limit(25).fields(name,venue,cover)', function(response) {

		    // Create the map.
		    map = getMap();

		    // Loop through events adding pushpins.
		    for(var i = 0; i < response.events.data.length; ++i) {
			var event = response.events.data[i];
                        try {
                            var pushpinContent = "<div style='font-size:12px;font-width:bold;border:solid 1px;width:100px;height:100px;background-image:url(" + event.cover.source + ");background-size:100px 100px;'>" + event.name + "</div>";
                            var pushpinOptions =  {width: null, height: null, htmlContent: pushpinContent};
                            var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(
    		                event.venue.latitude,
		                event.venue.longitude), 
		                pushpinOptions
                            );
	    		    map.entities.push(pushpin);
                        } catch (err) {}
		    }
		});
            } else {
		console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: "user_events"});
		
	// TODO: populate the map with FB data.
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
