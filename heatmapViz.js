var map;
var heatmap;
var testData;
var polylines = [];
var markers = [];
var fileContents;
function initMap() {

  var styledMapType = new google.maps.StyledMapType(
    [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ],
    {name: 'Styled Map'});


    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(40,-97.3),
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    // don't forget to add gmaps-heatmap.js
    loadGoogleMapHeatMap();
    //Init heatmap
    heatmap = new HeatmapOverlay(map, 
      {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": document.getElementById("radius").value,
        "maxOpacity": 1.0, 
        // scales the radius based on map zoom
        "scaleRadius": false, 
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": document.getElementById("localExtrema").checked,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count',
      }
    );
}


//Function to parse the heatmap data
function processData(){
    // heatmap layer
    heatmap.cfg.radius = document.getElementById("radius").value;
    heatmap.cfg.useLocalExtrema = document.getElementById("localExtrema").checked
    heatmap.cfg.scaleRadius = document.getElementById("scaleRadius").checked

    if(document.getElementById("sources").checked){
      showSources();
    } else {
      clearSources();
    }

    //Show graph
    if(document.getElementById("hopLinks").checked){
      showHopLinks();
    } else {
      clearHopLinks();
    }

    //Show heatmap
    if(document.getElementById("showheatmap").checked){
      showHeatMap();
    } else {
      clearHeatMap();
    }
  }

  function showHeatMap(){
    var testData = {
      data: gpsCount
    };
    heatmap.setData(testData);
    heatmap.update();
  }

  function clearHeatMap(){
    var emptyData = {
      data: []
    };
    heatmap.setData(emptyData);
    heatmap.update();
  }

  function showSources(){
    entries = sourceIPs.split("\n");
    for(var i = 0; i < entries.length; i++){
      [airport, lat, lon] = entries[i].split(" ");
      var latLng = new google.maps.LatLng(lat,lon);
      var marker = new google.maps.Marker({
          position: latLng,
          title: airport,
          animation: google.maps.Animation.DROP,
          map: map
      });
      markers.push(marker);
    }
  }

  function clearSources(){
    for(var i = 0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    markers = [];
  }

  function showHopLinks(){
    var polyline = [];
    var keys = Object.keys(graphData);


    var max = 0;
    var min = 999;
    for (var i = 0; i < keys.length; i++) {
      var source_gps = keys[i];
      var dest_gps_list = Object.keys(graphData[source_gps]);
      for(var j = 0; j < dest_gps_list.length; j++){
        dest_gps = dest_gps_list[j];
        count = graphData[source_gps][dest_gps];
        var srcGPSlat = parseFloat(source_gps.split(",")[0]);
        var srcGPSlng = parseFloat(source_gps.split(",")[1]);
        var destGPSlat = parseFloat(dest_gps.split(",")[0]);
        var destGPSlng = parseFloat(dest_gps.split(",")[1]);
        if((Math.abs(srcGPSlng - destGPSlng) < 30.0) && (Math.abs(srcGPSlat - destGPSlat) < 30.0)){
          var srclatLng = new google.maps.LatLng(srcGPSlat,srcGPSlng);
          var destlatLng = new google.maps.LatLng(destGPSlat,destGPSlng);
          polyline = [srclatLng,destlatLng];
          if(count > max){
            max = count;
          }
          if(count < min){
            min = count;
          }

          var colors = rainbow_colormap(count,1,12874);
          var r = colors[0].toString(16);
          var g = colors[1].toString(16);
          var b = colors[2].toString(16);
          if(r.length==1)
            r="0"+r;
          if(g.length==1)
            g="0"+g;
          if(b.length==1)
            b="0"+b;
          var color = "#"+r+g+b;
          var line = new google.maps.Polyline({
            path: polyline,
            strokeWeight: count/1000,
            map: map,
            strokeColor: color
          });
          polylines.push(line);
        }
      }
    }
    console.log(min, max);
  }

  function clearHopLinks(){
    for(var i = 0; i < polylines.length; i++){
      polylines[i].setMap(null);
    }
  }

  //colormap function from mp1
  function rainbow_colormap(fval,fmin,fmax){
    var dx=0.8;
    var fval_nrm = (fval-fmin)/(fmax-fmin);
    var g = (6.0-2.0*dx)*fval_nrm +dx;
    var R = Math.max(0.0,(3.0-Math.abs(g-4.0)-Math.abs(g-5.0))/2.0 )*255;
    var G = Math.max(0.0,(4.0-Math.abs(g-2.0)-Math.abs(g-4.0))/2.0 )*255;
    var B = Math.max(0.0,(3.0-Math.abs(g-1.0)-Math.abs(g-2.0))/2.0 )*255;
    color = [Math.round(R),Math.round(G),Math.round(B)];
    return color;
  }






