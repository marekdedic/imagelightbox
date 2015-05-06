imagelightbox
=============

Image Lightbox, Responsive and Touch‑friendly.

This is a fork of the lightbox plugin created by Osvaldas Valutis at http://osvaldas.info/image-lightbox-responsive-touch-friendly.

## Requirements and Browser support

* jQuery 1.11 (earlier version not tested), feel free to use jQuery v2 if you don't need to support older browsers
* All mayor desktop browsers and versions as well as mobile browsers on Android, iOS and Windows Phone

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
$( selector ).imageLightbox(
{
    selector:       'id="imagelightbox"',   // string;
    allowedTypes:   'png|jpg|jpeg||gif',    // string;
    animationSpeed: 250,                    // integer;
    preloadNext:    true,                   // bool;            silently preload the next image
    enableKeyboard: true,                   // bool;            enable keyboard shortcuts (arrows Left/Right and Esc)
    quitOnEnd:      false,                  // bool;            quit after viewing the last image
    quitOnImgClick: false,                  // bool;            quit when the viewed image is clicked
    quitOnDocClick: true,                   // bool;            quit when anything but the viewed image is clicked
    quitOnEscKey:   true,                   // bool;            quit when Esc key is pressed
    onStart:        false,                  // function/bool;   calls function when the lightbox starts
    onEnd:          false,                  // function/bool;   calls function when the lightbox quits
    onLoadStart:    false,                  // function/bool;   calls function when the image load begins
    onLoadEnd:      false                   // function/bool;   calls function when the image finishes loading
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
        gallery.addImageLightbox( image );
    });
</script>  
````
             