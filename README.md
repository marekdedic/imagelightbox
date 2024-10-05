# imagelightbox

[![NPM Version](https://img.shields.io/npm/v/imagelightbox?logo=npm)](https://www.npmjs.com/package/imagelightbox)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/marekdedic/imagelightbox/CI.yml?branch=master&logo=github)](https://github.com/marekdedic/imagelightbox/actions)
[![Coveralls](https://img.shields.io/coverallsCoverage/github/marekdedic/imagelightbox?branch=master&logo=coveralls)](https://coveralls.io/github/marekdedic/imagelightbox)
[![NPM Downloads](https://img.shields.io/npm/dm/imagelightbox?logo=npm)](https://www.npmjs.com/package/imagelightbox)
[![NPM License](https://img.shields.io/npm/l/imagelightbox)](https://github.com/marekdedic/imagelightbox/blob/master/LICENSE)
[![RelativeCI native bundle](https://badges.relative-ci.com/badges/mqvYqDg4xPM2gcxviDAG?branch=master&style=flat)](https://app.relative-ci.com/projects/mqvYqDg4xPM2gcxviDAG)
[![RelativeCI jquery bundle](https://badges.relative-ci.com/badges/99MW2QOdJusoWoLHsKkr?branch=master&style=flat)](https://app.relative-ci.com/projects/99MW2QOdJusoWoLHsKkr)

Image Lightbox, Responsive and Touch‑friendly.

This is a fork of the lightbox plugin created by [Osvaldas Valutis](http://osvaldas.info/image-lightbox-responsive-touch-friendly/).

See most of the available options at the [Demo Page](http://marekdedic.github.io/imagelightbox/)

## Requirements and Browser support

* All major desktop browsers and versions as well as mobile browsers on Android and iOS.

## How to install

```sh
$ npm install --save imagelightbox
```

After that include the `dist/imagelightbox.css` and `dist/imagelightbox.umd.cjs` files. Alternatively, you can use the `dist/imagelightbox.js` file if you are using ES6 modules.

If you prefer to use jQuery, there are also jQuery versions available in `dist/imagelightbox.jquery.umd.cjs` or `dist/imagelightbox.jquery.js`. These mostly adapt the interface of the library to work with jQuery types and emit jQuery events. These are here mostly for legacy reasons and their use is discouraged.

## How to use

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="node_modules/imagelightbox/dist/imagelightbox.css">
        <script src="node_modules/imagelightbox/dist/imagelightbox.umd.cjs"></script>
        <script>
            new Imagelightbox(
                document.querySelectorAll('a[data-imagelightbox="xyz"]'),
            )
        </script>
    </head>
    <body>
        <a data-imagelightbox="xyz" href="image_1.jpg">
            <img src="thumbnail_1.jpg" alt="Caption 1"/>
        </a>
        <a data-imagelightbox="xyz" href="image_2.jpg">
            <img src="thumbnail_2.jpg" alt="Caption 2"/>
        </a>
    </body>
</html>
```

## Options

You can pass an object with options to the `ImageLightbox` constructor as a second argument. The available options are:

| Option           | Type      | Default value         | Description |
| ---------------- | --------- | --------------------- | --- |
| `activity`       | `boolean` | `false`               | Whether to show an activity indicator when loading or changing the images |
| `allowedTypes`   | `string`  | `png\|jpg\|jpeg\|gif` | A list of allowed file types. Use an empty string to allow any type. |
| `animationSpeed` | `number`  | `250`                 | The duration (in milliseconds) of all animations |
| `arrows`         | `boolean` | `false`               | Whether to show navigation arrows |
| `button`         | `boolean` | `false`               | Whether to show a close button |
| `caption`        | `boolean` | `false`               | Whether to show image captions, if they are available |
| `enableKeyboard` | `boolean` | `true`                | Whether to enable keyboard navigation (previous/next with arrows, Escape to exit, Enter for fullscreen) |
| `history`        | `boolean` | `false`               | Whether to save the current lightbox state to the browser history and add perma-linkable URLs |
| `fullscreen`     | `boolean` | `false`               | Whether to enable the availability to show the lightbox in fullscreen mode |
| `gutter`         | `number` | `10`                   | The minimum amount of free space (in % relative to the window size) to always keep around the image |
| `navigation`     | `boolean` | `false`               | Whether to show a navigation (panel with clickable dots for each image) |
| `overlay`        | `boolean` | `false`               | Whether to show a dark page overlay under the image |
| `preloadNext`    | `boolean` | `true`                | Whether to start preloading the next image upon navigation |
| `quitOnEnd`      | `boolean` | `false`               | Whether to close the lightbox when navigation past the last image. Alternatively, the lightbox just loops to the first image. |
| `quitOnImgClick` | `boolean` | `false`               | Whether to close the lightbox when the image is clicked. Alternatively, the previous/next image is shown based on the position of the click. Never quits on touch devices. |
| `quitOnDocClick` | `boolean` | `true`                | Whether to close the lightbox when clicking outside of the image. |
| `quitOnEscKey`   | `boolean` | `true`                | Whether to close the lightbox when the Escape key is pressed. Requires the `enableKeyboard` option to be `true`. |

## Opening the lightbox with a JavaScript call

The lightbox can be opened with the `open()` method call.

###### Example:

```js
const gallery = new ImageLightbox(
    document.querySelectorAll('a[data-imagelightbox="xyz"]'),
);
gallery.open();
```
###### Example: Open specific image

```js
const gallery = new ImageLightbox(
    document.querySelectorAll('a[data-imagelightbox="xyz"]'),
);
gallery.open(
    document.querySelectorAll('a[href="image_1.jpg"]').item(0),
);
```

## Adding captions to lightbox

To use captions, add an "ilb2-caption" data-attribute to the element, or as a fallback value, the `alt` attribute of the thumbnail image is used.

```html
<a data-imagelightbox="xyz" data-ilb2-caption="caption text" href="image.jpg">
    <img src="thumbnail.jpg" alt="Fallback caption" />
</a>
```

## Fullscreen

To enable fullscreen, set the `fullscreen` option to true. The user can then launch the fullscreen view by pressing the Enter key.

## Video

Videos can be displayed in lightbox by including a `data-ilb2-video` attribute in the link. This attribute should contain a JSON-encoded list of parameters as they would be in an HTML5 video tag. For multiple video sources, the `sources` field can be added, containing a list of similarily encoded HTML5 source tags.

```html
<a data-imagelightbox="xyz" data-ilb2-video='{"controls": "controls", "autoplay": "autoplay", "sources": [{"src": "images/video.m4v", "type": "video/mp4"}], "width": 1920, "height": 1080}'>
    <img src="images/video-thumb.jpg">
</a>
```

## Custom events

The lightbox dispatches custom events upon opening, closing, image loading, and when either the next or previous image is requested (beware that these are not dispatched when the image is changed in other ways, such as the navigation panel).
These events are, respectively, `ilb:start`, `ilb:quit`, `ilb:loaded`, `ilb:next`, and `ilb:previous`.

Usage example:
```js
document.addEventListener("ilb:start", (e) => {
    console.log("The lightbox was started with element: ");
    console.log(e.target);
});
document.addEventListener("ilb:quit", () => {
    console.log("The lightbox was closed.");
});
document.addEventListener("ilb:loaded", () => {
    console.log("A new image was loaded");
});
document.addEventListener("ilb:previous", (e) => {
    console.log("Previous image: ");
    console.log(e.target);
});
document.addEventListener("ilb:next", (e) => {
    console.log("Next image: ");
    console.log(e.target);
});
```

## Using multiple lighboxes

Imagelightbox supports multiple independent image sets on the same page, each initialized indepently.

For example:

```html
<a data-imagelightbox="a" href="image_1.jpg">
    <img src="thumbnail_1.jpg" alt="caption"/>
</a>
<a data-imagelightbox="a" href="image_2.jpg">
    <img src="thumbnail_2.jpg" alt="caption"/>
</a>

<a data-imagelightbox="b" href="image_3.jpg">
    <img src="thumbnail_3.jpg" alt="caption"/>
</a>
<a data-imagelightbox="b" href="image_4.jpg">
    <img src="thumbnail_4.jpg" alt="caption"/>
</a>
```
When the user clicks any of the thumbnails with a data-imagelightbox value of "a", only those images will appear in the 
lightbox. The same is true when clicking an image with data-imagelightbox value of "b" and any other.

## Adding images dynamically to lightbox

More images can be added to the lightbox after it has been initialized.

###### Example:

```js
const lightbox = new Imagelightbox(
    document.querySelectorAll('a[data-imagelightbox="xyz"]'),
)
const newAnchor = document.createElement("a");
newAnchor.dataset.imagelightbox = "xyz";
newAnchor.href = "images/demo4.jpg";

const newImg = document.createElement("img");
newImg.src = "images/thumb4.jpg";
newAnchor.appendChild(newImg);

lightbox.addImages([newAnchor]);
```

## Permalinks & History

When history is enabled, upon clicking on an image, the query field `imageLightboxIndex=X` is added to the URL, where `X` is the index of the currently opened image. This means that such an URL can be copied and used as a permanent link to that particular image. When somebody opens the URL, the lightbox will be open on the image in question. This also works with multiple sets, where an aditional query field `imageLightboxSet=Y` is used to distinguish between the sets in one page.

In some cases, this could lead to a different image being opened, for example if new images have been added to the set, or if the order of the images has changed. To solve this issue, whenever the HTML attribute `data-ilb2-id=X` is present in the image tag, this value is used instead of the image index (this means this id has to be different for each image and mustn't change over time to keep links working).

###### Example:

```html
<a href="image1.jpg" data-imagelightbox="images" data-ilb2-id="img1">
    <img src="thumb1.jpg">
</a>
<a href="image2.jpg" data-imagelightbox="images" data-ilb2-id="img2">
    <img src="thumb2.jpg">
</a>
<a href="image3.jpg" data-imagelightbox="images" data-ilb2-id="img3">
    <img src="thumb3.jpg">
</a>

<script>
    new Imagelightbox(
        document.querySelectorAll('a[data-imagelightbox="images"]'),
        {
            history: true,
        },
    )
</script>
```

If you want a dynamically add images after the page has loaded and still support direct links to them, you have to call `lightbox.openHistory()` manually on the lightbox object yourself after adding the image.

## Changelog

You can find all notable changes to this project in the [GitHub releases](https://github.com/marekdedic/imagelightbox/releases).

## See also

Used by https://wordpress.org/plugins/skaut-google-drive-gallery/
