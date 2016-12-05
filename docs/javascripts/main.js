$(document).ready(function() {
    $('a[data-imagelightbox="a"]').imageLightbox({
        activity: true
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

    var gallery = $('a[data-imagelightbox="h"]').imageLightbox({
        arrows: true
    });
    $('.trigger-lightbox').on('click', function () {
        gallery.startImageLightbox();
    });

    var instanceI =  $('a[data-imagelightbox="i"]').imageLightbox({
        arrows: true
    });
    $(".add-image").on('click', function(){
        var adding_ul = $("#dynamically_adding");
        var li = $('<li></li>').appendTo( adding_ul );
        var a = $("<a></a>")
            .attr('data-imagelightbox',"i")
            .attr('href', "images/demo4.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/thumb4.jpg")
            .appendTo( a );
        // dynamically adding
        instanceI.addToImageLightbox( $("a[data-imagelightbox='i']") );
    });

    $('a[data-imagelightbox="j"]').imageLightbox({
        lockBody: true
    });

    $('a[data-imagelightbox="k"]').imageLightbox();
    $(document)
        .on("start.ilb2", function () {
            console.log("start.ilb2");
        })
        .on("quit.ilb2", function () {
            console.log("quit.ilb2");
        })
        .on("previous.ilb2", function () {
            console.log("previous.ilb2");
        })
        .on("next.ilb2", function () {
            console.log("next.ilb2");
        });
});
