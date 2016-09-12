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
        button: true,
        caption: true,
        navigation: true,
        overlay: true,
        selector: 'a[data-imagelightbox="f"]'
    });

    var gallery = $('a[data-imagelightbox="h"]').imageLightbox();
    $('.trigger-button').on('click', function () {
        gallery.startImageLightbox();
    });

    var instanceI =  $('a[data-imagelightbox="i"]').imageLightbox();
    $("#addimage").on('click', function(){
        var adding_ul = $("#dynamically_adding");
        var li = $('<li></li>').appendTo( adding_ul );
        var a = $("<a></a>")
            .attr('data-imagelightbox',"add")
            .attr('href', "images/demo4.jpg")
            .appendTo( li );
        $("<img />")
            .attr("src", "images/thumb4.jpg")
            .appendTo( a );
        // dynamically adding
        instanceI.addToImageLightbox( $("a[data-imagelightbox='add']") );
    });
});