import jQuery from "jquery";

declare const TEST: boolean | undefined;
const isTest: boolean = typeof TEST !== "undefined" ? TEST : false;

jQuery(($) => {
  $('a[data-imagelightbox="a"]').imageLightbox({
    activity: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="allowedtypes"]').imageLightbox({
    allowedTypes: "gif",
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="b"]').imageLightbox({
    overlay: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="c"]').imageLightbox({
    button: true,
    quitOnDocClick: false,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="d"]').imageLightbox({
    caption: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="e"]').imageLightbox({
    navigation: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="f"]').imageLightbox({
    arrows: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="quit"]').imageLightbox({
    quitOnEnd: true,
    quitOnImgClick: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="fullscreen"]').imageLightbox({
    fullscreen: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="g"]').imageLightbox({
    activity: true,
    arrows: true,
    button: true,
    caption: true,
    navigation: true,
    overlay: true,
    quitOnDocClick: false,
    ...(isTest && { animationSpeed: 0 }),
  });

  /**
   *
   */
  const gallery = $('a[data-imagelightbox="h"]').imageLightbox({
    arrows: true,
    ...(isTest && { animationSpeed: 0 }),
  });
  $(".trigger_lightbox").on("click", () => {
    gallery.startImageLightbox();
  });

  /**
   * dynamically adding more images
   */
  const instanceI = $('a[data-imagelightbox="i"]').imageLightbox({
    arrows: true,
    ...(isTest && { animationSpeed: 0 }),
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
    arrows: true,
    history: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="k"]').imageLightbox({
    arrows: true,
    history: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  $('a[data-imagelightbox="video"]').imageLightbox({
    activity: true,
    arrows: true,
    overlay: true,
    ...(isTest && { animationSpeed: 0 }),
  });

  /**
   *
   */
  $('a[data-imagelightbox="events"]').imageLightbox({
    ...(isTest && { animationSpeed: 0 }),
  });
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
