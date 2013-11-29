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
		FB.api('/me?fields=events.until(1384977600).limit(25).fields(venue)', function(response) {

		    // Create the map.
		    map = getMap();

		    // Loop through events adding pushpins.
		    for(var i = 0; i < response.events.data.length; ++i) {
			var obj = response.events.data[i];
			for(var key in obj) {
			    var attrName = key;
			    var attrValue = obj[key];
			    console.log("Name " + attrName + "Value");
			}

			var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(
			    obj.venue.latitude,
			    obj.venue.longitude, 
			    null
			));
			map.entities.push(pushpin);
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
