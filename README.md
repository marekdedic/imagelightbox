imagelightbox
=============

[![npm version](https://badge.fury.io/js/imagelightbox.svg)](https://badge.fury.io/js/imagelightbox)
[![Build Status](https://secure.travis-ci.org/rejas/imagelightbox.png?branch=master)](http://travis-ci.org/rejas/imagelightbox)
[![Greenkeeper badge](https://badges.greenkeeper.io/rejas/imagelightbox.svg)](https://greenkeeper.io/)

Image Lightbox, Responsive and Touch‑friendly.

This is a fork of the lightbox plugin created by [Osvaldas Valutis](http://osvaldas.info/image-lightbox-responsive-touch-friendly/).

See most of the available options at the [Demo Page](http://rejas.github.io/imagelightbox/)

## Requirements and Browser support

* jQuery 1.12 (earlier version not tested), feel free to use jQuery v2 or v3 if you don't need to support older browsers
* All major desktop browsers and versions as well as mobile browsers on Android, iOS and Windows Phone.
* IE8 is NOT supported

## How to use

````javascript
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>
<script>
    $( function()
    {
        $( selector ).imageLightbox();
    });
</script>
````

## Options

The list of options and their default values is:

````javascript
$( selector ).imageLightbox({
    selector:       'a[data-imagelightbox]', // string;
    id:             'imagelightbox',         // string;
    allowedTypes:   'png|jpg|jpeg|gif',      // string;          use empty string to allow any file type
    animationSpeed: 250,                     // integer;
    activity:       false,                   // bool;            show activity indicator
    arrows:         false,                   // bool;            show left/right arrows
    button:         false,                   // bool;            show close button
    caption:        false,                   // bool;            show captions
    enableKeyboard: true,                    // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
    history:        false,                   // bool;            enable image permalinks and history
    fullscreen:     false                    // bool;            enable fullscreen (enter/return key)
    gutter:         10,                      // integer;         window height less height of image as a percentage
    offsetY:        0,                       // integer;         vertical offset in terms of gutter
    navigation:     false,                   // bool;            show navigation
    overlay:        false,                   // bool;            display the lightbox as an overlay
    preloadNext:    true,                    // bool;            silently preload the next image
    quitOnEnd:      false,                   // bool;            quit after viewing the last image
    quitOnImgClick: false,                   // bool;            quit when the viewed image is clicked
    quitOnDocClick: true,                    // bool;            quit when anything but the viewed image is clicked
    quitOnEscKey:   true                     // bool;            quit when Esc key is pressed
});
````

## Starting lightbox with JavaScript call

imageLightBox can be started with *startImageLightbox()* JavaScript function call.

###### Example:

````javascript
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>
<script>
    $( function()
    {
        var gallery = $( selector ).imageLightbox();
        gallery.startImageLightbox();
    });
</script>
````
###### Example: Open specific image

````javascript
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>
<script>
    $( function()
    {
        var gallery = $( selector ).imageLightbox();
        var $image = $ ( image_selector );
        gallery.startImageLightbox( $image );
    });
</script>
````

## Adding captions to lightbox

add an "ilb2-caption" data-attribute to the element, fallback value is the alt-attribute of the thumbnail-image

````html
    <a data-imagelightbox="x" data-ilb2-caption="caption text"
        href="image.jpg">
        <img src="thumbnail.jpg" alt="fallback caption"/>
    </a>
````

## Fullscreen

Simply set the `fullscreen` option to true to enable the option. If the user's browser supports the fullscreen API, 
they can switch to fullscreen mode by pressing enter.

## Video

Video can be displayed in imagelightbox, by including a `data-ilb2-video` attribute in the link. This attribute should contain a JSON-encoded list of parameters as they would be in an HTML5 video tag. For multiple video sources, the `sources` field can be added, containing a list of similarily encoded HTML5 source tags.

````html
    <a data-ilb2-video='{"controls":"controls", "autoplay":"autoplay", "sources":[{"src":"images/video.m4v", "type":"video/mp4"}]}' data-imagelightbox="x">
	    <img src="images/video-thumb.jpg">
    </a>
````

## Hooks

Image Lightbox now triggers unique events upon start, finish, and when either the next or previous image is requested.
These events are, respectively, "start.ilb2", "quit.ilb2", "loaded.ilb2", "next.ilb2", and "previous.ilb2".

Usage example:
````javascript
 $(document)
    .on("start.ilb2", function (_, e) {
    console.log("Image Lightbox has started on element: ");
    console.log(e);
    })
    .on("next.ilb2", function (_, e) {
    console.log("Next image: ");
    console.log(e);
    })
    .on("previous.ilb2", function (_, e) {
    console.log("Previous image: ");
    console.log(e);
    })
    .on("quit.ilb2", function () {
    console.log("Image Lightbox has quit.");
    });
````

## Using multiple sets

As of commit bf2b4db, imageLightbox supports "sets."
A set is defined by the links with a common value for the "data-imagelightbox" attribute.

For example:

````html
    <a data-imagelightbox="a"
        href="image_1.jpg">
        <img src="thumbnail_1.jpg" alt="caption"/>
    </a>
    <a data-imagelightbox="a"
        href="image_2.jpg">
        <img src="thumbnail_2.jpg" alt="caption"/>
    </a>

    <a data-imagelightbox="b"
        href="image_3.jpg">
        <img src="thumbnail_3.jpg" alt="caption"/>
    </a>
    <a data-imagelightbox="b"
        href="image_4.jpg">
        <img src="thumbnail_4.jpg" alt="caption"/>
    </a>
````
When the user clicks any of the thumbnails with a data-imagelightbox value of "a", only those images will appear in the 
lightbox. The same is true when clicking an image with data-imagelightbox value of "b" and any other.

If you want unlimited gallerys call this snippet (for example: https://jsfiddle.net/7ow26fcg/):

<i>(Используйте этот код вызова lightbox, если у вас на странице несколько галерей, где у каждой галереи уникальное 
значение атрибута data-imagelightbox. Например data-imagelightbox="gallery_1", data-imagelightbox="gallery_2" и т.д.)</i>

````javascript
<script>
    var attrs = {};
    var classes = $("a[data-imagelightbox]").map(function(indx, element){
      var key = $(element).attr("data-imagelightbox");
      attrs[key] = true;
      return attrs;
    });
    var attrsName = Object.keys(attrs);

    attrsName.forEach(function(entry) {
        $( "[data-imagelightbox='"+entry+"']" ).imageLightbox({
            overlay: true
        });
    });
</script>
````

In order to "capture" all possible sets on a give webpage, it is necessary to apply imageLightbox to 
"a[data-imagelightbox]"; that is, without specifying a particular data-imagelightbox attribute value.

## Adding images dynamically to lightbox

imageLightBox allows adding more images dynamically at runtime

###### Example:

````javascript
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>
<script>
    $( function()
    {
        var gallery = $( selector ).imageLightbox();
        var image = $( '<img />' );
        gallery.addToImageLightbox( image );
    });
</script>
````

## Permalinks & History

When history is enabled, upon clicking on an image, the query field `imageLightboxIndex=X` is added to the URL, where `X` is the index of the currently opened image. This means that such an URL can be copied and used as a permanent link to that particular image. When somebody opens the URL, the lightbox will be open on the image in question. This also works with multiple sets, where an aditional query field `imageLightboxSet=Y` is used to distinguish between the sets in one page.

In some cases, this could lead to a different image being opened, for example if new images have been added to the set, or if the order of the images has changed. To solve this issue, whenever the HTML attribute `data-ilb2-id=X` is present in the image tag, this value is used instead of the image index (this means this id has to be different for each image and mustn't change over time).

###### Example:

```javascript
<script src="jquery.js"></script>
<script src="imagelightbox.js"></script>

<a href="image1.jpg" data-imagelightbox="images" data-ilb2-id="img1"><img src="thumb1.jpg"></a>
<a href="image2.jpg" data-imagelightbox="images" data-ilb2-id="img2"><img src="thumb2.jpg"></a>
<a href="image3.jpg" data-imagelightbox="images" data-ilb2-id="img3"><img src="thumb3.jpg"></a>

<script>
    $( function()
    {
        $('a[data-imagelightbox="images"]').imageLightbox({
            history: true
        });
    });
</script>
```

If you want a dynamically added image to be opened after the page load, you have to call `gallery.openHistory()` on the ImageLightbox object yourself after adding the image.

## Changelog

You can find all notable changes to this project in the [CHANGELOG.md](CHANGELOG.md).


## See also

Used by https://wordpress.org/plugins/skaut-google-drive-gallery/
