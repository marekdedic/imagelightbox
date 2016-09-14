imagelightbox
=============

[![Build Status](https://secure.travis-ci.org/rejas/imagelightbox.png?branch=master)](http://travis-ci.org/rejas/imagelightbox)
[![devDependency Status](https://david-dm.org/rejas/imagelightbox/dev-status.svg)](https://david-dm.org/rejas/imagelightbox#info=devDependencies)

Image Lightbox, Responsive and Touch‑friendly.

This is a fork of the lightbox plugin created by [Osvaldas Valutis](http://osvaldas.info/image-lightbox-responsive-touch-friendly/).

See most of the available options at the [Demo Page](http://rejas.github.io/imagelightbox/)

## Requirements and Browser support

* jQuery 1.12 (earlier version not tested), feel free to use jQuery v2 or v3 if you don't need to support older browsers
* All mayor desktop browsers and versions as well as mobile browsers on Android, iOS and Windows Phone. 
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
    navigation:     false,                   // bool;            show navigation
    overlay:        false,                   // bool;            display the lightbox as an overlay
    preloadNext:    true,                    // bool;            silently preload the next image
    quitOnEnd:      false,                   // bool;            quit after viewing the last image
    quitOnImgClick: false,                   // bool;            quit when the viewed image is clicked
    quitOnDocClick: true,                    // bool;            quit when anything but the viewed image is clicked
    quitOnEscKey:   true,                    // bool;            quit when Esc key is pressed
    onStart:        false,                   // function/bool;   calls function when the lightbox starts
    onEnd:          false,                   // function/bool;   calls function when the lightbox quits
    onLoadStart:    false,                   // function/bool;   calls function when the image load begins
    onLoadEnd:      false                    // function/bool;   calls function when the image finishes loading
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

* 0.5.2 Updates to demo page, cleanups
* 0.5.1 Fix startImageLightbox
* 0.5.0 Support jQuery3
