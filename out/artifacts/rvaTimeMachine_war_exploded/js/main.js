// Initialize images and slideshows data as global variables
var images;
var slideshows;

var imageMarkers = L.featureGroup([]).addTo(map);
var slideshowMarkers = L.featureGroup([]).addTo(map);


// Functions for adding image and slideshow markers to the map
function add_image_markers(startDate = 0, endDate = 9999) {
    // Remove existing layers before adding new ones
    imageMarkers.clearLayers();

    if (images.length > 0) {
        // Create marker for each image entry
        let cameraIcon = L.icon({
            iconUrl: '../img/camera.png',
            iconSize: [30,30],
            iconAnchor: [15,15]
        });
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.year >= startDate && img.year <= endDate) {

                let marker = L.marker([img.lat, img.lng], {
                    rotationAngle: img.direction,
                    icon: cameraIcon
                });

                marker.attributes = {
                    "year": img.year,
                    "title": img.title,
                    "description": img.description,
                    "userName": img.userName,
                    "imgURL": img.imgURL,
                    "direction": img.direction
                };
                
                // Set marker pop-up event
                marker.on('click', function(){open_img_modal(marker.attributes)});
               // marker.on('click', open_img_modal(marker.attributes));



                imageMarkers.addLayer(marker);
            }
        }

        // Zoom map to extent of image markers
        if (imageMarkers.getLayers().length > 0) {
            setTimeout(function () { // Timeout set to avoid bug of zooming before markers are added
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


// Opens image modal
function open_img_modal(attr) {
    // Setup modal with input attributes
    $('#imgYear').html(attr.year);
    $('#imgTitle').html(attr.title);
    $('#imgImg').attr('src', attr.imgURL);
    $('#imgDescription').html(attr.description);
    $('#imgUserName').html('- ' + attr.userName);
    
    // Open modal
    $('#imgModal').modal('show');
}


// Add neighborhood filter data
function create_neighborhood_filter(neighborhoods) {
    // Find total number of points
    let total = imageMarkers.getLayers().length + slideshowMarkers.getLayers().length;
    
    // Build html for neighborhood filter
    let html = '';
    
    // Filter by all neighborhoods:
    html += '<a class="dropdown-item" href="#">Show All <span class="badge badge-pill badge-primary">' + total + '</span></a><hr>';
    
    // Filter by individual neighborhoods:
    for (let i = 0; i < neighborhoods.length; i++) {
        let n = neighborhoods[i];
        html += '<a class="dropdown-item" href="#">' + n.name + ' <span class="badge badge-pill badge-primary">' + n.count + '</span></a>';
    }
    
    
    $('#neighborhoodFilter').html(html);
}

$(document).ready(function () {
    // Splash screen is displayed
    $('#cityName').html(config.cityName);
    console.log(config.dbURL);
    // Load data from database
    $.ajax({
        method: 'POST',
        url: config.dbURL,
        dataType: "JSON",
        success: function (d) {
            console.log("Success!");
            images = d.images;
            slideshows = d.slideshows;
            let neighborhoods = d.neighborhoods;

            add_image_markers();
            add_slideshow_markers();
            create_neighborhood_filter(neighborhoods);

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
            console.log(x);
            console.log(y);
            console.log(z);
        }
    })

});
