// Global variables controlling editing
var insertImg = false; // If true, clicking map will insert image marker
var insertSlideshow = false; // If true, clicking map will insert slideshow marker
function reset_insert_tools() {
    insertImg = false;
    insertSlideshow = false;
    $('#editMap').css('cursor', 'grab');
}

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

// Event to insert image or slideshow markers
map.on('click', function (e) {
    if (insertImg) {
        // Show insert image form
        $('#editFormModal-Image').modal('show');

        // Fix issue with displaying map within a modal
        setTimeout(function () {
            imgMap.invalidateSize();
        }, 250);

        reset_insert_tools();
        $('#mapNotification').slideUp();        
    };

    if (insertSlideshow) {
        alert("Insert Slideshow");
        $('#mapNotification').slideUp();
    }
});

$('#editFormModal-Slideshow').modal('show');