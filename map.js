var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(40,-87.3),
        mapTypeId: 'terrain'
    });
}

function addMarkers(coords){
    var bounds = new google.maps.LatLngBounds();
    var polyline = [];
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var latLng = new google.maps.LatLng(coord[0],coord[1]);
        polyline.push(latLng);
        var marker = new google.maps.Marker({
            position: latLng,
            animation: google.maps.Animation.DROP,
            map: map
        });
        bounds.extend(marker.getPosition());
    }
    if(!boundsInvalid(bounds))
        map.fitBounds(bounds);
    traceRoute(polyline);
}

function boundsInvalid(bounds){
    var NE = bounds.getNorthEast();
    var SW = bounds.getSouthWest()
    corners = [NE.lat(),NE.lng(),SW.lat(),SW.lng()];
    return corners.includes(NaN);
}

function traceRoute(polyline){

  // Define the symbol, using one of the predefined paths ('CIRCLE')
  // supplied by the Google Maps JavaScript API.
  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 5,
    strokeColor: '#393'
  };

// Create the polyline and add the symbol to it via the 'icons' property.
  var line = new google.maps.Polyline({
    path: polyline,
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    map: map
  });

  animateCircle(line);
}


function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 30);
}