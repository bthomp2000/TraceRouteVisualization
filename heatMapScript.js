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
                    fileContents = contents;
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
}

