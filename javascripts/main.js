$(document).ready(function() {

    $('a[data-imagelightbox="a"]').imageLightbox({
        activity: true
    });

    $('a[data-imagelightbox="b"]').imageLightbox({
        activity: true,
        overlay: true
    });

    $('a[data-imagelightbox="c"]').imageLightbox({
        activity: true,
        button: true
    });

    $('a[data-imagelightbox="d"]').imageLightbox({
        activity: true,
        caption: true
    });

    $('a[data-imagelightbox="e"]').imageLightbox({
        activity: true,
        navigation: true,
        selector: 'a[data-imagelightbox="e"]'
    });

    $('a[data-imagelightbox="f"]').imageLightbox({
        activity: true,
        button: true,
        caption: true,
        navigation: true,
        overlay: true,
        selector: 'a[data-imagelightbox="f"]'
    });

    var gallery = $('a[data-imagelightbox="g"]').imageLightbox();
    $('.trigger-button').on('click', function () {
        gallery.startImageLightbox();
    });

    $('a[data-imagelightbox="h"]').imageLightbox({
        activity: true,
        arrows: true
    });

    var instanceI =  $('a[data-imagelightbox="i"]').imageLightbox();
    $("#addimage").on('click', function(){
        var adding_ul = $("#dynamically_adding");
        var li = $('<li></li>').appendTo( adding_ul );
        var a = $("<a></a>")
            .attr('data-imagelightbox',"add")
            .attr('href', "http://osvaldas.info/examples/image-lightbox-responsive-touch-friendly/full/4.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/4.jpg")
            .attr("alt", "Sun, grass and hydrant")
            .appendTo( a );
        li = $('<li></li>').appendTo( adding_ul );
        a = $("<a></a>")
            .attr('data-imagelightbox',"add")
            .attr('href', "http://osvaldas.info/examples/image-lightbox-responsive-touch-friendly/full/5.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/5.jpg")
            .attr("alt", "Sun, grass and hydrant")
            .appendTo( a );
        a = $("<a></a>")
            .attr('data-imagelightbox',"add")
            .attr('href', "http://osvaldas.info/examples/image-lightbox-responsive-touch-friendly/full/6.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/6.jpg")
            .attr("alt", "Sun, grass and hydrant")
            .appendTo( a );

        // dynamically adding
        instanceI.addImageLightbox( $("a[data-imagelightbox='add']") );
    });
});