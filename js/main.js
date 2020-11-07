// Initialize images and slideshows data
var images;
var slideshows;

var imageMarkers = L.featureGroup([]).addTo(map);
var slideshowMarkers = L.featureGroup([]).addTo(map);

// Functions for adding images and slideshows
function add_image_markers(startDate = 0, endDate = 9999) {
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

        if (imageMarkers.getLayers().length > 0) {
            setTimeout(function () {
                map.flyToBounds(imageMarkers.getBounds());
            }, 250);
        }


    } else {
        console.log("No images to add");
    }


}

function add_slideshow_markers(startDate = 0, endDate = 9999) {
    if (slideshows.length > 0) {
        for (let i = 0; i < slideshows.length; i++) {
            console.log(slideshows[i].title);
        }
    } else {
        console.log("No slideshows to add");
    }
}

$(document).ready(function () {
    // Splash screen is displayed
    // Load data from database
    $.ajax({
        url: "js/testData.json",
        dataType: "json",
        success: function (d) {
            console.log("Success!");
            images = d.images;
            slideshows = d.slideshows;

            add_image_markers();
            add_slideshow_markers();

            // Show main site under splash screen
            $('#main').show();
            map.invalidateSize(); // Update map after show()ing it

            $('#loadingStatus').html('Initializing Flux Capacitor');

            // Hide splash screen
            setTimeout(function () {
                $('#loading').fadeOut();
            }, 2000);

        },
        error: function (x, y, z) {
            // Update error message in splash screen
            $('#loadingStatus').html('Error loading images! :(').addClass('color-red');
        }
    })

});
