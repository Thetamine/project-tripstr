
// TODO: When you return, start working on the autocomplete form using awesomplete.js
// focus on adding as many store names as possible to the list, perhaps even look into
// finding a respository of all the retail names to make your life a little easier.

// Create an autocomplete widget for assisting in finding user's pitstops
// along the way
var awesompleteInput = document.getElementById("placesTbx");
var awesomeplete = new Awesomplete(awesompleteInput, {
  minChars: 1,
  maxItems: 7,
  autoFirst: true
});
awesomeplete.list = autocompleteArr;

window.onload = function getMap(){
  var obj, color, catName, directionsManager, awesomepleteInput, placesInput;
  var locationObj = { locationList: []};   // create an array object to store the variable location list.
                          // for the maps event handler function 'waypoints'
  var map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'Aq7ULuBT7euUnNSrYvx-6u0bAWfIVmyre8fdnsrE5GEzQGn_Cm26V4DxxBygLqwZ'
  });
  function selectedSuggestion(result) {
      //Remove previously selected suggestions from the map.
      map.entities.clear();

      //Show the suggestion as a pushpin and center map over it.
      var pin = new Microsoft.Maps.Pushpin(result.location);
      map.entities.push(pin);
      map.setView({ bounds: result.bestView });
  }

  // Define a custom overlay class that ingerits from the CustomOverlay Class.
  uiOverlay.prototype = new Microsoft.Maps.CustomOverlay({ beneathLabels: false });

  // Define a Constructor for the custom overlay class
  function uiOverlay() {
    // create a dummy button to get some Data
    // TODO: Replace with an actual search function
    this.getSomeDataBtn = document.createElement('input');
    this.getSomeDataBtn.type = 'button';
    this.getSomeDataBtn.value = 'Get Some Data!';
    this.getSomeDataBtn.id = 'getSomeDataBtn';
    this.getSomeDataBtn.onclick = function(){
    };

    // create a buttom that maps out your chosen route
    this.getDirectionsBtn = document.createElement('input');
    this.getDirectionsBtn.type = 'button';
    this.getDirectionsBtn.value = 'get directions!';
    this.getDirectionsBtn.id = 'getDirectionsBtn';
    this.getDirectionsBtn.onclick = function(){
      getDirections();
    };

    // create a container for the directionsItinerary
    // this.getDirectionsContainer = document.createElement('section');
    // this.getDirectionsContainer.id = 'directionsItinerary';
    // this.getDirectionsContainer.onmouseover = function() {
    //   console.log('Mouse entered directions container!');
    //   map.setOptions({ disableZooming: true });
    // }
    // this.getDirectionsContainer.onmouseout = function() {
    //   console.log('Mouse exited directions container');
    //   map.setOptions({ disableZooming: false });
    // }
  }

  // Implement the onAdd method to set up DOM elements, asn use SetHtmlElement
  // to bind it with the overlay.

  uiOverlay.prototype.onAdd = function(){
    // Create a div that will hold the content, append all elements inside said div
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';
    container.appendChild(this.getSomeDataBtn);
    container.appendChild(this.getDirectionsBtn);
    // container.appendChild(this.getDirectionsContainer);


    // style a container for the directionsItinerary
    this.setHtmlElement(container);

  }

  // Implement the custom overlay to the map
  var uiLayer = new uiOverlay();

  // add the custom overlay to the map
  map.layers.insert(uiLayer);

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

  // create a route based on user input from the getSearchData function
  function getDirections() {
    console.log('function Started!');
    // load the directions module
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function() {

      // Create an instance of the directions manager.
      directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

      // TODO: set the first waypoint to user's current location
      // if it does not already exist

      // Create a function that takes a selected search data
      // point and converts the result into a waypoint on the map.
      function createWaypoint(varName, name, lat, lng){
        console.log('createWaypoint Function has started!');
        varName = new Microsoft.Maps.Directions.Waypoint({
          address: name,
          location: new Microsoft.Maps.Location(lat, lng)
        });
        directionsManager.addWaypoint(varName);
        console.log(varName);
      }

      // Loop through the location object, finding the id, name, latitude
      // and longitude of each point in the array then call the createWaypoint
      // function and add each location as a waypoint
      for (i = 0; i < locationObj.locationList.length; i++) {
        let waypoints = locationObj.locationList[i];
        createWaypoint(waypoints.waypointName, waypoints.name, waypoints.locationLat, waypoints.locationLng);
      }

      // Clear all pins off of the map to prepare for the route phase
      map.entities.clear();

      // Specify the Element in which the itenerary will be rendered.
      directionsManager.setRenderOptions({ itineraryContainer: '#directionsItinerary' });

      // Calculate directions / routes
      directionsManager.calculateDirections();

    });
  }

  // Load the autosuggest module for assisting in finding the user's
  // end destination.
  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
      var manager = new Microsoft.Maps.AutosuggestManager({ map: map });
      manager.attachAutosuggest('#searchTbx', '#shopping-search', selectedSuggestion);
  });

  placesInput = '';

  document.querySelector('#placesTbx').addEventListener('change', function(e){
    placesInput = e.target.value;
  });

  document.querySelector('#searchPlaces').addEventListener("click", function(){
    $.getJSON(`https://api.foursquare.com/v2/venues/explore?near=florence,al&intent=browse&radius=2500&query=${placesInput}&client_id=L5P33BUJOJIRC3JJQ5DP2Q5UETACUJ5B3J1P21PZGGKU1TE4&client_secret=PIVSGE1L5TLOYYRQS5EZIF4O45LO5XSWNLU23SCCMTPKAXIV&v=20171213`,
    function(data) {
      console.log(data);
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
    });
  });
}
