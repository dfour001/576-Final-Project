// Initialize images and slideshows data
var images;
var slideshows;

var imageMarkers = L.layerGroup([]).addTo(map);
var slideshowMarkers = L.layerGroup([]).addTo(map);

// Functions for adding images and slideshows
function add_image_markers(startDate=0, endDate=9999) {
    // Remove existing layers before adding new ones
    imageMarkers.clearLayers();
    
    if (images.length > 0) {
        // Create marker for each image entry
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.year >= startDate && img.year <= endDate) {
                let marker = L.marker([img.lat, img.lng]);
                
                marker.attributes = {
                    "year": img.year,
                    "title": img.title,
                    "description": img.description,
                    "userName": img.userName,
                    "imgURL": img.imgURL,
                    "direction": img.direction
                };
                
                
                imageMarkers.addLayer(marker);
            }
        }
    } else {
        console.log("No images to add");
    }
}

function add_slideshow_markers(startDate=0, endDate=9999) {
    if(slideshows.length > 0) {
        for (let i = 0; i < slideshows.length; i++) {
            console.log(slideshows[i].title);
        }
    } else {
        console.log("No slideshows to add");
    }
}

$(document).ready(function() {
    // Display splash screen
    
    
    // Load data from database
    $.ajax({
        url: "js/testData.json",
        dataType: "json",
        success: function(d) {
            console.log("Success!");
            images = d.images;
            slideshows = d.slideshows;
            
            add_image_markers();
            add_slideshow_markers();
            
            
            
        },
        error: function(x, y, z) {
            console.log("ugh, something went wrong. :(");
            console.log(y);
            console.log(z);
        }
    })
    
    // Once data is added to map, display map and hide splash screen
});