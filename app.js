window.onload = function getMap(){
  var obj, color, catName, directionsManager;
  var locationObj = { locationList: []};   // create an array object to store the variable location list.
                          // for the maps event handler function 'waypoints'
  var map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'Aq7ULuBT7euUnNSrYvx-6u0bAWfIVmyre8fdnsrE5GEzQGn_Cm26V4DxxBygLqwZ'
  });

  // Define a custom overlay class that ingerits from the CustomOverlay Class.
  buttonOverlay.prototype = new Microsoft.Maps.CustomOverlay({ beneathLabels: false });

  // Define a Constructor for the custom overlay class
  function buttonOverlay() {
    this.getSomeDataBtn = document.createElement('input');
    this.getSomeDataBtn.type = 'button';
    this.getSomeDataBtn.value = 'Get Some Data!';
    this.getSomeDataBtn.id = 'getSomeDataBtn';
    this.getSomeDataBtn.onclick = function(){
      getSearchData();
    };

    this.getDirectionsBtn = document.createElement('input');
    this.getDirectionsBtn.type = 'button';
    this.getDirectionsBtn.value = 'get directions!';
    this.getDirectionsBtn.id = 'getDirectionsBtn';
    this.getDirectionsBtn.onclick = function(){
      getDirections();
    };
  }

  // Implement the onAdd method to set up DOM elements, asn use SetHtmlElement
  // to bind it with the overlay.

  buttonOverlay.prototype.onAdd = function(){
    // Create a div that will hold the button
    var container = document.createElement('div');
    container.appendChild(this.getSomeDataBtn);
    container.appendChild(this.getDirectionsBtn)
    container.style.position = 'absolute';
    container.style.top = '100px';
    container.style.left = '50px';
    this.setHtmlElement(container);
  }

  // Implement the custom overlay to the map
  var overlay = new buttonOverlay();

  // add the custom overlay to the map
  map.layers.insert(overlay);

  // determine and color code the pushpins by resultCategory
  // TODO: assign the other category names to the function that we will be using
  function determinePinColor(resultCategory){
    switch(resultCategory) {
      case "Fast Food Restaurant":
      color = "green";
      break;
      default:
      color = "blue";
    }
    return color;
  }

  // get some search data from the user input
  function getSearchData() {
    reqwest({
      url: './test.json',
      type: 'json',
      method: 'get',
      error: function (err) { },
      success: function(data) {
        // THIS IS WHAT WE WANT vvv THIS WILL RETURN THE RESULTS OF THE VENUE
        // QUERY. FROM HERE WE CAN LOOP THROUGH THE ARRAY OF VENUES AND EXTRACT
        // IMPORTANT INFORMATION TO CARRY BACK OVER TO THE MAPS.

        // Run a for loop that returns all available results as pushpins
        // on the map
        for(var i = 0; i < data.response.groups[0].items.length; i++) {
          let items = data.response.groups[0].items[i];
          // store the category name for use in determining pin color
          let catName = items.venue.categories[0].name;
          let pinColor = determinePinColor(catName);
          // define the location of the pin based on the lat and lng
          // of the currently iterated venue
          let pinLocation = new Microsoft.Maps.Location(items.venue.location.lat, items.venue.location.lng);
          // instntiate the pushpin class and assign it to the variable pin
          let pin = new Microsoft.Maps.Pushpin(pinLocation, {
            title: items.venue.name,
            subtitle: items.venue.categories.pluralName,
            text: ''+ (i+1) +'',
            color: pinColor
          });
          // push the pushpin to the map.
          map.entities.push(pin);
          // make the pushpin clickable: Here is where we will create the
          // function that determines the routes for our users.

          // FUNCTION WAYPOINTS:
          // The purpose of this function is to highlight each clicked pushpins
          // and add their location to an array in order to map waypoints for a
          // custom defined user route.
          Microsoft.Maps.Events.addHandler(pin, 'click', function(e){

            e.target.setOptions({ color: 'red' });    // If clicked, change the color to red
            let name = e.target.getTitle(pin);
            let id = e.target.getText(pin);
            let waypointName = name + 'Waypoint' + id;
            let location = e.target.getLocation(pin); // Get the lat and lng coordinates  of the pinColor
                                                      // and store them in a variable
            locationLat = location.latitude;
            locationLng = location.longitude;
            console.log('Pin Location: ', location.latitude)   // test to make sure that the variable is stored properly
            locationObj.locationList.push({name, id, waypointName, locationLat, locationLng});

          });
        }
      }
    });
    console.log('Your Destination Coordinates: ', locationObj);
  }
  function getDirections() {
    console.log('function Started!');
    // load the directions module
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function() {
      console.log('directions module loaded!');
      // Create an instance of the directions manager.

      console.log('waypoints object is available here! ', locationObj.locationList.length);
      directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

      function createWaypoint(varName, name, lat, lng){
        console.log('createWaypoint Function has started!');
        varName = new Microsoft.Maps.Directions.Waypoint({
          address: name,
          location: new Microsoft.Maps.Location(lat, lng)
        });
        directionsManager.addWaypoint(varName);
        console.log(varName);
      }

      for (i = 0; i < locationObj.locationList.length; i++) {
        let waypoints = locationObj.locationList[i];
        console.log('for loop started! waypoint obj: ', waypoints);
        createWaypoint(waypoints.waypointName, waypoints.name, waypoints.locationLat, waypoints.locationLng);
      }
      console.log('for loop ending!');

      // Specify the Element in which the itenerary will be rendered.
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      // calculate directions
      directionsManager.calculateDirections();

    });
  }
}
