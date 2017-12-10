function generateCommand(){
    url = document.getElementById("destination_url").value;
    if(url == ""){
        url = "https://google.com";
    }
    var domain = getDomain(url);
    var reg = /^\d{1,3}/;
    var file_name = url;
    if(!reg.test(domain))
        file_name = domain;
    file_name = file_name + "_traceroute.txt";
    var command = "traceroute -q 1 " + url + " > " + file_name;
    document.getElementById("command").innerHTML = command;
}

function getDomain(url){
    if(url.includes("www.")){
        url = url.substring(url.indexOf("www.")+4,url.length);
    }
    if(url.includes("://")){
        url = url.substring(url.indexOf("://")+3,url.length);
    }
    parts = url.split(".")
    return parts[parts.length-2];
}


function loadFile(){
    var x = document.getElementById("myFile");
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "";
        } else {
            for (var i = 0; i < x.files.length; i++) {
                txt += "<br><strong>Selected File:</strong><br>";
                var file = x.files[i];
                if ('name' in file) {
                    txt += "Name: " + file.name + "<br>";
                }
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    showTraceRoute(contents);
                }
                r.readAsText(file);
            }
        }
    } 
    else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
    document.getElementById("demo").innerHTML = txt;
}


//Function to parse the traceroute data
function showTraceRoute(contents){
    hops = contents.trim().split("\n");
    hops = hops.filter(function(result){
      return !result.includes("*");
    });
    coords = new Array(hops.length);
    console.log(hops);
    //First call is from our current location
    getLocationFromIP("",0,coords);

    for(var i=1; i < hops.length; i++){
        hop = hops[i].trim();
        row = [hop_number,,hostname,ip,,rtt,] = hop.split(" ");
        console.log(hop_number,hostname,ip,rtt);
        ip = ip.substring(1,ip.length-1);
        getLocationFromIP(ip,i,coords);
    }
}

//Uses ip-api to get location info for an IP address
function getLocationFromIP(ip,hop_num,coords){
    var url = "http://ip-api.com/json/"+ip;
    console.log(url);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            result = JSON.parse(xmlHttp.responseText);
            coord = [result.lat, result.lon];
            console.log(result);
            coords[hop_num] = coord;
            console.log(hop_num);
            if(!coords.includes(undefined)){ //we are done filling coords
                console.log(coords);
                addMarkers(coords);
            }
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}