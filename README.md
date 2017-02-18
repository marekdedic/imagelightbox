imagelightbox
=============

[![Greenkeeper badge](https://badges.greenkeeper.io/rejas/imagelightbox.svg)](https://greenkeeper.io/)
[![Build Status](https://secure.travis-ci.org/rejas/imagelightbox.png?branch=master)](http://travis-ci.org/rejas/imagelightbox)

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
    allowedTypes:   'png|jpg|jpeg||gif',     // string; * NOT WORKING ATM *
    animationSpeed: 250,                     // integer;
    activity:       false,                   // bool;            show activity indicator
    arrows:         false,                   // bool;            show left/right arrows
    button:         false,                   // bool;            show close button
    caption:        false,                   // bool;            show captions
    enableKeyboard: true,                    // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
    lockBody:       false,                   // bool;            disables body scrolling when lightbox is open
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
## Adding captions to lightbox

add an "ilb2-caption" data-attribute to the element, fallback value is the alt-attribute of the thumbnail-image

````html
    <a data-imagelightbox="x" data-ilb2-caption="caption text"
        href="image.jpg">
        <img src="thumbnail.jpg" alt="fallback caption"/>
    </a>
````

## Hooks

Image Lightbox now triggers unique events upon start, finish, and when either the next or previous image is requested.
These events are, respectively, "start.ilb2", "quit.ilb2", "loaded.ilb2", "next.ilb2", and "previous.ilb2".

Usage example:
````javascript
 $(document)
    .on("start.ilb2", function () {
    console.log("Image Lightbox has started.");
    })
    .on("next.ilb2", function () {
    console.log("Next image");
    })
    .on("previous.ilb2", function () {
    console.log("Previous image");
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
When the user clicks any of the thumbnails with a data-imagelightbox value of "a", only those images will appear in the lightbox. The same is true when clicking an image with data-imagelightbox value of "b" and any other.

If you want unlimited gallerys call this snippet (for example: https://jsfiddle.net/7ow26fcg/):

<i>(Используйте этот код вызова lightbox, если у вас на странице несколько галерей, где у каждой галереи уникальное значение атрибута data-imagelightbox. Например data-imagelightbox="gallery_1", data-imagelightbox="gallery_2" и т.д.)</i>

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

In order to "capture" all possible sets on a give webpage, it is necessary to apply imageLightbox to "a[data-imagelightbox]"; that is, without specifying a particular data-imagelightbox attribute value.

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

## Changelog

* 0.7.2 Fix #108
* 0.7.1 Fix #113
* 0.7.0 Replaced css-ids with classes (@rejas), added loaded.ilb2 event, optimize image sizing and misc. cleanups (@Paxperscientiam)
* 0.6.0 Replaced onStart/onEnd/onLoadStart/onLoadEnd with event hooks (@Paxperscientiam), added ui-tests
* 0.5.4 Add ilb2-caption option (@Paxperscientiam)
* 0.5.3 Add lockBody option (@Paxperscientiam)
* 0.5.2 Updates to demo page, cleanups
* 0.5.1 Fix startImageLightbox
* 0.5.0 Support jQuery3
