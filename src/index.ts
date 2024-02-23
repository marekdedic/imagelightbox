import $ from "jquery";

$(document).ready(() => {
    $('a[data-imagelightbox="a"]').imageLightbox({
        activity: true,
    });

    $('a[data-imagelightbox="allowedtypes"]').imageLightbox({
        allowedTypes: "gif",
    });

    $('a[data-imagelightbox="b"]').imageLightbox({
        overlay: true,
    });

    $('a[data-imagelightbox="c"]').imageLightbox({
        button: true,
        quitOnDocClick: false,
    });

    $('a[data-imagelightbox="d"]').imageLightbox({
        caption: true,
    });

    $('a[data-imagelightbox="e"]').imageLightbox({
        navigation: true,
        selector: 'a[data-imagelightbox="e"]',
    });

    $('a[data-imagelightbox="f"]').imageLightbox({
        arrows: true,
    });

    $('a[data-imagelightbox="fullscreen"]').imageLightbox({
        fullscreen: true,
    });

    $('a[data-imagelightbox="g"]').imageLightbox({
        activity: true,
        arrows: true,
        button: true,
        caption: true,
        navigation: true,
        overlay: true,
        quitOnDocClick: false,
        selector: 'a[data-imagelightbox="f"]',
    });

    /**
     *
     */
    const gallery = $('a[data-imagelightbox="h"]').imageLightbox({
        arrows: true,
    });
    $(".trigger_lightbox").on("click", () => {
        gallery.startImageLightbox();
    });

    /**
     * dynamically adding more images
     */
    const instanceI = $('a[data-imagelightbox="i"]').imageLightbox({
        arrows: true,
    });
    $(".add_image").on("click", () => {
        const addingUl = $(".demo_dynamic");
        const li = $("<li></li>").appendTo(addingUl);
        const a = $("<a></a>")
            .attr("data-imagelightbox", "i")
            .attr("href", "images/demo4.jpg")
            .appendTo(li);
        $("<img />").attr("src", "images/thumb4.jpg").appendTo(a);
        instanceI.addToImageLightbox($("a[data-imagelightbox='i']"));
    });

    $('a[data-imagelightbox="j"]').imageLightbox({
        history: true,
    });

    $('a[data-imagelightbox="k"]').imageLightbox({
        history: true,
    });

    $('a[data-imagelightbox="video"]').imageLightbox({
        activity: true,
        arrows: true,
        overlay: true,
    });

    /**
     *
     */
    $('a[data-imagelightbox="events"]').imageLightbox();
    $(document)
        .on("start.ilb2", (_, e) => {
            console.log("start.ilb2");
            console.log(e);
        })
        .on("quit.ilb2", () => {
            console.log("quit.ilb2");
        })
        .on("loaded.ilb2", () => {
            console.log("loaded.ilb2");
        })
        .on("previous.ilb2", (_, e) => {
            console.log("previous.ilb2");
            console.log(e);
        })
        .on("next.ilb2", (_, e) => {
            console.log("next.ilb2");
            console.log(e);
        });
});
