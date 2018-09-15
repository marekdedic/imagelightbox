$(document).ready(function() {
    $('a[data-imagelightbox="a"]').imageLightbox({
        activity: true
    });

    $('a[data-imagelightbox="allowedtypes"]').imageLightbox({
        allowedTypes: "gif"
    });

    $('a[data-imagelightbox="b"]').imageLightbox({
        overlay: true
    });

    $('a[data-imagelightbox="c"]').imageLightbox({
        button: true,
        quitOnDocClick: false
    });

    $('a[data-imagelightbox="d"]').imageLightbox({
        caption: true
    });

    $('a[data-imagelightbox="e"]').imageLightbox({
        navigation: true,
        selector: 'a[data-imagelightbox="e"]'
    });

    $('a[data-imagelightbox="f"]').imageLightbox({
        arrows: true
    });

    $('a[data-imagelightbox="fullscreen"]').imageLightbox({
        fullscreen: true
    });

    $('a[data-imagelightbox="g"]').imageLightbox({
        activity: true,
        arrows: true,
        button: true,
        caption: true,
        navigation: true,
        overlay: true,
        quitOnDocClick: false,
        selector: 'a[data-imagelightbox="f"]'
    });

    /**
     *
     */
    var gallery = $('a[data-imagelightbox="h"]').imageLightbox({
        arrows: true
    });
    $('.trigger_lightbox').on('click', function () {
        gallery.startImageLightbox();
    });

    /**
     * dynamically adding more images
     */
    var instanceI =  $('a[data-imagelightbox="i"]').imageLightbox({
        arrows: true
    });
    $(".add_image").on('click', function () {
        var adding_ul = $(".demo_dynamic");
        var li = $('<li></li>').appendTo( adding_ul );
        var a = $("<a></a>")
            .attr('data-imagelightbox',"i")
            .attr('href', "images/demo4.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/thumb4.jpg")
            .appendTo( a );
        instanceI.addToImageLightbox( $("a[data-imagelightbox='i']") );
    });

    $('a[data-imagelightbox="j"]').imageLightbox({
        history: true
    });

    $('a[data-imagelightbox="k"]').imageLightbox({
        history: true
    });

    $('a[data-imagelightbox="video"]').imageLightbox({
        activity: true,
        arrows: true,
        overlay: true
    });

    /**
     *
     */
    $('a[data-imagelightbox="events"]').imageLightbox();
    $(document)
        .on("start.ilb2", function () {
            console.log("start.ilb2");
        })
        .on("quit.ilb2", function () {
            console.log("quit.ilb2");
        })
        .on("loaded.ilb2", function () {
            console.log("loaded.ilb2");
        })
        .on("previous.ilb2", function () {
            console.log("previous.ilb2");
        })
        .on("next.ilb2", function () {
            console.log("next.ilb2");
        });
});
