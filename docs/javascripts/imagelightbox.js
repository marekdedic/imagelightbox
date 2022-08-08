"use strict";
(function (factory) {
    // http://blog.npmjs.org/post/112712169830/making-your-jquery-plugin-work-better-with-npm
    // If there is a variable named module and it has an exports property,
    // then we're working in a Node-like environment. Use require to load
    // the jQuery object that the module system is using and pass it in.
    // Otherwise, we're working in a browser, so just pass in the global
    // jQuery object.
    factory((typeof module === 'object' && typeof module.exports === 'object') ? require('jquery') : jQuery, window, document);
}(function ($, window, document) {
    'use strict';
    // COMPONENTS //
    var $activityObject = $('<div/>')
        .attr('class', 'imagelightbox-loading')
        .append($('<div/>')), $arrowLeftObject = $('<button/>', {
        type: 'button',
        "class": 'imagelightbox-arrow imagelightbox-arrow-left'
    }), $arrowRightObject = $('<button/>', {
        type: 'button',
        "class": 'imagelightbox-arrow imagelightbox-arrow-right'
    }), $arrows = $arrowLeftObject.add($arrowRightObject), $captionObject = $('<div/>', {
        "class": 'imagelightbox-caption',
        html: '&nbsp;'
    }), $buttonObject = $('<button/>', {
        type: 'button',
        "class": 'imagelightbox-close'
    }), $overlayObject = $('<div/>', {
        "class": 'imagelightbox-overlay'
    }), $navItem = $('<a/>', {
        href: '#',
        "class": 'imagelightbox-navitem'
    }), $navObject = $('<div/>', {
        "class": 'imagelightbox-nav'
    }), $wrapper = $('<div/>', {
        "class": 'imagelightbox-wrapper'
    }), $body = $('body');
    var cssTransitionSupport = function () {
        var s = (document.body || document.documentElement).style;
        if (s.transition === '') {
            return '';
        }
        if (s.webkitTransition === '') {
            return '-webkit-';
        }
        if (s.MozTransition === '') {
            return '-moz-';
        }
        if (s.OTransition === '') {
            return '-o-';
        }
        return false;
    }, hasCssTransitionSupport = cssTransitionSupport() !== false, cssTransitionTranslateX = function (element, positionX, speed) {
        var options = {}, prefix = cssTransitionSupport() || '';
        options[prefix + 'transform'] = 'translateX(' + positionX + ') translateY(-50%)';
        options[prefix + 'transition'] = prefix + 'transform ' + speed.toString() + 's ease-in';
        element.css(options);
    }, hasTouch = ('ontouchstart' in window), navigator = window.navigator, hasPointers = navigator.pointerEnabled || navigator.msPointerEnabled, wasTouched = function (event) {
        if (hasTouch) {
            return true;
        }
        if (!hasPointers || typeof event === 'undefined' || typeof event.pointerType === 'undefined') {
            return false;
        }
        if (typeof event.MSPOINTER_TYPE_MOUSE !== 'undefined') {
            if (event.MSPOINTER_TYPE_MOUSE !== event.pointerType) {
                return true;
            }
        }
        else if (event.pointerType !== 'mouse') {
            return true;
        }
        return false;
    }, hasFullscreenSupport = !!(document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled), hasHistorySupport = !!(window.history && history.pushState);
    $.fn.imageLightbox = function (opts) {
        var currentIndex = 0;
        var image = $();
        var inProgress = false;
        var swipeDiff = 0;
        var target = $();
        var targetIndex = -1;
        var targets = $([]);
        var targetSet = '';
        var videos = [], options = $.extend({
            selector: 'a[data-imagelightbox]',
            id: 'imagelightbox',
            allowedTypes: 'png|jpg|jpeg|gif',
            animationSpeed: 250,
            activity: false,
            arrows: false,
            button: false,
            caption: false,
            enableKeyboard: true,
            history: false,
            fullscreen: false,
            gutter: 10,
            offsetY: 0,
            navigation: false,
            overlay: false,
            preloadNext: true,
            quitOnEnd: false,
            quitOnImgClick: false,
            quitOnDocClick: true,
            quitOnEscKey: true
        }, opts), _onStart = function () {
            if (options.arrows) {
                arrowsOn();
            }
            if (options.navigation) {
                navigationOn();
            }
            if (options.overlay) {
                overlayOn();
            }
            if (options.button) {
                closeButtonOn();
            }
            if (options.caption) {
                $wrapper.append($captionObject);
            }
        }, _onLoadStart = function () {
            if (options.activity) {
                activityIndicatorOn();
            }
            if (options.caption) {
                captionReset();
            }
        }, _onLoadEnd = function () {
            if (options.activity) {
                activityIndicatorOff();
            }
            if (options.arrows) {
                $arrows.css('display', 'block');
            }
        }, _addQueryField = function (query, key, value) {
            var newField = key + '=' + value;
            var newQuery = '?' + newField;
            if (query) {
                var keyRegex = new RegExp('([?&])' + key + '=[^&]*');
                if (keyRegex.exec(query) !== null) {
                    newQuery = query.replace(keyRegex, '$1' + newField);
                }
                else {
                    newQuery = query + '&' + newField;
                }
            }
            return newQuery;
        }, _pushToHistory = function () {
            if (!hasHistorySupport || !options.history) {
                return;
            }
            var newIndex = targets[targetIndex].dataset.ilb2Id;
            if (!newIndex) {
                newIndex = targetIndex.toString();
            }
            var newState = { imageLightboxIndex: newIndex, imageLightboxSet: '' };
            var set = targets[targetIndex].dataset.imagelightbox;
            if (set) {
                newState.imageLightboxSet = set;
            }
            var newQuery = _addQueryField(document.location.search, 'imageLightboxIndex', newIndex);
            if (set) {
                newQuery = _addQueryField(newQuery, 'imageLightboxSet', set);
            }
            window.history.pushState(newState, '', document.location.pathname + newQuery);
        }, _removeQueryField = function (query, key) {
            var newQuery = query;
            if (newQuery) {
                var keyRegex1 = new RegExp('\\?' + key + '=[^&]*');
                var keyRegex2 = new RegExp('&' + key + '=[^&]*');
                newQuery = newQuery.replace(keyRegex1, '?');
                newQuery = newQuery.replace(keyRegex2, '');
            }
            return newQuery;
        }, _pushQuitToHistory = function () {
            if (!hasHistorySupport || !options.history) {
                return;
            }
            var newQuery = _removeQueryField(document.location.search, 'imageLightboxIndex');
            newQuery = _removeQueryField(newQuery, 'imageLightboxSet');
            window.history.pushState({}, '', document.location.pathname + newQuery);
        }, _getQueryField = function (key) {
            var keyValuePair = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)').exec(document.location.search);
            if (!keyValuePair || !keyValuePair[2]) {
                return undefined;
            }
            return decodeURIComponent(keyValuePair[2].replace(/\+/g, ' '));
        }, _openHistory = function () {
            if (!hasHistorySupport || !options.history) {
                return;
            }
            var id = _getQueryField('imageLightboxIndex');
            if (!id) {
                return;
            }
            var element = targets.filter('[data-ilb2-id="' + id + '"]');
            if (element.length > 0) {
                targetIndex = targets.index(element);
            }
            else {
                targetIndex = parseInt(id);
                element = $(targets[targetIndex]);
            }
            var set = _getQueryField('imageLightboxSet');
            if (!element[0] || (!!set && set !== element[0].dataset.imagelightbox)) {
                return;
            }
            _openImageLightbox(element, true);
        }, _popHistory = function (event) {
            var newState = event.originalEvent.state;
            if (!newState) {
                _quitImageLightbox(true);
                return;
            }
            var newId = newState.imageLightboxIndex;
            if (newId === undefined) {
                _quitImageLightbox(true);
                return;
            }
            var element = targets.filter('[data-ilb2-id="' + newId + '"]');
            if (element.length === 0) {
                return;
            }
            var newIndex = targets.index(element);
            if (!element[0] || (newState.imageLightboxSet && newState.imageLightboxSet !== element[0].dataset.imagelightbox)) {
                return;
            }
            if (targetIndex < 0) {
                _openImageLightbox(element, true);
                return;
            }
            var direction = +1;
            if (newIndex > targetIndex) {
                direction = -1;
            }
            target = element;
            targetIndex = newIndex;
            _loadImage(direction);
        }, _previousTarget = function () {
            if (inProgress) {
                return;
            }
            targetIndex--;
            if (targetIndex < 0) {
                if (options.quitOnEnd === true) {
                    _quitImageLightbox();
                    return;
                }
                else {
                    targetIndex = targets.length - 1;
                }
            }
            target = targets.eq(targetIndex);
            _pushToHistory();
            $wrapper.trigger('previous.ilb2', target);
            _loadImage(+1);
        }, _nextTarget = function () {
            if (inProgress) {
                return;
            }
            targetIndex++;
            if (targetIndex >= targets.length) {
                if (options.quitOnEnd === true) {
                    _quitImageLightbox();
                    return;
                }
                else {
                    targetIndex = 0;
                }
            }
            _pushToHistory();
            target = targets.eq(targetIndex);
            $wrapper.trigger('next.ilb2', target);
            _loadImage(-1);
        }, activityIndicatorOn = function () {
            $wrapper.append($activityObject);
        }, activityIndicatorOff = function () {
            $('.imagelightbox-loading').remove();
        }, overlayOn = function () {
            $wrapper.append($overlayObject);
        }, closeButtonOn = function () {
            $buttonObject.appendTo($wrapper).on('click.ilb7', function () {
                _quitImageLightbox();
                return false;
            });
        }, captionReset = function () {
            $captionObject.css('opacity', '0');
            $captionObject.html('&nbsp;');
            if ($(target).data('ilb2-caption')) {
                $captionObject.css('opacity', '1');
                $captionObject.html($(target).data('ilb2-caption'));
            }
            else if ($(target).find('img').attr('alt')) {
                $captionObject.css('opacity', '1');
                $captionObject.html($(target).find('img').attr('alt'));
            }
        }, navigationOn = function () {
            if (!targets.length) {
                return;
            }
            for (var i = 0; i < targets.length; i++) {
                $navObject.append($navItem.clone());
            }
            var $navItems = $navObject.children('a');
            $navItems.eq(targets.index(target)).addClass('active');
            $wrapper.on('previous.ilb2 next.ilb2', function () {
                $navItems.removeClass('active').eq(targets.index(target)).addClass('active');
            });
            $wrapper.append($navObject);
            $navObject
                .on('click.ilb7 touchend.ilb7', function () {
                return false;
            })
                .on('click.ilb7 touchend.ilb7', 'a', function () {
                var $this = $(this);
                if (targets.eq($this.index()).attr('href') !== $('.imagelightbox').attr('src')) {
                    var tmpTarget = targets.eq($this.index());
                    if (tmpTarget.length) {
                        currentIndex = targets.index(target);
                        target = tmpTarget;
                        _loadImage($this.index() < currentIndex ? -1 : 1);
                    }
                }
                $this.addClass('active').siblings().removeClass('active');
            });
        }, arrowsOn = function () {
            $wrapper.append($arrows);
            $arrows.on('click.ilb7 touchend.ilb7', function (e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                if ($(this).hasClass('imagelightbox-arrow-left')) {
                    _previousTarget();
                }
                else {
                    _nextTarget();
                }
            });
        }, isTargetValid = function (element) {
            // eslint-disable-next-line
            return $(element).prop('tagName').toLowerCase() === 'a' && ((new RegExp('\.(' + options.allowedTypes + ')$', 'i')).test($(element).attr('href')) || $(element).data('ilb2Video'));
        }, _setImage = function () {
            if (!image.length) {
                return;
            }
            var captionHeight = options.caption ? $captionObject.outerHeight() : 0, screenWidth = $(window).width(), screenHeight = $(window).height() - captionHeight, gutterFactor = Math.abs(1 - options.gutter / 100);
            function setSizes(imageWidth, imageHeight) {
                if (imageWidth > screenWidth || imageHeight > screenHeight) {
                    var ratio = imageWidth / imageHeight > screenWidth / screenHeight ? imageWidth / screenWidth : imageHeight / screenHeight;
                    imageWidth /= ratio;
                    imageHeight /= ratio;
                }
                var cssHeight = imageHeight * gutterFactor, cssWidth = imageWidth * gutterFactor, cssLeft = ($(window).width() - cssWidth) / 2;
                image.css({
                    'width': cssWidth.toString() + 'px',
                    'height': cssHeight.toString() + 'px',
                    'left': cssLeft.toString() + 'px'
                });
            }
            var videoId = image.data('ilb2VideoId');
            var videoHasDimensions = false;
            $.each(videos, function (_, video) {
                if (videoId === this.i) {
                    setSizes(video.w, video.h);
                    videoHasDimensions = true;
                }
            });
            if (videoHasDimensions) {
                return;
            }
            var videoElement = image.get(0);
            if (videoElement.videoWidth !== undefined) {
                setSizes(videoElement.videoWidth, videoElement.videoHeight);
                return;
            }
            var tmpImage = new Image();
            tmpImage.src = image.attr('src');
            tmpImage.onload = function () {
                setSizes(tmpImage.width, tmpImage.height);
            };
        }, _loadImage = function (direction) {
            if (inProgress) {
                return;
            }
            if (image.length) {
                var params = { opacity: 0 };
                if (hasCssTransitionSupport) {
                    cssTransitionTranslateX(image, ((100 * direction) - swipeDiff).toString() + 'px', options.animationSpeed / 1000);
                }
                else {
                    params.left = (parseInt(image.css('left')) + (100 * direction)).toString() + 'px';
                }
                image.animate(params, options.animationSpeed, function () {
                    _removeImage();
                });
                swipeDiff = 0;
            }
            inProgress = true;
            _onLoadStart();
            setTimeout(function () {
                var swipeStart = 0;
                var swipeEnd = 0;
                var imagePosLeft = 0;
                var imgPath = target.attr('href');
                // if (imgPath === undefined) {
                //     imgPath = target.attr('data-lightbox');
                // }
                var videoOptions = target.data('ilb2Video');
                var element = $();
                var preloadedVideo;
                if (videoOptions) {
                    $.each(videos, function (_, video) {
                        if (video.i === target.data('ilb2VideoId')) {
                            preloadedVideo = video.l;
                            element = video.e;
                            if (video.a) {
                                if (preloadedVideo === false) {
                                    element.attr('autoplay', video.a);
                                }
                                if (preloadedVideo === true) {
                                    void element.get(0).play();
                                }
                            }
                        }
                    });
                }
                else {
                    element = $('<img id=\'' + options.id + '\' />')
                        .attr('src', imgPath);
                }
                function onload() {
                    var params = { opacity: 1 };
                    image.appendTo($wrapper);
                    _setImage();
                    image.css('opacity', 0);
                    if (hasCssTransitionSupport) {
                        cssTransitionTranslateX(image, (-100 * direction).toString() + 'px', 0);
                        setTimeout(function () {
                            cssTransitionTranslateX(image, '0px', options.animationSpeed / 1000);
                        }, 50);
                    }
                    else {
                        imagePosLeft = parseInt(image.css('left'));
                        params.left = imagePosLeft.toString() + 'px';
                        image.css('left', (imagePosLeft - 100 * direction).toString() + 'px');
                    }
                    image.animate(params, options.animationSpeed, function () {
                        inProgress = false;
                        _onLoadEnd();
                    });
                    if (options.preloadNext) {
                        var nextTarget = targets.eq(targets.index(target) + 1);
                        if (!nextTarget.length) {
                            nextTarget = targets.eq(0);
                        }
                        $('<img />').attr('src', nextTarget.attr('href'));
                    }
                    $wrapper.trigger('loaded.ilb2');
                }
                function onclick(e) {
                    e.preventDefault();
                    if (options.quitOnImgClick) {
                        _quitImageLightbox();
                        return;
                    }
                    if (wasTouched(e.originalEvent)) {
                        return;
                    }
                    var posX = (e.pageX || e.originalEvent.pageX) - e.target.offsetLeft;
                    if (e.target.width / 3 > posX) {
                        _previousTarget();
                    }
                    else {
                        _nextTarget();
                    }
                }
                image = element
                    .on('load.ilb7', onload)
                    .on('error.ilb7', function () {
                    _onLoadEnd();
                })
                    .on('touchstart.ilb7 pointerdown.ilb7 MSPointerDown.ilb7', function (e) {
                    if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                        return;
                    }
                    if (hasCssTransitionSupport) {
                        imagePosLeft = parseInt(image.css('left'));
                    }
                    swipeStart = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                })
                    .on('touchmove.ilb7 pointermove.ilb7 MSPointerMove.ilb7', function (e) {
                    if ((!hasPointers && e.type === 'pointermove') || !wasTouched(e.originalEvent) || options.quitOnImgClick) {
                        return;
                    }
                    e.preventDefault();
                    swipeEnd = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                    swipeDiff = swipeStart - swipeEnd;
                    if (hasCssTransitionSupport) {
                        cssTransitionTranslateX(image, (-swipeDiff).toString() + 'px', 0);
                    }
                    else {
                        image.css('left', (imagePosLeft - swipeDiff).toString() + 'px');
                    }
                })
                    .on('touchend.ilb7 touchcancel.ilb7 pointerup.ilb7 pointercancel.ilb7 MSPointerUp.ilb7 MSPointerCancel.ilb7', function (e) {
                    if (!wasTouched(e.originalEvent) || options.quitOnImgClick) {
                        return;
                    }
                    if (Math.abs(swipeDiff) > 50) {
                        if (swipeDiff < 0) {
                            _previousTarget();
                        }
                        else {
                            _nextTarget();
                        }
                    }
                    else {
                        if (hasCssTransitionSupport) {
                            cssTransitionTranslateX(image, '0px', options.animationSpeed / 1000);
                        }
                        else {
                            image.animate({ 'left': imagePosLeft.toString() + 'px' }, options.animationSpeed / 2);
                        }
                    }
                });
                if (preloadedVideo === true) {
                    onload();
                }
                if (preloadedVideo === false) {
                    image = image.on('loadedmetadata.ilb7', onload);
                }
                if (!videoOptions) {
                    image = image.on(hasPointers ? 'pointerup.ilb7 MSPointerUp.ilb7' : 'click.ilb7', onclick);
                }
            }, options.animationSpeed + 100);
        }, _removeImage = function () {
            if (!image.length) {
                return;
            }
            image.remove();
            image = $();
        }, _openImageLightbox = function ($target, noHistory) {
            if (inProgress) {
                return;
            }
            inProgress = false;
            target = $target;
            targetIndex = targets.index(target);
            if (!noHistory) {
                _pushToHistory();
            }
            _onStart();
            $body.append($wrapper)
                .addClass('imagelightbox-open');
            $wrapper.trigger('start.ilb2', $target);
            _loadImage(0);
        }, _quitImageLightbox = function (noHistory) {
            if (noHistory === void 0) { noHistory = false; }
            targetIndex = -1;
            if (!noHistory) {
                _pushQuitToHistory();
            }
            $wrapper.trigger('quit.ilb2');
            $body.removeClass('imagelightbox-open');
            if (!image.length) {
                return;
            }
            image.animate({ 'opacity': 0 }, options.animationSpeed, function () {
                _removeImage();
                inProgress = false;
                $wrapper.remove().find('*').remove();
            });
        }, _addTargets = function (newTargets) {
            newTargets.each(function () {
                targets = newTargets.add($(this));
            });
            newTargets.on('click.ilb7', { set: targetSet }, function (e) {
                e.preventDefault();
                targetSet = $(e.currentTarget).data('imagelightbox');
                filterTargets();
                if (targets.length < 1) {
                    _quitImageLightbox();
                }
                else {
                    _openImageLightbox($(this), false);
                }
            });
            function filterTargets() {
                newTargets
                    .filter(function () {
                    return $(this).data('imagelightbox') === targetSet;
                })
                    .filter(function () {
                    return isTargetValid($(this));
                })
                    .each(function () {
                    targets = targets.add($(this));
                });
            }
        }, _preloadVideos = function (elements) {
            elements.each(function () {
                var videoOptions = $(this).data('ilb2Video');
                if (videoOptions) {
                    var id = $(this).data('ilb2Id');
                    if (!id) {
                        id = 'a' + (((1 + Math.random()) * 0x10000) | 0).toString(16); // Random id
                    }
                    $(this).data('ilb2VideoId', id);
                    var container_1 = { e: $('<video id=\'' + options.id + '\' preload=\'metadata\' data-ilb2-video-id=\'' + id + '\'>'), i: id, l: false, a: undefined, h: undefined, w: undefined };
                    $.each(videoOptions, function (key, value) {
                        switch (key) {
                            case 'autoplay':
                                container_1.a = value;
                                break;
                            case 'height':
                                container_1.h = value;
                                break;
                            case 'sources':
                                break;
                            case 'width':
                                container_1.w = value;
                                break;
                            default:
                                // TODO: Remove this general behaviour
                                container_1.e = container_1.e.attr(key, value);
                        }
                    });
                    if (videoOptions.sources) {
                        $.each(videoOptions.sources, function (_, source) {
                            var sourceElement = $('<source>');
                            $.each(source, function (key, value) {
                                // TODO: Remove this general behaviour
                                sourceElement = sourceElement.attr(key, value);
                            });
                            container_1.e.append(sourceElement);
                        });
                    }
                    container_1.e.on('loadedmetadata.ilb7', function () {
                        container_1.l = true;
                    });
                    videos.push(container_1);
                }
            });
        };
        $(window).on('resize.ilb7', _setImage);
        if (hasHistorySupport && options.history) {
            $(window).on('popstate', _popHistory);
        }
        $(document).ready(function () {
            if (options.quitOnDocClick) {
                $(document).on(hasTouch ? 'touchend.ilb7' : 'click.ilb7', function (e) {
                    if (image.length && !$(e.target).is(image)) {
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                });
            }
            if (options.fullscreen && hasFullscreenSupport) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return;
                    }
                    if ([9, 32, 38, 40].includes(e.which)) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    if ([13].includes(e.which)) {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFullScreen();
                    }
                });
            }
            if (options.enableKeyboard) {
                $(document).on('keydown.ilb7', function (e) {
                    if (!image.length) {
                        return;
                    }
                    if ([27].includes(e.which) && options.quitOnEscKey) {
                        e.stopPropagation();
                        e.preventDefault();
                        _quitImageLightbox();
                    }
                    if ([37].includes(e.which)) {
                        e.stopPropagation();
                        e.preventDefault();
                        _previousTarget();
                    }
                    if ([39].includes(e.which)) {
                        e.stopPropagation();
                        e.preventDefault();
                        _nextTarget();
                    }
                });
            }
        });
        function toggleFullScreen() {
            var doc = window.document;
            var docEl = document.getElementById(options.id).parentElement;
            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var exitFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                void requestFullScreen.call(docEl);
            }
            else {
                void exitFullScreen.call(doc);
            }
        }
        $(document).off('.ilb7 .ilb2', options.selector);
        _addTargets($(this));
        _openHistory();
        _preloadVideos(targets);
        this.addToImageLightbox = function (elements) {
            _addTargets(elements);
            _preloadVideos(elements);
        };
        this.openHistory = function () {
            _openHistory();
        };
        this.loadPreviousImage = function () {
            _previousTarget();
        };
        this.loadNextImage = function () {
            _nextTarget();
        };
        this.quitImageLightbox = function () {
            _quitImageLightbox();
            return this;
        };
        this.startImageLightbox = function (element) {
            if (element)
                element.trigger('click.ilb7');
            else
                $(this).trigger('click.ilb7');
        };
        return this;
    };
}));

"use strict";
/* exported ILBOptions */

"use strict";

"use strict";
/* exported PreloadedVideo */

"use strict";
/* exported VideoOptions */

"use strict";
/* exported VideoSourceOptions */
