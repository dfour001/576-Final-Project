var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [1840, 2020],
    step: 5,
    connect: true,
    range: {
        'min': 1840,
        'max': 2020
    }
});

slider.noUiSlider.on('update', function() {
    let values = slider.noUiSlider.get();
    $('#lblStartYear').html(Math.round(values[0]));
    $('#lblEndYear').html(Math.round(values[1]));
})

slider.noUiSlider.on('set', function() {
    // The code to run to filter the points by year will go here
    let values = slider.noUiSlider.get();
    let startDate = values[0];
    let endDate = values[1];
    add_image_markers(startDate, endDate);
    add_slideshow_markers(startDate, endDate);
})