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
    slideshowMarkers.clearLayers();
    console.log("Slideshows: " + slideshows.length);

    if (slideshows.length > 0) {
            // Create marker for each slideshow entry
            let slideshowIcon = L.icon({
                iconUrl: '../img/story.png',
                iconSize: [30,30],
                iconAnchor: [15,15]
            });
            for (let i = 0; i < slideshows.length; i++) {
                let img = slideshows[i];
                console.log(img.title);
                if (img.year >= startDate && img.year <= endDate) {

                    let marker = L.marker([img.lat, img.lng], {
                        icon: slideshowIcon
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
                    marker.on('click', function() {
                        open_slideshow(img.imgURL);
                    })

                    slideshowMarkers.addLayer(marker);
                }
            }

    } else {
        console.log("No slideshows to add");
    }
}


// Opens slideshow
function open_slideshow(path) {
    console.log("open_slideshow");
    $.ajax({
        url: path,
        dataType: "html",
        success: function(d) {
            $('#slideshow').html(d);
            $('#slideshow').show();
        },
        error: function() {
            console.log("Error loading slideshow");
        }
    });
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
    html += '<a class="dropdown-item neighborhood" href="#" data-name="Show All">Show All <span class="badge badge-pill badge-primary">' + total + '</span></a><hr>';
    
    // Filter by individual neighborhoods:
    for (let i = 0; i < neighborhoods.length; i++) {
        let n = neighborhoods[i];
        html += '<a class="dropdown-item neighborhood" href="#" data-name = "' + n.name + '">' + n.name + ' <span class="badge badge-pill badge-primary">' + n.count + '</span></a>';
    }
    
    
    $('#neighborhoodFilter').html(html);

    $('.neighborhood').on('click', function() {
        let n = $(this).data('name');
        console.log(n);

        if (n == 'Show All') {
            load_data();
            let b = $('#lblStartYear').html();
            let e = $('#lblEndYear').html();
            console.log(b, e);
            add_image_markers(b, e);
            add_slideshow_markers(b, e);
        } else {
            get_markers_by_neighborhood(n);
        }
    });
}

// Reloads markers with neighborhood filter
function get_markers_by_neighborhood(n) {
    $.ajax({
        method: 'POST',
        url: config.dbURL,
        dataType: "JSON",
        data: {"n": n},
        success: function (d) {
            console.log("Success!");
            console.log(d);
            images = d.images;
            slideshows = d.slideshows;

            add_image_markers();
            add_slideshow_markers();
        },
        error: function() {
            console.log('Error loading markers.')
        }
    });
}


function load_data() {
    $.ajax({
        method: 'POST',
        url: config.dbURL,
        dataType: "JSON",
        success: function (d) {
            console.log("Success!");
            console.log(d);
            images = d.images;
            slideshows = d.slideshows;
            let neighborhoods = d.neighborhoods;

            add_image_markers();
            add_slideshow_markers();
            create_neighborhood_filter(neighborhoods);
        },
        error: function (x, y, z) {
            // Update error message in splash screen
            $('#loadingStatus').html('Error loading images! :(').addClass('color-red');
            console.log(x);
            console.log(y);
            console.log(z);
        }
    })
}

$(document).ready(function () {
    // Splash screen is displayed
    $('#cityName').html(config.cityName);
    console.log(config.dbURL);

    // Load data from database
    load_data();

    // Show main site under splash screen
    $('#main').show();
    map.invalidateSize(); // Update map after showing it

    $('#loadingStatus').html('Initializing Flux Capacitor');

    // Hide splash screen
    setTimeout(function () {
        $('#loading').fadeOut();
    }, 2000);

});
