function load_slideshow(url) {
    $.getJSON(url, function (r) {
        console.log(r);
        let slides = r.slides;
        let titlePage = r.titlePage;
        start_slideshow(titlePage, slides);
    });
}

function start_slideshow(titlePage, slides) {
    let curSlide = -1; // Index of slide currently being displayed
    let slideCount = slides.length; // Total number of slides

    let curText = 0; // Index of slide text currently being displayed
    let curTextCount = slides[0].text.length; // Total count of slide texts

    let slideshow = $('.slideshow');
    let slide = $('#display');
    let img = $('#img');
    let btnNext = $('#btnNext');


    // Set event listeners
    $('#btnNext').on('click', function () {
        // If title slide is displayed (curSlide == -1), set curSlide to 0
        // Else increment the curText variable.
        if (curSlide == -1) {
            next_slide();
            return
        } else {
            curText++;
        };

        if (curSlide < slideCount) {
            // If more text, change text, but not slide
            if (curText < curTextCount) {
                let textObj = $('#text');
                let text = slides[curSlide].text[curText];
                update_text(textObj, text);
            } else { // If no more text, change to next slide
                if (curSlide + 1 < slideCount) {
                    next_slide();
                };
            };

            if (curSlide + 1 == slideCount && curText + 1 == curTextCount) {
                $('#btnNext').hide();
            }

        };
    });

    // Display first slide
    $('#title').html(titlePage.title);
    $('#text').html(titlePage.text);
    $('#img').css("background-image", "url(" + titlePage.images[0].url + ")");


    function next_slide() {
        // Increment slide
        curSlide++;

        // Animate slide out
        slide_out();

        // Update slide data and animate slide in
        setTimeout(function () {
            update_slide_data(curSlide);
        }, 250);


        // Animate slide in
        setTimeout(function () {
            slide_in();
        }, 500);
    }
    // Load next slide
    function update_slide_data(curSlide) {
        curText = 0;
        curTextCount = slides[curSlide].text.length;
        
        $('#slideNum').html(curSlide + 1);
        update_text($('#title'), slides[curSlide].title);
        update_text($('#text'), slides[curSlide].text[curText]);
        $('#img').css("background-image", "url(" + slides[curSlide].images[0].url + ")");

        // Move the slide from off screen above the window
        // to off screen below the window.  The slideIn class
        // moves the slide to the staging ground below the window.
        slideshow.addClass('slideIn');
        slideshow.removeClass('slideOut');
    }

    // Slide animations
    function slide_out() {
        // Remove the classes that display the slide and
        // add the class that moves it off the top of the screen
        slideshow.removeClass(['slideShow', 'slideIn']);
        slideshow.addClass('slideOut');
        
        // Remove any image animations
        img.removeClass(['zoomIn', 'zoomOut']);

        // Hide the next arrow
        btnNext.addClass('arrowHide');
    }

    function slide_in() {
        // Animate the slide into the view from below the window
        slideshow.removeClass('slideIn');
        slideshow.addClass('slideShow');
        
        // If images have an animation option, the animation class
        // will be added here:
        if (slides[curSlide].images[0].animation == 'zoomIn') {
            img.addClass('zoomIn');
        };
        
        if (slides[curSlide].images[0].animation == 'zoomOut') {
            img.addClass('zoomOut');
        }
        
        // Show the next arrow by removing the arrowHide class
        setTimeout(function() {
            btnNext.removeClass('arrowHide');
        }, 1000);
    }


    function update_text(obj, txt) {
        obj.addClass('textHide');
        if (txt != '') {
            setTimeout(function () {
                obj.html(txt);
                obj.removeClass('textHide');
            }, 750);
        };
    }
}




load_slideshow('slideshows/Capitol/slideshows/capitol.json');
