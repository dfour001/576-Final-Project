// Global variables controlling editing
var insertImg = false; // If true, clicking map will insert image marker
var insertSlideshow = false; // If true, clicking map will insert slideshow marker
function reset_insert_tools() {
    insertImg = false;
    insertSlideshow = false;
    $('#editMap').css('cursor', 'grab');
}

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
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.year >= startDate && img.year <= endDate) {
                let marker = L.marker([img.lat, img.lng], {
                    rotationAngle: img.direction,
                    icon: cameraIcon
                });

                marker.attributes = {
                    "id": img.id,
                    "year": img.year,
                    "title": img.title,
                    "description": img.description,
                    "userName": img.userName,
                    "imgURL": img.imgURL,
                    "direction": img.direction,
                    "source": "images"
                };

                // Set marker pop-up event
                marker.on('click', function(){open_img_modal(marker.attributes)});
                
                // Add row to image edit list
                add_edit_row("#imageList", marker.attributes);

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


function get_image_marker_by_id(id) {
    let markers = imageMarkers.getLayers();
    for (let i = 0; i < markers.length; i++) {
        let markerID = markers[i].attributes.id;
        if (markerID == id) {
            return markers[i]
        }
    }

    return null
}

function add_slideshow_markers(startDate = 0, endDate = 9999) {
    if (slideshows.length > 0) {
        let slideshowIcon = L.icon({
            iconUrl: '../img/story.png',
            iconSize: [30,30],
            iconAnchor: [15,15]
        });

        for (let i = 0; i < slideshows.length; i++) {
            let slideshow = slideshows[i];
            if (slideshow.year >= startDate && slideshow.year <= endDate) {
                let marker = L.marker([slideshow.lat, slideshow.lng], {
                    icon: slideshowIcon
                });

                marker.attributes = {
                    "id": slideshow.id,
                    "year": slideshow.year,
                    "title": slideshow.title,
                    "source": "slideshow"
                };

                // Add row to slideshow edit list
                add_edit_row("#slideshowList", marker.attributes);

                slideshowMarkers.addLayer(marker);
            }


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


// Adds row to the edit list on the right hand side of the screen
function add_edit_row(list, attr) {
    let row = '<div class="row datarow"><div class="col-10">'+ attr.year + ' - ' + attr.title + '</div><div class="col-1"><a href="#" class="icons btnEdit" data-id="' + attr.id + '" data-title="' + attr.title + '" data-source="' + attr.source + '">n</a></div><div class="col-1"><a href="#" class="icons btnDelete"  data-id="' + attr.id + '" data-title="' + attr.title + '" data-source="' + attr.source + '">&ugrave;</a></div></div>'
    $(list).append(row);
}

// Notification System
var notTimer; // Notification bar timeout object
function map_notification(message) {
    // Cancel previous timout if exists
    if (notTimer != null) {
        clearTimeout(notTimer);
    }
    
    // Set and display notification
    let mNot = $('#mapNotification');
    mNot.slideDown();
    mNot.html(message);

    // Hide notification after 6 seconds
    notTimer = setTimeout(function () {
        mNot.slideUp();
        notTimer = null;
    }, 6000);
}


$('#btnAddImage').on('click', function () {
    reset_insert_tools();
    insertImg = true;
    
    $('#editMap').css('cursor', 'crosshair');
    
    map_notification("Click on a location in the map to place an <span class='color-gold'>image</span> marker");
});

$('#btnAddSlideshow').on('click', function () {
    reset_insert_tools();
    insertSlideshow = true;
    
    $('#editMap').css('cursor', 'crosshair');
    
    map_notification("Click on a location in the map to place a <span class='color-gold'>slideshow</span> marker");
});


// Reset form on modal close
$('#editFormModal-Image').on('hidden.bs.modal', function() {
    $("#formEditImage")[0].reset();
});

// Event to insert image or slideshow markers
map.on('click', function (e) {
    if (insertImg) {
        // Set form coordinate values
        let latlng = e.latlng;
        $('#imgLat').val(latlng.lat);
        $('#imgLng').val(latlng.lng);
        console.log("lat: " + latlng.lat);
        console.log("lng: " + latlng.lng);
        // Show insert image form
        $('#editFormModal-Image').modal('show');

        // Fix issue with displaying map within a modal
        setTimeout(function () {
            imgMap.invalidateSize();
        }, 250);


        // Set imgMap to insert location
        imgMap.setView(latlng, map.getZoom());

        // Move marker to insert location
        imgMapMarker.setLatLng(latlng);
        imgMapMarker.setRotationAngle($('#direction').val());

        reset_insert_tools();
        $('#mapNotification').slideUp();        
    };

    if (insertSlideshow) {
        alert("Insert Slideshow");
        $('#mapNotification').slideUp();
    }
});





$(document).ready(function() {
    // Load data from database
    $.ajax({
        method: 'POST',
        url: "TimeMachineEdit",
        dataType: "JSON",
        data: {"op": "load"},
        success: function (d) {
            console.log("Success!");
            console.log(d);
            images = d.images;
            slideshows = d.slideshows;

            add_image_markers();
            add_slideshow_markers();

            // Add event handlers
            // Event for deleting item in list
            $('.btnDelete').on('click', function(e) {
                let record = $(this);
                let recordID = record.data('id');
                let recordTitle = record.data('title');
                let source = record.data('source')
                $('#lblDeleteTitle').html(recordTitle);
                $('#deleteID').val(recordID);
                $('#deleteTitle').val(recordTitle);
                $('#deleteSource').val(source);
                $('#modalDelete').modal('show');
            });

            // Event for editing item in list
            $('.btnEdit').on('click', function() {
                let record = $(this);
                let recordID = record.data('id');
                let marker = get_image_marker_by_id(recordID);

                console.log(marker);

                // Set edit form inputs to editing mode
                $('#imgOp').val('update');
                $('#imgEditID').val(recordID);
                $('#imgEditYear').val(marker.attributes.year);
                $('#imgEditTitle').val(marker.attributes.title);
                $('#imgEditDescription').val(marker.attributes.description);
                $('#imgEditDirection').val(marker.attributes.direction);

                // Show edit form modal
                $('#editFormModal-Image').modal('show');
            });
        },
        error: function(x,y,z) {
            console.log(x);
            console.log(y);
            console.log(z);
        }
    });
});